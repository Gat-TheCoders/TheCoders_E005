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
  income: z.number().describe('Your monthly income.'),
  expenses: z.number().describe('Your monthly expenses.'),
  financialGoals: z.string().describe('Your financial goals.'),
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
  prompt: `You are a financial advisor specializing in creating personalized savings plans.

  Based on the user's income, expenses, and financial goals, generate a detailed savings plan.

  Income: {{{income}}}
  Expenses: {{{expenses}}}
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
