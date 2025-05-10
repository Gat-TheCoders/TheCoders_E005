'use server';
/**
 * @fileOverview Analyzes user expenses, suggests reductions, and provides a plan to optimize savings and investments.
 *
 * - analyzeExpensesAndOptimizeSavings - A function that analyzes expenses and provides optimization advice.
 * - ExpenseOptimizerInput - The input type for the analyzeExpensesAndOptimizeSavings function.
 * - ExpenseOptimizerOutput - The return type for the analyzeExpensesAndOptimizeSavings function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExpenseCategoryInputSchema = z.object({
  categoryName: z
    .string({ required_error: "Category name is required."})
    .min(1, { message: "Category name cannot be empty." })
    .describe('Name of the expense category (e.g., Groceries, Dining Out).'),
  amountSpent: z
    .number({ required_error: "Amount spent is required."})
    .positive({ message: "Amount spent must be a positive number." })
    .describe('Amount spent in this category for the period (typically monthly).'),
});

const ExpenseOptimizerInputSchema = z.object({
  monthlyIncome: z
    .number({ required_error: "Monthly income is required."})
    .positive({ message: "Monthly income must be a positive number." })
    .describe('User\'s total gross monthly income.'),
  expenseCategories: z
    .array(ExpenseCategoryInputSchema)
    .min(1, { message: "At least one expense category is required." })
    .describe('A list of user-defined expense categories and amounts spent.'),
  savingsGoals: z
    .string({ required_error: "Savings goals are required."})
    .min(10, { message: "Please describe your savings goals in at least 10 characters." })
    .describe('User\'s financial savings or investment goals (e.g., "Save for a vacation in 6 months", "Invest 15% of income for retirement", "Build a $5000 emergency fund").'),
});
export type ExpenseOptimizerInput = z.infer<typeof ExpenseOptimizerInputSchema>;

const ReductionSuggestionSchema = z.object({
  categoryName: z
    .string()
    .describe('The expense category where a reduction is suggested.'),
  suggestedReductionAmount: z
    .number()
    .describe('The suggested monetary amount by which to reduce spending in this category per month.'),
  potentialMonthlySavings: z
    .number()
    .describe('The potential monthly savings if this suggestion is implemented.'),
  reasoning: z
    .string()
    .describe('A brief explanation for why this reduction is suggested and how it might be achieved.'),
});

const InvestmentIdeaSchema = z.object({
  type: z
    .string()
    .describe('General type of investment (e.g., "High-Yield Savings Account", "Index Funds", "ETFs").'),
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
    .describe('A general overview of the user\'s spending habits based on the provided income and expenses. Highlight key areas of spending.'),
  reductionSuggestions: z
    .array(ReductionSuggestionSchema)
    .describe('A list of actionable suggestions for reducing expenses in specific categories. Aim for 2-4 realistic suggestions.'),
  savingsOptimizationPlan: z
    .string()
    .describe('A plan outlining how the potential monthly savings (sum of all suggested reductions) can be allocated towards the user\'s stated savings goals. Show the impact on achieving these goals (e.g., faster achievement, increased contribution).'),
  investmentIdeas: z
    .array(InvestmentIdeaSchema)
    .optional()
    .describe('Up to 2-3 general investment ideas suitable for the increased savings capacity, if applicable. These should be educational and not specific financial advice.'),
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
  prompt: `You are an AI financial assistant. Your task is to analyze a user's income, expenses, and savings goals to provide personalized recommendations for expense reduction and savings optimization.

User's Financial Profile:
- Monthly Income: {{{monthlyIncome}}}
- Expense Categories:
{{#each expenseCategories}}
  - {{categoryName}}: {{amountSpent}}
{{/each}}
- Savings Goals: {{{savingsGoals}}}

Based on this profile, please provide:

1.  **Expense Analysis (expenseAnalysis)**:
    *   Give a brief overview of their spending. Calculate total monthly expenses.
    *   Calculate the percentage of income spent on each category and highlight any categories that seem unusually high compared to typical budgets, or if total expenses exceed income.

2.  **Reduction Suggestions (reductionSuggestions)**:
    *   Provide 2-4 specific, actionable suggestions for reducing expenses.
    *   For each suggestion:
        *   Identify the 'categoryName'.
        *   Suggest a 'suggestedReductionAmount' (a specific monetary value for monthly reduction).
        *   Calculate the 'potentialMonthlySavings' (which will be the same as suggestedReductionAmount).
        *   Provide 'reasoning' (e.g., "Consider reducing dining out by $X by cooking more meals at home," or "Look for cheaper alternatives for subscriptions, potentially saving $Y/month").
    *   Focus on realistic and impactful changes. Avoid overly drastic or vague suggestions.

3.  **Savings Optimization Plan (savingsOptimizationPlan)**:
    *   Calculate the total potential monthly savings from all suggestions.
    *   Explain how these newly freed-up funds can be strategically allocated to accelerate their stated 'savingsGoals'.
    *   For example, if they want to build an emergency fund, show how much faster they could reach it. If they want to invest more, show the increased investment amount.

4.  **Investment Ideas (investmentIdeas)** (Optional, provide 0 to 3 ideas):
    *   If the user has significant potential savings or expresses investment goals, suggest 2-3 *general* types of investments (e.g., "High-Yield Savings Account," "Index Funds (ETFs or Mutual Funds)," "Robo-Advisors").
    *   For each 'type', provide a brief 'description' of what it is and its general purpose/benefit (e.g., "Index funds offer diversification by tracking a market index").
    *   Optionally, note a general 'riskLevel' (Low, Medium, High, Varies).
    *   **Do NOT recommend specific stocks, funds, or platforms.** Keep it educational. If savings goals are very short-term or income is tight, it might be better to provide fewer or no investment ideas and focus on savings.

5.  **Disclaimer (disclaimer)**:
    *   Include a standard disclaimer: "The suggestions provided are for informational and educational purposes only and do not constitute financial advice. Actual results may vary. Please consult with a qualified financial advisor for personalized financial planning."

Ensure your entire response conforms to the output schema.
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

    