
'use server';
/**
 * @fileOverview AI flow to generate personalized savings plans based on user's income, expenses, and financial goals.
 *
 * - generateSavingsPlan - A function that takes user financial details and goals, then returns a personalized savings plan.
 * - PersonalizedSavingsPlanInput (type) - The input type for the generateSavingsPlan function.
 * - PersonalizedSavingsPlanOutput (type) - The return type for the generateSavingsPlan function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  PersonalizedSavingsPlanInputSchema,
  PersonalizedSavingsPlanOutputSchema,
  type PersonalizedSavingsPlanInput,
  type PersonalizedSavingsPlanOutput,
} from '@/ai/schemas/personalized-savings-plan-schemas';

export type { PersonalizedSavingsPlanInput, PersonalizedSavingsPlanOutput };

export async function generateSavingsPlan(
  input: PersonalizedSavingsPlanInput
): Promise<PersonalizedSavingsPlanOutput> {
  return personalizedSavingsPlanFlow(input);
}

const personalizedSavingsPlanPrompt = ai.definePrompt({
  name: 'personalizedSavingsPlanPrompt',
  input: { schema: PersonalizedSavingsPlanInputSchema },
  output: { schema: PersonalizedSavingsPlanOutputSchema },
  prompt: `You are an AI Financial Planner. Your task is to create a personalized savings plan based on the user's income, expenses, and specific financial goals. All monetary values are in Indian Rupees (INR).

User's Financial Profile:
- Monthly Income (INR): {{{monthlyIncome}}}
- Monthly Expenses (INR): {{{monthlyExpenses}}}
- Financial Goals:
{{#each customGoals}}
  - Goal: {{{goalName}}}
    - Target Amount (INR): {{{targetAmount}}}
    - Current Amount Saved (INR): {{#if currentAmount}}{{{currentAmount}}}{{else}}0{{/if}}
    {{#if targetDate}}- Target Date: {{{targetDate}}}{{/if}}
{{/each}}

Based on this profile, provide the following:

1.  **Overall Assessment (overallAssessment)**:
    *   Calculate the user's monthly surplus (Income - Expenses) in INR.
    *   Provide a brief assessment of their financial situation considering this surplus and their goals.

2.  **General Savings Advice (generalSavingsAdvice)**:
    *   Offer 2-3 actionable bullet points on general savings, budgeting, or managing the surplus.
    *   If applicable, briefly mention concepts like the 50/30/20 budgeting rule (Needs/Wants/Savings).
    *   Suggest general investment avenues (e.g., SIPs in Mutual Funds, Fixed Deposits, PPF) for any surplus not immediately allocated to specific short-term goals. Do not recommend specific products.

3.  **Detailed Goal Plans (detailedGoalPlans)**: For *each* goal in \`customGoals\`:
    *   Restate \`goalName\`, \`targetAmount\`, and \`currentAmount\` (use 0 if not provided by user).
    *   Calculate \`remainingAmount\` = \`targetAmount\` - \`currentAmount\`. Ensure it's non-negative. If targetAmount is 0, remainingAmount is 0.
    *   Calculate \`completionPercentage\` = (\`currentAmount\` / \`targetAmount\`) * 100. Round to one decimal place.
        *   If \`targetAmount\` is 0: if \`currentAmount\` > 0, percentage is 100. If \`currentAmount\` is 0, percentage is 100.
        *   If \`targetAmount\` > 0: if \`currentAmount\` >= \`targetAmount\`, percentage is 100. If \`currentAmount\` is 0, percentage is 0.
        *   Ensure the percentage is capped between 0 and 100.
    *   Provide \`savingsStrategyForGoal\`: 2-3 actionable bullet points with specific advice on how to achieve this goal.
        *   If there's a monthly surplus, suggest a potential monthly allocation from this surplus towards this goal. Consider goal priority if multiple goals exist (you can assume goals are listed in order of priority or treat them equally for allocation suggestions).
        *   Briefly explain how this goal fits into the overall financial picture.
    *   Provide \`estimatedTimeToGoal\` (e.g., "Approx. X months/years", "More than Y years", "Goal already achieved"). This should be based on the suggested monthly allocation or general feasibility. If no specific allocation, give a qualitative estimate.

4.  **Disclaimer (disclaimer)**:
    *   Include the exact disclaimer: "This savings plan is AI-generated and for informational purposes only. It does not constitute financial advice. Consult a qualified financial advisor for personalized guidance."

Ensure your entire response strictly conforms to the output schema. All monetary values in INR. Be practical and empathetic in your tone.
The "generalSavingsAdvice" and "savingsStrategyForGoal" should be formatted as bullet points if possible within the string.
`,
});

const personalizedSavingsPlanFlow = ai.defineFlow(
  {
    name: 'personalizedSavingsPlanFlow',
    inputSchema: PersonalizedSavingsPlanInputSchema,
    outputSchema: PersonalizedSavingsPlanOutputSchema,
  },
  async (input) => {
    // Pre-process input if necessary, e.g., ensure customGoals have currentAmount defaulted
    const processedInput = {
      ...input,
      customGoals: input.customGoals.map(goal => ({
        ...goal,
        currentAmount: goal.currentAmount ?? 0,
      })),
    };

    const { output } = await personalizedSavingsPlanPrompt(processedInput);
    if (!output) {
      throw new Error('The AI model did not return a savings plan.');
    }

    // Post-process or validate output if necessary
    // For example, ensure completionPercentage is correctly calculated or capped.
    // The prompt is quite specific, so we trust the AI for now but can add checks.

    output.disclaimer = "This savings plan is AI-generated and for informational purposes only. It does not constitute financial advice. Consult a qualified financial advisor for personalized guidance.";
    return output;
  }
);
