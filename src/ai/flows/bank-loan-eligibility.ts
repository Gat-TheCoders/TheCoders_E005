'use server';
/**
 * @fileOverview Assesses bank loan eligibility based on income and other financial criteria.
 *
 * - assessLoanEligibility - A function that assesses loan eligibility and suggests potential lenders.
 * - BankLoanEligibilityInput - The input type for the assessLoanEligibility function.
 * - BankLoanEligibilityOutput - The return type for the assessLoanEligibility function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BankLoanEligibilityInputSchema = z.object({
  monthlyIncome: z
    .number({required_error: "Monthly income is required."})
    .positive({message: "Monthly income must be a positive number."})
    .describe('The applicant\'s gross monthly income.'),
  employmentStatus: z
    .enum(['Employed', 'Self-Employed', 'Unemployed', 'Student', 'Retired', 'Other'], {required_error: "Employment status is required."})
    .describe('The applicant\'s current employment status.'),
  desiredLoanAmount: z
    .number()
    .positive({message: "Desired loan amount must be a positive number."})
    .optional()
    .describe('The desired loan amount, if known.'),
  loanPurpose: z
    .string()
    .min(3, {message: "Loan purpose should be at least 3 characters."})
    .optional()
    .describe('The purpose of the loan (e.g., car purchase, home renovation, debt consolidation).'),
  creditScoreEstimate: z
    .enum(['Excellent (750+)', 'Good (700-749)', 'Fair (650-699)', 'Poor (Below 650)', 'Unknown'], {required_error: "Credit score estimate is required."})
    .describe('An estimated credit score range.'),
  existingMonthlyDebtPayments: z
    .number()
    .nonnegative({message: "Existing monthly debt payments cannot be negative."})
    .optional()
    .describe('Total monthly payments for existing debts (e.g., credit cards, other loans).'),
});
export type BankLoanEligibilityInput = z.infer<typeof BankLoanEligibilityInputSchema>;

const BankLoanEligibilityOutputSchema = z.object({
  eligibilityAssessment: z
    .string()
    .describe('A qualitative assessment of loan eligibility (e.g., "Likely Eligible", "Potentially Eligible with Conditions", "Challenging based on provided information").'),
  keyFactors: z
    .string()
    .describe('Brief explanation of the key factors influencing the assessment, focusing on income, debt-to-income ratio (if applicable), credit score estimate, and employment status.'),
  suggestedNextSteps: z
    .string()
    .describe('General recommendations for next steps, such as documents to prepare (e.g., proof of income, ID) or actions to improve eligibility (e.g., reduce debt). Provide 2-3 actionable bullet points.'),
  potentialLenders: z
    .array(
      z.object({
        bankName: z
          .string()
          .describe('Specific name of a recognizable financial institution or lender (e.g., "Chase Bank", "Bank of America", "SoFi").'),
        loanProducts: z
          .array(z.string())
          .describe('Examples of loan products they typically offer relevant to the user\'s potential needs (e.g., "Personal Loans", "Auto Loans", "Secured Loans").'),
        typicalInterestRateInfo: z
          .string()
          .describe('General information about typical interest rates for such lenders (e.g., "May offer competitive rates for applicants with good to excellent credit", "Interest rates might be higher for fair credit").'),
        commonRequirements: z
          .string()
          .describe('Common requirements or characteristics of these lenders (e.g., "Often require stable income and good credit history", "May have more flexible criteria but potentially higher rates").'),
      })
    )
    .describe('A list of 2-3 example specific financial institutions with illustrative loan product information. This is for informational purposes and not a live list of offers or endorsements.'),
});
export type BankLoanEligibilityOutput = z.infer<typeof BankLoanEligibilityOutputSchema>;

export async function assessLoanEligibility(
  input: BankLoanEligibilityInput
): Promise<BankLoanEligibilityOutput> {
  return assessLoanEligibilityFlow(input);
}

const assessLoanEligibilityPrompt = ai.definePrompt({
  name: 'assessLoanEligibilityPrompt',
  input: {schema: BankLoanEligibilityInputSchema},
  output: {schema: BankLoanEligibilityOutputSchema},
  prompt: `You are an AI financial assistant. Your role is to provide a general assessment of loan eligibility based on the information provided by the user.
This is a simulation for educational purposes and NOT a guarantee of a loan or specific terms. Do not ask for personally identifiable information.

User's Financial Profile:
- Monthly Income: {{{monthlyIncome}}}
- Employment Status: {{{employmentStatus}}}
- Desired Loan Amount: {{#if desiredLoanAmount}}{{{desiredLoanAmount}}}{{else}}Not specified{{/if}}
- Loan Purpose: {{#if loanPurpose}}{{{loanPurpose}}}{{else}}Not specified{{/if}}
- Estimated Credit Score: {{{creditScoreEstimate}}}
- Existing Monthly Debt Payments: {{#if existingMonthlyDebtPayments}}{{{existingMonthlyDebtPayments}}}{{else}}Not specified or N/A{{/if}}

Based on this profile, provide:
1.  **Eligibility Assessment**: A qualitative assessment (e.g., "Likely Eligible," "Potentially Eligible with Conditions," "Challenging based on provided information").
2.  **Key Factors**: Briefly explain the key factors influencing this assessment. Consider income, debt-to-income ratio (if calculable with provided data), credit score estimate, and employment stability.
3.  **Suggested Next Steps**: Recommend 2-3 general next steps for the user (e.g., "Gather proof of income," "Check your credit report for accuracy," "Consider reducing existing debt if possible").
4.  **Potential Lenders**: List 2-3 *specific, recognizable financial institutions* (e.g., "Chase Bank", "Bank of America", "Wells Fargo", "Discover Personal Loans", "SoFi") that a person with this profile might consider. For each:
    *   Provide their specific name.
    *   List 1-2 examples of relevant loan products they might offer (e.g., "Personal Loans", "Auto Loans").
    *   Give general information about their typical interest rates or credit requirements (e.g., "Often require good to excellent credit", "May offer competitive rates for strong profiles").
    *   Mention any common requirements or characteristics (e.g., "National presence, online application", "Focus on digital-first experience").
    IMPORTANT: Emphasize that this list is illustrative, not an endorsement, and actual terms and eligibility require direct application to the lender and are subject to credit approval and other factors.

Ensure your entire response conforms to the output schema.
The "suggestedNextSteps" should be formatted as bullet points if possible within the string.
The "potentialLenders" array should contain 2 to 3 entries.
`,
});

const assessLoanEligibilityFlow = ai.defineFlow(
  {
    name: 'assessLoanEligibilityFlow',
    inputSchema: BankLoanEligibilityInputSchema,
    outputSchema: BankLoanEligibilityOutputSchema,
  },
  async input => {
    // Basic validation for debt-to-income if applicable
    if (input.existingMonthlyDebtPayments && input.existingMonthlyDebtPayments > input.monthlyIncome) {
        // This is a very basic check, AI can do more nuanced assessment
        // but we can provide a hint or adjust the prompt if needed.
        // For now, let the AI handle the interpretation.
    }

    const {output} = await assessLoanEligibilityPrompt(input);
    if (!output) {
      throw new Error("Failed to get a response from the AI model.");
    }
    // Ensure suggestedNextSteps is formatted, e.g. with newlines for bullets
    // The model should ideally provide this, but we can add a fallback.
    // For now, assume the model handles it based on prompt instructions.
    return output;
  }
);

