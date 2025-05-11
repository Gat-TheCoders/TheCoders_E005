
/**
 * @fileOverview Zod schemas for the Personalized Savings Plan AI flow.
 *
 * - GoalInputSchema - Schema for an individual financial goal.
 * - PersonalizedSavingsPlanInputSchema - Input schema for generating a savings plan.
 * - DetailedGoalPlanSchema - Schema for a detailed plan for an individual goal.
 * - PersonalizedSavingsPlanOutputSchema - Output schema for the generated savings plan.
 */

import { z } from 'genkit';

export const GoalInputSchema = z.object({
  goalName: z.string().min(3, 'Goal name must be at least 3 characters.').describe('Name of the financial goal (e.g., "Buy a new laptop", "Emergency Fund").'),
  targetAmount: z.coerce.number({invalid_type_error: "Target amount must be a number.", required_error: "Target amount is required."}).positive('Target amount must be positive.').describe('The total amount in INR needed for this goal.'),
  currentAmount: z.coerce.number({invalid_type_error: "Current amount must be a number."}).nonnegative('Current amount cannot be negative.').default(0).describe('The amount in INR already saved for this goal (optional, defaults to 0).'),
  targetDate: z.string().optional().describe('Optional target date for achieving this goal (e.g., "in 6 months", "by Dec 2025").'),
});
export type GoalInput = z.infer<typeof GoalInputSchema>;

export const PersonalizedSavingsPlanInputSchema = z.object({
  monthlyIncome: z.coerce.number({invalid_type_error: "Monthly income must be a number.", required_error: "Monthly income is required."}).positive('Monthly income must be positive.').describe('Your total gross monthly income in INR.'),
  monthlyExpenses: z.coerce.number({invalid_type_error: "Monthly expenses must be a number.", required_error: "Monthly expenses are required."}).nonnegative('Monthly expenses cannot be negative.').describe('Your total monthly expenses in INR.'),
  customGoals: z.array(GoalInputSchema).min(1, "Define at least one financial goal.").describe("List of your financial goals with target and current savings."),
}).refine(data => data.monthlyIncome >= data.monthlyExpenses, {
    message: "Monthly income should ideally be greater than or equal to monthly expenses to create a savings plan.",
    path: ["monthlyIncome"], 
});
export type PersonalizedSavingsPlanInput = z.infer<typeof PersonalizedSavingsPlanInputSchema>;

export const DetailedGoalPlanSchema = z.object({
  goalName: z.string().describe('Name of the financial goal.'),
  targetAmount: z.number().describe('Target amount for the goal in INR.'),
  currentAmount: z.number().describe('Currently saved amount for the goal in INR.'),
  remainingAmount: z.number().describe('Remaining amount needed for the goal in INR. Calculated as targetAmount - currentAmount. Should be non-negative.'),
  completionPercentage: z.number().min(0).max(100).describe('Percentage of the goal completed (0-100). Calculated as (currentAmount / targetAmount) * 100. Handle cases: if targetAmount is 0 and currentAmount is > 0, it is 100%; if targetAmount is 0 and currentAmount is 0, it is 100%; if targetAmount > 0 and currentAmount >= targetAmount, it is 100%.'),
  savingsStrategyForGoal: z.string().describe('Specific strategy to achieve this goal, including suggested monthly allocation from surplus if applicable, and how this goal fits into the overall plan. Provide 2-3 actionable bullet points.'),
  estimatedTimeToGoal: z.string().optional().describe('Estimated time to achieve the goal based on the plan (e.g., "Approx. 8 months", "More than 2 years").'),
});
export type DetailedGoalPlan = z.infer<typeof DetailedGoalPlanSchema>;

export const PersonalizedSavingsPlanOutputSchema = z.object({
  overallAssessment: z.string().describe('A brief assessment of the user\'s financial situation based on income, expenses, and goals. Calculate and mention the monthly surplus (income - expenses) in INR.'),
  generalSavingsAdvice: z.string().describe('General advice on savings, budgeting, and managing the surplus. Could include the 50/30/20 rule or similar concepts if applicable. Mention general investment avenues (like SIPs, FDs) for surplus not immediately tied to short-term goals. Provide 2-3 actionable bullet points.'),
  detailedGoalPlans: z.array(DetailedGoalPlanSchema).describe('Detailed plans for each financial goal provided by the user.'),
  disclaimer: z.string().describe('Standard disclaimer: "This savings plan is AI-generated and for informational purposes only. It does not constitute financial advice. Consult a qualified financial advisor for personalized guidance."'),
});
export type PersonalizedSavingsPlanOutput = z.infer<typeof PersonalizedSavingsPlanOutputSchema>;
