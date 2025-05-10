'use server';

/**
 * @fileOverview Simulates a credit score based on transaction and mobile usage patterns.
 *
 * - simulateCreditScore - A function that simulates the credit score.
 * - CreditScoreSimulationInput - The input type for the simulateCreditScore function.
 * - CreditScoreSimulationOutput - The return type for the simulateCreditScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreditScoreSimulationInputSchema = z.object({
  transactionPatterns: z
    .string()
    .describe('Detailed description of transaction patterns, including frequency, amounts, and types of transactions.'),
  mobileUsagePatterns: z
    .string()
    .describe('Detailed description of mobile usage patterns, including data consumption, app usage, and call/message frequency.'),
});
export type CreditScoreSimulationInput = z.infer<typeof CreditScoreSimulationInputSchema>;

const CreditScoreSimulationOutputSchema = z.object({
  simulatedCreditScore: z
    .number()
    .describe('The simulated credit score based on the provided patterns.'),
  factorsInfluencingScore: z
    .string()
    .describe('Explanation of the factors that influenced the simulated credit score.'),
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
  prompt: `You are an AI model that simulates credit scores based on user-provided transaction and mobile usage patterns.

  Analyze the following transaction and mobile usage patterns to simulate a credit score and explain the factors influencing it.

  Transaction Patterns: {{{transactionPatterns}}}
  Mobile Usage Patterns: {{{mobileUsagePatterns}}}

  Provide a simulated credit score and explain the factors that influenced it. Ensure the simulated credit score is a number.
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
    return output!;
  }
);
