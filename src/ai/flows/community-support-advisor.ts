'use server';
/**
 * @fileOverview Simulates a community support fund allocation to a user's virtual wallet.
 *
 * - simulateCommunitySupport - A function that simulates a financial support allocation.
 * - CommunitySupportAdvisorInput - The input type for the simulateCommunitySupport function.
 * - CommunitySupportAdvisorOutput - The return type for the simulateCommunitySupport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CommunitySupportAdvisorInputSchema = z.object({
  currentSituation: z
    .string({ required_error: "Please describe your current situation."})
    .min(50, { message: "Please provide more details about your situation (min 50 characters)." })
    .describe('A brief description of the user\'s current financial hardship or need for support.'),
  monthlyIncome: z
    .number({ required_error: "Monthly income is required."})
    .nonnegative({ message: "Monthly income cannot be negative." })
    .describe('The user\'s current total monthly income in INR.'),
  householdSize: z
    .number({ required_error: "Household size is required."})
    .int()
    .positive({ message: "Household size must be a positive integer." })
    .describe('Number of people in the user\'s household.'),
  reasonForSupport: z
    .enum(['Job Loss', 'Medical Emergency', 'Unexpected Essential Expense', 'Low Income', 'Natural Disaster Impact', 'Other'], { required_error: "Reason for seeking support is required."})
    .describe('The primary reason the user is seeking support.'),
});
export type CommunitySupportAdvisorInput = z.infer<typeof CommunitySupportAdvisorInputSchema>;

const CommunitySupportAdvisorOutputSchema = z.object({
  simulatedWalletCredit: z
    .number()
    .describe('A simulated amount in INR credited to a virtual community support wallet for the user. This is not real money.'),
  advisorMessage: z
    .string()
    .describe('A message from the AI advisor explaining the simulated credit, its basis, and emphasizing its fictional nature.'),
  guidanceForRealSupport: z
    .string()
    .describe('Information and actionable steps on how to seek actual financial assistance or support from real-world organizations or programs. Include 2-3 bullet points.'),
});
export type CommunitySupportAdvisorOutput = z.infer<typeof CommunitySupportAdvisorOutputSchema>;

export async function simulateCommunitySupport(
  input: CommunitySupportAdvisorInput
): Promise<CommunitySupportAdvisorOutput> {
  return communitySupportAdvisorFlow(input);
}

const communitySupportAdvisorPrompt = ai.definePrompt({
  name: 'communitySupportAdvisorPrompt',
  input: {schema: CommunitySupportAdvisorInputSchema},
  output: {schema: CommunitySupportAdvisorOutputSchema},
  prompt: `You are an AI simulating a "Community Support Advisor". Your role is to assess a user's described situation and determine a *hypothetical* financial support amount (in INR) that could be credited to their *simulated digital wallet*.

  IMPORTANT: This is purely a simulation for educational and illustrative purposes. No real money is involved or disbursed. You must make this extremely clear in your response.

  User's Situation:
  - Description: {{{currentSituation}}}
  - Monthly Income (INR): {{{monthlyIncome}}}
  - Household Size: {{{householdSize}}}
  - Reason for Support: {{{reasonForSupport}}}

  Based on this information:
  1.  **Simulated Wallet Credit (simulatedWalletCredit)**: Determine a reasonable *simulated* monetary amount (e.g., between ₹1000 and ₹10000 INR, depending on severity and income) that a hypothetical community fund might allocate. This is fictional.
  2.  **Advisor Message (advisorMessage)**: Craft a message that:
      *   Clearly states the amount of the *simulated* credit in INR.
      *   Explains the factors you considered (e.g., income level vs. household size, nature of hardship).
      *   **Crucially, reiterate that this is a simulation, the "wallet" is virtual, and the "credited" amount is not real money.**
  3.  **Guidance for Real Support (guidanceForRealSupport)**: Provide 2-3 actionable bullet points suggesting how the user might seek *actual* financial assistance (e.g., "Search for local NGOs or government schemes offering financial aid in your area," "Check eligibility for state or central government assistance programs (e.g., for unemployment, food security, or specific hardships like medical emergencies)," "Contact community action agencies or local municipal corporations for resources.").

  Ensure your entire response conforms to the output schema. The simulatedWalletCredit should be a number.
  The guidanceForRealSupport should be formatted as bullet points within the string.
  Be empathetic but firm about the simulated nature of this exercise.
  `,
});

const communitySupportAdvisorFlow = ai.defineFlow(
  {
    name: 'communitySupportAdvisorFlow',
    inputSchema: CommunitySupportAdvisorInputSchema,
    outputSchema: CommunitySupportAdvisorOutputSchema,
  },
  async input => {
    const {output} = await communitySupportAdvisorPrompt(input);
    if (!output) {
      throw new Error("Failed to get a response from the Community Support Advisor AI model.");
    }
    return output;
  }
);

