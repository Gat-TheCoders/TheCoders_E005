
'use server';

/**
 * @fileOverview Simulates a credit score based on transaction and mobile usage patterns,
 * provides benefits of good credit, and suggests potentially eligible cards.
 *
 * - simulateCreditScore - A function that simulates the credit score and related information.
 * - CreditScoreSimulationInput - The input type for the simulateCreditScore function.
 * - CreditScoreSimulationOutput - The return type for the simulateCreditScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreditScoreSimulationInputSchema = z.object({
  transactionPatterns: z
    .string({ required_error: "Transaction patterns description is required."})
    .min(5, { message: "Please provide a detailed description of transaction patterns (min 5 characters)." })
    .describe('Detailed description of transaction patterns, including frequency, amounts, and types of transactions.'),
  mobileUsagePatterns: z
    .string({ required_error: "Mobile usage patterns description is required."})
    .min(5, { message: "Please provide a detailed description of mobile usage patterns (min 5 characters)." })
    .describe('Detailed description of mobile usage patterns, including data consumption, app usage, and call/message frequency.'),
  bankName: z
    .string()
    .optional()
    .describe('Name of the primary bank the user deals with.'),
  paymentHistory: z
    .string({ required_error: "Payment history description is required."})
    .min(10, { message: "Describe payment history (min 10 characters)." })
    .describe('Description of payment history, including on-time payments, late payments, defaults, etc.'),
  creditUtilization: z
    .coerce.number({invalid_type_error: "Credit utilization must be a number."})
    .min(0, { message: "Credit utilization must be 0 or greater."})
    .max(100, { message: "Credit utilization cannot exceed 100."})
    .optional()
    .describe('Percentage of total available credit currently being used (e.g., 30 for 30%).'),
  lengthOfCreditHistory: z
    .string()
    .min(3, { message: "Length of credit history should be at least 3 characters."})
    .optional()
    .describe('Length of the user\'s credit history (e.g., "2 years", "5+ years", "Less than 6 months").'),
  creditMix: z
    .string({ required_error: "Credit mix description is required."})
    .min(5, { message: "Describe credit mix (min 5 characters)." })
    .describe('Description of the types of credit accounts held (e.g., credit cards, auto loans, mortgages, student loans).'),
  newCredit: z
    .string({ required_error: "New credit information is required."})
    .min(5, { message: "Describe new credit activity (min 5 characters)." })
    .describe('Information about recent credit applications or newly opened accounts.'),
});
export type CreditScoreSimulationInput = z.infer<typeof CreditScoreSimulationInputSchema>;

const EligibleCardSchema = z.object({
  cardName: z.string().describe('Specific name of the credit or debit card (e.g., "Chase Sapphire Preferred", "Capital One Quicksilver").'),
  cardType: z.enum(['Credit Card', 'Debit Card']).describe('Type of the card.'),
  issuer: z.string().describe('The issuing bank or financial institution (e.g., "Chase", "Capital One", "American Express").'),
  keyFeatures: z.array(z.string()).describe('List of 2-4 key features or benefits of the card (e.g., "Rewards points", "Cashback", "Travel benefits", "No annual fee").'),
  typicalCreditScoreRange: z.string().describe('A general credit score range typically required or targeted for this card (e.g., "Good to Excellent (700+)", "Fair (600-699)", "For building credit"). This is an estimate.'),
  notes: z.string().optional().describe('Brief additional notes or suitability for the card (e.g., "Good for travel rewards", "Suitable for building credit", "Requires good to excellent credit for approval").'),
});

const CreditScoreSimulationOutputSchema = z.object({
  simulatedCreditScore: z
    .number()
    .describe('The simulated credit score based on the provided patterns, typically between 300 and 850.'),
  factorsInfluencingScore: z
    .string()
    .describe('Explanation of the key factors that influenced the simulated credit score. Highlight positive and negative contributors if possible.'),
  benefitsOfGoodCreditScore: z
    .string()
    .describe('A summary of general benefits of having a good credit score, formatted as 3-4 bullet points.'),
  eligibleCards: z
    .array(EligibleCardSchema)
    .min(1, { message: "At least one card suggestion should be provided."})
    .max(3, { message: "Provide no more than 3 card suggestions."})
    .describe('A list of 1-3 specific credit or debit cards the user might be eligible for based on their simulated score. If the score is very low, suggest secured credit cards or debit cards primarily designed for credit building.'),
  disclaimer: z
    .string()
    .describe('A disclaimer stating that the score is a simulation and card suggestions are illustrative, not guarantees of approval.')
});
export type CreditScoreSimulationOutput = z.infer<typeof CreditScoreSimulationOutputSchema>;

export async function simulateCreditScore(
  input: CreditScoreSimulationInput
): Promise<CreditScoreSimulationOutput> {
  return simulateCreditScoreFlow(input);
}

const simulateCreditScorePrompt = ai.definePrompt({
  name: 'simulateCreditScorePrompt',
  input: {schema: CreditScoreSimulationInputSchema},
  output: {schema: CreditScoreSimulationOutputSchema},
  prompt: `You are an AI model that simulates credit scores based on user-provided financial and behavioral patterns.
The simulated credit score should be a number between 300 and 850.

Analyze the following user inputs:
- Transaction Patterns: {{{transactionPatterns}}}
- Mobile Usage Patterns: {{{mobileUsagePatterns}}}
{{#if bankName}}- Primary Bank Name: {{{bankName}}}{{/if}}
- Payment History: {{{paymentHistory}}}
{{#if creditUtilization}}- Credit Utilization (%): {{{creditUtilization}}}%{{else}}- Credit Utilization (%): Not Specified{{/if}}
{{#if lengthOfCreditHistory}}- Length of Credit History: {{{lengthOfCreditHistory}}}{{else}}- Length of Credit History: Not Specified{{/if}}
- Credit Mix: {{{creditMix}}}
- New Credit Activity: {{{newCredit}}}

Based on this comprehensive analysis, provide the following information:
1.  **Simulated Credit Score (simulatedCreditScore)**: The estimated numerical credit score.
2.  **Factors Influencing Score (factorsInfluencingScore)**: Explain the key factors derived from ALL inputs that influenced this simulated score. Specifically mention how payment history, credit utilization (low is good, high is bad), length of credit history (longer is generally better), credit mix (diverse and well-managed is good), and new credit (too much new credit can be negative) contributed. Also consider the transaction and mobile usage patterns.
3.  **Benefits of a Good Credit Score (benefitsOfGoodCreditScore)**: Provide 3-4 general benefits of maintaining a good credit score, formatted as bullet points (e.g., "- Better interest rates on loans and credit cards.").
4.  **Eligible Card Suggestions (eligibleCards)**: Based *only* on the *simulatedCreditScore*, suggest 1-3 specific, recognizable credit or debit cards that someone with such a score might typically be eligible for.
    *   If the simulated score is low (e.g., below 600-650), prioritize secured credit cards or debit cards suitable for credit building.
    *   For each card, include:
        *   'cardName': Specific name (e.g., "Discover it® Secured Credit Card", "Chase Freedom Rise℠", "HDFC Millennia Credit Card").
        *   'cardType': "Credit Card" or "Debit Card".
        *   'issuer': The bank or company (e.g., "Discover", "Chase", "HDFC Bank").
        *   'keyFeatures': An array of 2-4 brief, attractive features (e.g., ["Builds credit history", "No annual fee", "Cashback rewards"]).
        *   'typicalCreditScoreRange': A general textual description of the credit score this card usually targets (e.g., "Fair (580-669)", "Good for building credit", "Excellent (750+)", "No credit history required").
        *   'notes': (Optional) A very brief note on suitability (e.g., "Good for students.", "Reports to all 3 credit bureaus.").
5.  **Disclaimer (disclaimer)**: Include the following exact disclaimer: "This credit score is a simulation based on the limited information provided and is for educational purposes only. It does not reflect your actual credit score and is not an official credit assessment. Card suggestions are illustrative examples and not a guarantee of approval; actual eligibility depends on the card issuer's criteria and a formal application."

Ensure your entire response strictly conforms to the output schema.
The "benefitsOfGoodCreditScore" should be formatted as bullet points within the string.
The "eligibleCards" array must contain 1 to 3 entries.
`,
});

const simulateCreditScoreFlow = ai.defineFlow(
  {
    name: 'simulateCreditScoreFlow',
    inputSchema: CreditScoreSimulationInputSchema,
    outputSchema: CreditScoreSimulationOutputSchema,
  },
  async input => {
    const {output} = await simulateCreditScorePrompt(input);
    if (!output) {
        throw new Error("The AI model did not return an output for credit score simulation.");
    }
     // Ensure disclaimer is always present, even if the model somehow forgets it
    if (!output.disclaimer) {
        output.disclaimer = "This credit score is a simulation based on the limited information provided and is for educational purposes only. It does not reflect your actual credit score and is not an official credit assessment. Card suggestions are illustrative examples and not a guarantee of approval; actual eligibility depends on the card issuer's criteria and a formal application.";
    }
    // Basic validation for simulated score range, can be expanded
    if (output.simulatedCreditScore < 300 || output.simulatedCreditScore > 850) {
        console.warn(`Simulated credit score ${output.simulatedCreditScore} is outside the typical 300-850 range. Clamping it or re-evaluating prompt.`);
        // Example: Clamp score to be within range, or decide if this is an error state
        output.simulatedCreditScore = Math.max(300, Math.min(850, output.simulatedCreditScore));
    }
    return output;
  }
);

