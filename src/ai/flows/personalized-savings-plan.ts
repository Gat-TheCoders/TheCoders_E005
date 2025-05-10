// src/ai/flows/personalized-savings-plan.ts
'use server';

/**
 * @fileOverview A personalized savings plan generator AI agent.
 *
 * - generateSavingsPlan - A function that handles the savings plan generation process.
 * - GenerateSavingsPlanInput - The input type for the generateSavingsPlan function.
 * - GenerateSavingsPlanOutput - The return type for the generateSavingsPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSavingsPlanInputSchema = z.object({
  income: z.number().describe('Your monthly income in INR.'),
  expenses: z.number().describe('Your monthly expenses in INR.'),
  financialGoals: z.string().describe('Your financial goals (e.g., "Save ₹1,00,000 for a down payment", "Invest for retirement").'),
});
export type GenerateSavingsPlanInput = z.infer<typeof GenerateSavingsPlanInputSchema>;

const GenerateSavingsPlanOutputSchema = z.object({
  savingsPlan: z.string().describe('A personalized savings plan.'),
});
export type GenerateSavingsPlanOutput = z.infer<typeof GenerateSavingsPlanOutputSchema>;

export async function generateSavingsPlan(input: GenerateSavingsPlanInput): Promise<GenerateSavingsPlanOutput> {
  return generateSavingsPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSavingsPlanPrompt',
  input: {schema: GenerateSavingsPlanInputSchema},
  output: {schema: GenerateSavingsPlanOutputSchema},
  prompt: `You are a financial advisor specializing in creating personalized savings plans, with a focus on the Indian context.

  Based on the user's income, expenses, and financial goals (assume all monetary values are in Indian Rupees - INR), generate a detailed savings plan.
  The plan should be actionable and provide specific suggestions. Consider common Indian savings and investment options where appropriate.

  Income (INR): {{{income}}}
  Expenses (INR): {{{expenses}}}
  Financial Goals: {{{financialGoals}}}

  Savings Plan:`,
});

const generateSavingsPlanFlow = ai.defineFlow(
  {
    name: 'generateSavingsPlanFlow',
    inputSchema: GenerateSavingsPlanInputSchema,
    outputSchema: GenerateSavingsPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

