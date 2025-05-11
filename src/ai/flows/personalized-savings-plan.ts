'use server';
/**
 * @fileOverview Generates a personalized savings plan based on income, expenses, and financial goals.
 *
 * - generateSavingsPlan - A function that creates a tailored savings strategy.
 * - PersonalizedSavingsPlanInput (type) - The input type for the generateSavingsPlan function.
 * - PersonalizedSavingsPlanOutput (type) - The return type for the generateSavingsPlan function.
 */

import { ai } from '@/ai/genkit';
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
  prompt: `You are an AI Financial Planner. Your task is to create a personalized savings plan for a user based on their income, expenses, and specific financial goals. All monetary values are in Indian Rupees (INR).

User's Financial Profile:
- Monthly Income (INR): {{{monthlyIncome}}}
- Monthly Expenses (INR): {{{monthlyExpenses}}}
- Financial Goals:
  {{#each customGoals}}
  - Goal Name: "{{goalName}}"
    - Target Amount (INR): {{targetAmount}}
    {{#if targetDate}}- Target Date/Timeline: "{{targetDate}}"{{/if}}
    {{#if currentAmount}}- Current Amount Saved (INR): {{currentAmount}}{{else}}- Current Amount Saved (INR): 0{{/if}}
  {{/each}}

Based on this profile, provide the following:

1.  **Overall Savings Summary (overallSavingsSummary)**:
    *   Calculate the monthly surplus (Monthly Income - Monthly Expenses) in INR.
    *   Provide a brief overview of the savings potential and the general approach of the plan (e.g., "With a monthly surplus of ₹X, this plan prioritizes your goals...").
    *   If surplus is zero or negative, explain the situation and suggest focusing on expense reduction or income increase before aggressive saving for goals. The tone should be encouraging.

2.  **Detailed Goal Plans (detailedGoalPlans)**: For *each* goal provided by the user:
    *   Restate 'goalName', 'targetAmount', and 'currentAmount' accurately as provided.
    *   Calculate and return 'remainingAmount': targetAmount - currentAmount. Ensure this is non-negative (if currentAmount > targetAmount, remainingAmount is 0).
    *   Calculate and return 'completionPercentage': (currentAmount / targetAmount) * 100, rounded to one decimal place. This must be between 0 and 100. If targetAmount is 0 and currentAmount > 0, percentage is 100. If targetAmount is 0 and currentAmount is 0, percentage is 0. If currentAmount >= targetAmount (and targetAmount > 0), set to 100.
    *   Provide 'savingsStrategyForGoal': Specific, actionable advice on how to achieve this goal.
        *   Suggest a realistic monthly allocation from the surplus towards this goal. Be specific with the INR amount.
        *   If the total required monthly savings for all goals (based on reasonable timelines, or user's targetDate if provided) exceeds the surplus, explain this. Then, suggest a prioritization strategy (e.g., focusing on highest priority goal first, tackling smaller goals for quick wins, or a proportional allocation if feasible).
        *   Mention how this goal fits into the overall plan (e.g., "This is a short-term goal that can be achieved quickly," or "This long-term goal requires consistent contributions.").
    *   Provide 'estimatedTimeToAchieve' (optional but highly recommended): Based on the suggested monthly allocation and remaining amount, estimate the time to achieve this goal (e.g., "approx. X months/years"). If a 'targetDate' was provided by the user, assess if it's realistic with the suggested allocation and comment on it (e.g., "Achievable by your target date of Y if you allocate ₹Z/month," or "Your target date is ambitious; consider allocating more or extending the timeline."). If surplus is insufficient for any meaningful allocation to a specific goal, state that clearly.

3.  **General Advice (generalAdvice)**:
    *   Provide 2-3 actionable bullet points of general financial advice relevant to the user's situation (e.g., " - Build an emergency fund covering 3-6 months of expenses.", " - Review subscriptions and discretionary spending for potential cuts.").
    *   If there's any surplus remaining *after* allocating to specific goals, suggest common Indian investment avenues like SIPs in diversified mutual funds, Fixed Deposits (FDs), or Public Provident Fund (PPF) for this remaining amount. Be generic, do not recommend specific products.
    *   If surplus was initially zero or negative, advice should primarily focus on strategies to increase income or decrease expenses.

4.  **Disclaimer (disclaimer)**:
    *   Include this exact disclaimer: "This savings plan is AI-generated and for informational and educational purposes only. It does not constitute financial advice. Actual financial planning should involve consultation with a qualified financial advisor who can consider your complete financial situation."

Ensure your response strictly adheres to the output schema. Be practical, clear, and empathetic in your tone.
The language should be easy to understand for a general audience in India.
All financial figures in the output should be treated as INR.
The "savingsStrategyForGoal" should be rich and detailed.
If the user's monthly income is less than their monthly expenses, the entire plan should pivot to addressing this deficit first.
`,
});

const personalizedSavingsPlanFlow = ai.defineFlow(
  {
    name: 'personalizedSavingsPlanFlow',
    inputSchema: PersonalizedSavingsPlanInputSchema,
    outputSchema: PersonalizedSavingsPlanOutputSchema,
  },
  async (input) => {
    const { output } = await personalizedSavingsPlanPrompt(input);
    if (!output) {
      throw new Error('The AI model did not return a savings plan.');
    }
    
    // Ensure disclaimer is always present and correct
    output.disclaimer = "This savings plan is AI-generated and for informational and educational purposes only. It does not constitute financial advice. Actual financial planning should involve consultation with a qualified financial advisor who can consider your complete financial situation.";
    
    // Post-process completionPercentage and remainingAmount to ensure accuracy based on logic, if AI deviates.
    output.detailedGoalPlans = output.detailedGoalPlans.map(goal => {
      let calculatedPercentage = 0;
      if (goal.targetAmount > 0) {
        if (goal.currentAmount >= goal.targetAmount) {
          calculatedPercentage = 100;
        } else {
          calculatedPercentage = (goal.currentAmount / goal.targetAmount) * 100;
        }
      } else { // targetAmount is 0 or less
        calculatedPercentage = goal.currentAmount > 0 ? 100 : 0;
      }
      // Clamp between 0 and 100, and round to one decimal
      goal.completionPercentage = Math.max(0, Math.min(100, parseFloat(calculatedPercentage.toFixed(1))));
      
      goal.remainingAmount = Math.max(0, goal.targetAmount - goal.currentAmount);
      return goal;
    });

    return output;
  }
);
