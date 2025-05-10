'use server';
/**
 * @fileOverview Analyzes user's income, transaction history, and savings goals to suggest expense reductions and provide a plan to optimize savings and investments.
 *
 * - analyzeExpensesAndOptimizeSavings - A function that analyzes expenses and provides optimization advice.
 * - ExpenseOptimizerInput - The input type for the analyzeExpensesAndOptimizeSavings function.
 * - ExpenseOptimizerOutput - The return type for the analyzeExpensesAndOptimizeSavings function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExpenseOptimizerInputSchema = z.object({
  monthlyIncome: z
    .number({ required_error: "Monthly income is required."})
    .positive({ message: "Monthly income must be a positive number." })
    .describe('User\'s total gross monthly income in INR.'),
  transactionHistoryDescription: z
    .string({ required_error: "Transaction history description is required."})
    .min(50, { message: "Please provide a detailed description of your transaction history (min 50 characters)." })
    .describe('A detailed textual description of recent transaction patterns from the digital wallet, including types of purchases, frequencies, typical amounts in INR, merchants, etc. This will be used to infer spending categories and habits.'),
  savingsGoals: z
    .string({ required_error: "Savings goals are required."})
    .min(10, { message: "Please describe your savings goals in at least 10 characters." })
    .describe('User\'s financial savings or investment goals (e.g., "Save for a vacation in 6 months", "Invest 15% of income for retirement", "Build a ₹50,000 emergency fund").'),
});
export type ExpenseOptimizerInput = z.infer<typeof ExpenseOptimizerInputSchema>;

const ReductionSuggestionSchema = z.object({
  categoryName: z
    .string()
    .describe('The inferred expense category where a reduction is suggested.'),
  suggestedReductionAmount: z
    .number()
    .describe('The suggested monetary amount in INR by which to reduce spending in this category per month.'),
  potentialMonthlySavings: z
    .number()
    .describe('The potential monthly savings in INR if this suggestion is implemented.'),
  reasoning: z
    .string()
    .describe('A brief explanation for why this reduction is suggested and how it might be achieved.'),
});

const InvestmentIdeaSchema = z.object({
  type: z
    .string()
    .describe('General type of investment (e.g., "High-Yield Savings Account", "Mutual Funds (SIP)", "Fixed Deposits", "Public Provident Fund (PPF)").'),
  description: z
    .string()
    .describe('A brief description of the investment type and its general characteristics or benefits.'),
  riskLevel: z
    .enum(['Low', 'Medium', 'High', 'Varies'])
    .optional()
    .describe('General risk level associated with this type of investment.'),
});

const ExpenseOptimizerOutputSchema = z.object({
  expenseAnalysis: z
    .string()
    .describe('A general overview of the user\'s spending habits based on the provided income and transaction history. Highlight key inferred areas of spending and estimated total expenses in INR.'),
  reductionSuggestions: z
    .array(ReductionSuggestionSchema)
    .describe('A list of actionable suggestions for reducing expenses in specific inferred categories. Aim for 2-4 realistic suggestions. All amounts in INR.'),
  savingsOptimizationPlan: z
    .string()
    .describe('A plan outlining how the potential monthly savings (sum of all suggested reductions, in INR) can be allocated towards the user\'s stated savings goals. Show the impact on achieving these goals (e.g., faster achievement, increased contribution).'),
  investmentIdeas: z
    .array(InvestmentIdeaSchema)
    .optional()
    .describe('Up to 2-3 general investment ideas suitable for the increased savings capacity, if applicable. These should be educational and not specific financial advice. Consider options commonly available in India.'),
  disclaimer: z
    .string()
    .describe('A brief disclaimer stating that these suggestions are for informational and educational purposes only and do not constitute financial advice. Advise consulting a professional financial advisor.')
});
export type ExpenseOptimizerOutput = z.infer<typeof ExpenseOptimizerOutputSchema>;

export async function analyzeExpensesAndOptimizeSavings(
  input: ExpenseOptimizerInput
): Promise<ExpenseOptimizerOutput> {
  return expenseOptimizerFlow(input);
}

const expenseOptimizerPrompt = ai.definePrompt({
  name: 'expenseOptimizerPrompt',
  input: {schema: ExpenseOptimizerInputSchema},
  output: {schema: ExpenseOptimizerOutputSchema},
  prompt: `You are an AI financial assistant. Your task is to analyze a user's income, transaction history description, and savings goals to provide personalized recommendations for expense reduction and savings optimization. All monetary values should be considered and presented in Indian Rupees (INR).

User's Financial Profile:
- Monthly Income (INR): {{{monthlyIncome}}}
- Transaction History Description (assume amounts in INR): {{{transactionHistoryDescription}}}
- Savings Goals (assume amounts in INR if specified): {{{savingsGoals}}}

Based on this profile, please provide:

1.  **Expense Analysis (expenseAnalysis)**:
    *   Infer primary expense categories (e.g., "Groceries", "Rent/EMI", "Utilities", "Dining Out", "Transport", "Subscriptions") and estimate monthly amounts spent in each based on the 'transactionHistoryDescription'.
    *   Give a brief overview of their spending habits. Calculate total estimated monthly expenses in INR.
    *   Highlight any inferred categories that seem unusually high compared to typical Indian budgets, or if total estimated expenses appear to exceed income.

2.  **Reduction Suggestions (reductionSuggestions)**:
    *   Based on the inferred expense categories, provide 2-4 specific, actionable suggestions for reducing expenses.
    *   For each suggestion:
        *   Identify the 'categoryName' (e.g., "Dining Out", "Subscriptions", "Shopping").
        *   Suggest a 'suggestedReductionAmount' (a specific monetary value in INR for monthly reduction, e.g., ₹500, ₹1000).
        *   Calculate the 'potentialMonthlySavings' (which will be the same as suggestedReductionAmount, in INR).
        *   Provide 'reasoning' (e.g., "Based on your transaction history, consider reducing dining out frequency to save approximately ₹X by cooking more meals at home," or "Review your subscriptions; cancelling unused ones could save ₹Y/month").
    *   Focus on realistic and impactful changes. Avoid overly drastic or vague suggestions.

3.  **Savings Optimization Plan (savingsOptimizationPlan)**:
    *   Calculate the total potential monthly savings in INR from all suggestions.
    *   Explain how these newly freed-up funds can be strategically allocated to accelerate their stated 'savingsGoals'.
    *   For example, if they want to build an emergency fund of ₹50,000, show how much faster they could reach it. If they want to invest more, show the increased investment amount.

4.  **Investment Ideas (investmentIdeas)** (Optional, provide 0 to 3 ideas):
    *   If the user has significant potential savings or expresses investment goals, suggest 2-3 *general* types of investments common in India (e.g., "High-Yield Savings Account," "Systematic Investment Plans (SIPs) in Mutual Funds," "Fixed Deposits (FDs)," "Public Provident Fund (PPF)").
    *   For each 'type', provide a brief 'description' of what it is and its general purpose/benefit (e.g., "SIPs in Mutual Funds offer diversification and rupee cost averaging by investing a fixed sum regularly").
    *   Optionally, note a general 'riskLevel' (Low, Medium, High, Varies).
    *   **Do NOT recommend specific stocks, funds, or platforms.** Keep it educational. If savings goals are very short-term or income is tight, it might be better to provide fewer or no investment ideas and focus on savings.

5.  **Disclaimer (disclaimer)**:
    *   Include a standard disclaimer: "The suggestions provided are for informational and educational purposes only and do not constitute financial advice. Actual results may vary. Please consult with a qualified financial advisor for personalized financial planning."

Ensure your entire response conforms to the output schema. All monetary values in the output should be treated as INR.
The 'reductionSuggestions' array should be practical.
The 'savingsOptimizationPlan' should clearly link savings to goals.
Be empathetic and encouraging in your tone.
`,
});

const expenseOptimizerFlow = ai.defineFlow(
  {
    name: 'expenseOptimizerFlow',
    inputSchema: ExpenseOptimizerInputSchema,
    outputSchema: ExpenseOptimizerOutputSchema,
  },
  async input => {
    const {output} = await expenseOptimizerPrompt(input);
    if (!output) {
      throw new Error("Failed to get a response from the AI model for expense optimization.");
    }
    // Ensure a disclaimer is always present
    if (!output.disclaimer) {
        output.disclaimer = "The suggestions provided are for informational and educational purposes only and do not constitute financial advice. Actual results may vary. Please consult with a qualified financial advisor for personalized financial planning.";
    }
    return output;
  }
);

