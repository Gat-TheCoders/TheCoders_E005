
import { z } from 'genkit';

// GoalInputSchema is used by GenerateSavingsPlanInputSchema
export const GoalInputSchema = z.object({
  name: z.string().min(3, "Goal name must be at least 3 characters.").describe("Name of the financial goal (e.g., 'Emergency Fund', 'Vacation to Goa')."),
  targetAmount: z.coerce.number({invalid_type_error: "Target amount must be a number.", required_error: "Target amount is required."}).positive("Target amount must be positive.").describe("The total amount in INR needed for this goal."),
  currentAmount: z.coerce.number({invalid_type_error: "Current amount must be a number.", required_error: "Current amount is required."}).nonnegative("Current amount cannot be negative.").default(0).describe("The amount in INR already saved for this goal."),
}).refine(data => data.currentAmount <= data.targetAmount, {
    message: "Current amount cannot exceed target amount.",
    path: ["currentAmount"],
});

export const GenerateSavingsPlanInputSchema = z.object({
  monthlyIncome: z.coerce.number({invalid_type_error: "Monthly income must be a number.", required_error: "Monthly income is required."}).positive('Monthly income must be positive.').describe('Your total monthly income in INR.'),
  monthlyExpenses: z.coerce.number({invalid_type_error: "Monthly expenses must be a number.", required_error: "Monthly expenses are required."}).nonnegative('Monthly expenses cannot be negative.').describe('Your total monthly expenses in INR.'),
  customGoals: z.array(GoalInputSchema).min(1, "Define at least one financial goal.").describe("List of your financial goals with target and current savings."),
});
// Removed: .refine(data => data.monthlyIncome > data.monthlyExpenses, {
//     message: "Monthly income must be greater than monthly expenses to generate a meaningful savings plan.",
//     path: ["monthlyIncome"],
// });

// GoalProgressOutputSchema is used by GenerateSavingsPlanOutputSchema
export const GoalProgressOutputSchema = z.object({
  goalName: z.string().describe("Name of the financial goal."),
  targetAmount: z.number().describe("Target amount in INR for the goal."),
  currentAmount: z.number().describe("Current amount saved in INR towards this goal as provided by user."),
  remainingAmount: z.number().describe("Calculated remaining amount in INR to reach the goal target (targetAmount - currentAmount)."),
  completionPercentage: z.number().min(0).max(100).describe("Calculated percentage of the goal already completed based on current savings (0-100). Formula: (currentAmount / targetAmount) * 100."),
  savingsStrategyForGoal: z.string().describe("Specific strategies, advice, or suggested monthly allocation from the overall plan that apply to achieving this particular goal. Explain how the user can work towards this goal with their surplus."),
  projectedTimeline: z.string().optional().describe("Estimated time to achieve the remaining amount for this goal based on the suggested savings allocation for this specific goal (e.g., 'approx. 5 months', 'about 1.5 years'). This should only be provided if a clear savings allocation for this goal is part of the plan and feasible."),
});

export const GenerateSavingsPlanOutputSchema = z.object({
  overallSavingsSummary: z.string().describe("A summary of the overall savings plan. This should include the calculated monthly surplus (income - expenses), general advice on budgeting, and how the surplus can be strategically used for the defined goals, general savings, or investments. If there are multiple goals, discuss potential prioritization if surplus is limited."),
  detailedGoalPlans: z.array(GoalProgressOutputSchema).describe("Detailed plan and progress for each specified financial goal. For each goal, calculate 'remainingAmount' and 'completionPercentage' based on the provided 'targetAmount' and 'currentAmount'."),
  disclaimer: z.string().describe("Standard financial advice disclaimer: 'This savings plan is AI-generated based on the information you provided and is for educational and illustrative purposes only. It is not financial advice. Consider consulting with a qualified financial professional for personalized guidance.'")
});

