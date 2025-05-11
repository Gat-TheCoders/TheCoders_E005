
/**
 * @fileOverview Zod schemas for the Personalized Savings Plan AI flow.
 *
 * - GoalInputSchema - Schema for a single financial goal input.
 * - PersonalizedSavingsPlanInputSchema - Input schema for generating a savings plan.
 * - GoalPlanOutputSchema - Schema for the AI's plan for a single goal.
 * - PersonalizedSavingsPlanOutputSchema - Output schema for the generated savings plan.
 */
import { z } from 'genkit';

export const GoalInputSchema = z.object({
  goalName: z.string().min(3, { message: 'Goal name must be at least 3 characters.' }).describe('Name of the financial goal (e.g., "Emergency Fund", "Buy a Laptop").'),
  targetAmount: z.coerce.number({invalid_type_error: "Target amount must be a number.", required_error: "Target amount is required."}).positive({ message: 'Target amount must be a positive number.' }).describe('The total amount needed for this goal in INR.'),
  targetDate: z.string().optional().describe('Optional: Desired timeline to achieve this goal (e.g., "in 6 months", "by December 2025").'),
  currentAmount: z.coerce.number({invalid_type_error: "Current amount must be a number."}).nonnegative('Current amount saved cannot be negative.').optional().default(0).describe('Optional: Amount already saved for this goal in INR (defaults to 0).'),
});
export type GoalInput = z.infer<typeof GoalInputSchema>;

export const PersonalizedSavingsPlanInputSchema = z.object({
  monthlyIncome: z.coerce.number({invalid_type_error: "Monthly income must be a number.", required_error: "Monthly income is required."}).positive('Monthly income must be a positive number.').describe('Your total gross monthly income in INR.'),
  monthlyExpenses: z.coerce.number({invalid_type_error: "Monthly expenses must be a number.", required_error: "Monthly expenses are required."}).nonnegative('Monthly expenses cannot be negative.').describe('Your total monthly expenses in INR.'),
  customGoals: z.array(GoalInputSchema).min(1, "Define at least one financial goal.").describe("List of your financial goals with target and current savings."),
});
// Removed .refine(data => data.monthlyIncome >= data.monthlyExpenses, ...) to allow AI to handle deficit scenarios.
// The AI prompt is designed to provide advice even if expenses exceed income.
export type PersonalizedSavingsPlanInput = z.infer<typeof PersonalizedSavingsPlanInputSchema>;

export const GoalPlanOutputSchema = z.object({
  goalName: z.string().describe('Name of the financial goal.'),
  targetAmount: z.number().describe('Target amount for the goal in INR.'),
  currentAmount: z.number().describe('Current amount saved for the goal in INR.'),
  remainingAmount: z.number().describe('Remaining amount needed to reach the goal in INR.'),
  completionPercentage: z.number().min(0).max(100).describe('Percentage of the goal completed (0-100).'),
  savingsStrategyForGoal: z.string().describe('Specific advice and monthly allocation strategy for this goal from the surplus. If surplus is insufficient, explain how to prioritize or adjust.'),
  estimatedTimeToAchieve: z.string().optional().describe('AI-estimated time to achieve the goal based on the plan (e.g., "approx. 8 months", "within 1 year if prioritized"). This will be based on targetDate if provided, or calculated otherwise.')
});
export type GoalPlanOutput = z.infer<typeof GoalPlanOutputSchema>;

export const PersonalizedSavingsPlanOutputSchema = z.object({
  overallSavingsSummary: z.string().describe('A summary of your monthly surplus (income - expenses in INR), and a general overview of the savings plan approach.'),
  detailedGoalPlans: z.array(GoalPlanOutputSchema).describe('A detailed plan for each of your financial goals.'),
  generalAdvice: z.string().describe('General financial advice, tips for managing the surplus, suggestions for additional savings, or common investment avenues for any remaining surplus after goal allocations (e.g., SIPs, FDs in Indian context). This should be 2-3 bullet points.'),
  disclaimer: z.string().describe('Standard disclaimer that this is not financial advice and professional consultation is recommended.'),
});
export type PersonalizedSavingsPlanOutput = z.infer<typeof PersonalizedSavingsPlanOutputSchema>;

