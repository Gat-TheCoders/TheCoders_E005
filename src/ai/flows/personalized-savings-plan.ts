// src/ai/flows/personalized-savings-plan.ts
'use server';

/**
 * @fileOverview A personalized savings plan generator AI agent.
 * It takes user's income, expenses, and a list of structured financial goals (including target and current savings).
 * It outputs an overall savings summary and detailed progress/plans for each goal.
 *
 * - generateSavingsPlan - A function that handles the savings plan generation process.
 * - GenerateSavingsPlanInput (type) - The input type for the generateSavingsPlan function.
 * - GenerateSavingsPlanOutput (type) - The return type for the generateSavingsPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { 
  GenerateSavingsPlanInputSchema, 
  GenerateSavingsPlanOutputSchema 
} from '@/ai/schemas/personalized-savings-plan-schemas';

// Types are inferred from the imported schemas and can be exported
export type GenerateSavingsPlanInput = z.infer<typeof GenerateSavingsPlanInputSchema>;
export type GenerateSavingsPlanOutput = z.infer<typeof GenerateSavingsPlanOutputSchema>;

export async function generateSavingsPlan(input: GenerateSavingsPlanInput): Promise<GenerateSavingsPlanOutput> {
  // Pre-calculate completion percentages and remaining amounts before sending to AI for complex logic
  const processedGoals = input.customGoals.map(goal => {
    const completionPercentage = goal.targetAmount > 0 ? Math.min(100, Math.max(0,(goal.currentAmount / goal.targetAmount) * 100)) : (goal.currentAmount > 0 ? 100 : 0);
    const remainingAmount = Math.max(0, goal.targetAmount - goal.currentAmount);
    return {
      ...goal,
      completionPercentage, // AI can use this or re-verify
      remainingAmount,     // AI can use this or re-verify
    };
  });

  // The AI will still receive all goal details to formulate its plan.
  // We are making `completionPercentage` and `remainingAmount` explicit in the prompt context.
  // And they must be part of the output schema for the AI to fill.

  return generateSavingsPlanFlow({ ...input, customGoals: processedGoals });
}

const prompt = ai.definePrompt({
  name: 'generateSavingsPlanPrompt',
  input: {schema: GenerateSavingsPlanInputSchema},
  output: {schema: GenerateSavingsPlanOutputSchema},
  prompt: `You are a financial advisor specializing in creating personalized savings plans, with a focus on the Indian context. Assume all monetary values are in Indian Rupees (INR).

User's Financial Profile:
- Monthly Income (INR): {{{monthlyIncome}}}
- Monthly Expenses (INR): {{{monthlyExpenses}}}
- Financial Goals:
{{#each customGoals}}
  - Goal Name: {{name}}
    Target Amount (INR): {{targetAmount}}
    Current Amount Saved (INR): {{currentAmount}}
    (Calculated: {{toFixed (multiply (divide currentAmount targetAmount) 100) 1}}% complete, {{subtract targetAmount currentAmount}} INR remaining)
{{/each}}

Instructions:
1.  **Calculate Monthly Surplus**: Determine the user's monthly surplus (Income - Expenses). This is crucial for the plan.
2.  **Overall Savings Summary (overallSavingsSummary)**:
    *   State the calculated monthly surplus.
    *   Provide general advice on budgeting based on their income and expenses.
    *   Discuss how this surplus can be strategically allocated towards their listed goals. If multiple goals exist and the surplus is limited, suggest a possible prioritization strategy (e.g., emergency fund first, then high-interest debt, then other goals, or based on user-implied urgency if any).
    *   Mention general savings or investment avenues (like SIPs, FDs) for any surplus not immediately allocated to specific short-term goals.
3.  **Detailed Goal Plans (detailedGoalPlans)**: For *each* goal provided by the user:
    *   Restate goalName, targetAmount, and currentAmount as provided.
    *   Calculate and return completionPercentage: (currentAmount / targetAmount) * 100, rounded to one decimal. Ensure it's between 0 and 100. If targetAmount is 0, and currentAmount > 0, percentage is 100, else 0.
    *   Calculate and return remainingAmount: targetAmount - currentAmount (ensure non-negative).
    *   Provide savingsStrategyForGoal: Specific actionable advice on how to achieve this goal. If applicable, suggest a monthly allocation from the surplus towards this goal. How does this goal fit into the overall plan?
    *   Provide projectedTimeline (optional): Based on your suggested monthly allocation for *this specific goal*, estimate the time to save the remainingAmount. Examples: "approx. X months", "about Y years". Only provide if a clear allocation is made and it's realistic. If the goal is ongoing (e.g. "invest for retirement"), this might be less relevant or framed differently.
4.  **Disclaimer (disclaimer)**: Include this exact text: "This savings plan is AI-generated based on the information you provided and is for educational and illustrative purposes only. It is not financial advice. Consider consulting with a qualified financial professional for personalized guidance."

Ensure your entire response strictly adheres to the output schema. All calculations should be accurate. Be empathetic and practical.
If income is not greater than expenses, the overall summary should acknowledge this and focus on expense reduction strategies before extensive savings planning, though still attempt to address goals if possible.
The completionPercentage should be capped at 100%. If targetAmount is 0, treat completionPercentage as 100% if currentAmount > 0, otherwise 0%. remainingAmount should be 0 if currentAmount >= targetAmount.
`,
});


const generateSavingsPlanFlow = ai.defineFlow(
  {
    name: 'generateSavingsPlanFlow',
    inputSchema: GenerateSavingsPlanInputSchema, // The input to the flow is the original schema
    outputSchema: GenerateSavingsPlanOutputSchema,
  },
  async (input) => {
     // The input here already has pre-calculated values if called from the wrapper
     // If called directly, it might not. The prompt is designed to handle recalculations by AI.
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("The AI model did not return a savings plan.");
    }

    // Post-processing to ensure calculations are correct, as AI might make small errors.
    const finalOutput: GenerateSavingsPlanOutput = {
      ...output,
      detailedGoalPlans: output.detailedGoalPlans.map(goalPlan => {
        const originalGoal = input.customGoals.find(g => g.name === goalPlan.goalName);
        let currentAmount = goalPlan.currentAmount;
        let targetAmount = goalPlan.targetAmount;

        if (originalGoal) { // Prefer original input for amounts to avoid AI drift
            currentAmount = originalGoal.currentAmount;
            targetAmount = originalGoal.targetAmount;
        }
        
        const calculatedCompletionPercentage = targetAmount > 0 
            ? Math.min(100, Math.max(0, (currentAmount / targetAmount) * 100)) 
            : (currentAmount > 0 ? 100 : 0);
        
        const calculatedRemainingAmount = Math.max(0, targetAmount - currentAmount);

        return {
          ...goalPlan,
          currentAmount: currentAmount,
          targetAmount: targetAmount,
          completionPercentage: parseFloat(calculatedCompletionPercentage.toFixed(1)),
          remainingAmount: parseFloat(calculatedRemainingAmount.toFixed(2)),
        };
      }),
      disclaimer: output.disclaimer || "This savings plan is AI-generated based on the information you provided and is for educational and illustrative purposes only. It is not financial advice. Consider consulting with a qualified financial professional for personalized guidance."
    };

    return finalOutput;
  }
);
