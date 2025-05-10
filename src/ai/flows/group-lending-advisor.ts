'use server';
/**
 * @fileOverview Provides AI-driven advice and analysis for group lending or self-help groups (SHGs).
 *
 * - adviseOnGroupLending - A function that provides an assessment and recommendations for a group.
 * - GroupLendingAdvisorInput - The input type for the adviseOnGroupLending function.
 * - GroupLendingAdvisorOutput - The return type for the adviseOnGroupLending function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GroupLendingAdvisorInputSchema = z.object({
  groupSize: z
    .number({ required_error: "Group size is required." })
    .int()
    .positive({ message: "Group size must be a positive integer." })
    .min(2, { message: "A group must have at least 2 members."})
    .describe('The number of members in the self-help group.'),
  totalPooledFundTarget: z
    .number({ required_error: "Total pooled fund target is required." })
    .positive({ message: "Fund target must be a positive number." })
    .describe('The total amount in INR the group aims to pool or the total loan amount desired by the group.'),
  groupPurpose: z
    .string({ required_error: "Group purpose is required." })
    .min(10, { message: "Please describe the group's purpose in at least 10 characters." })
    .describe('The primary purpose of the group (e.g., "Micro-enterprise funding", "Emergency support fund", "Agricultural inputs purchasing").'),
  memberContributionFrequency: z
    .enum(['Weekly', 'Bi-Weekly', 'Monthly', 'Quarterly'], { required_error: "Contribution frequency is required."})
    .describe('How often members will contribute to the group fund.'),
  groupRiskProfile: z
    .enum(['Conservative', 'Balanced', 'Growth-Oriented'], { required_error: "Group risk profile is required." })
    .describe('The overall financial risk tolerance or approach of the group (e.g., Conservative focuses on capital preservation, Growth-Oriented seeks higher returns with higher risk).'),
});
export type GroupLendingAdvisorInput = z.infer<typeof GroupLendingAdvisorInputSchema>;

const GroupLendingAdvisorOutputSchema = z.object({
  assessmentAndRecommendations: z
    .string()
    .describe('A comprehensive assessment of the group\'s plan, its viability, and specific, actionable recommendations for structuring operations (contributions, decision-making, record-keeping, meetings, roles).'),
  potentialChallenges: z
    .string()
    .describe('Identifies 2-3 potential challenges specific to this group with brief mitigation strategies for each. Should be formatted clearly, perhaps with bullet points if suitable.'),
  successFactors: z
    .string()
    .describe('Outlines 3-4 key factors crucial for this group\'s long-term success and sustainability. Should be formatted clearly, perhaps with bullet points if suitable.'),
});
export type GroupLendingAdvisorOutput = z.infer<typeof GroupLendingAdvisorOutputSchema>;

export async function adviseOnGroupLending(
  input: GroupLendingAdvisorInput
): Promise<GroupLendingAdvisorOutput> {
  return groupLendingAdvisorFlow(input);
}

const groupLendingAdvisorPrompt = ai.definePrompt({
  name: 'groupLendingAdvisorPrompt',
  input: {schema: GroupLendingAdvisorInputSchema},
  output: {schema: GroupLendingAdvisorOutputSchema},
  prompt: `You are an AI advisor specializing in Self-Help Groups (SHGs) and group lending practices, particularly within the Indian context.
Your goal is to provide actionable advice and a structured plan for a group based on the information they provide. Assume all monetary values are in Indian Rupees (INR).

Group Details:
- Group Size: {{{groupSize}}} members
- Total Pooled Fund Target / Loan Amount (INR): {{{totalPooledFundTarget}}}
- Primary Purpose of the Group: {{{groupPurpose}}}
- Member Contribution Frequency: {{{memberContributionFrequency}}}
- Group Financial Profile/Risk Tolerance: {{{groupRiskProfile}}}

Based on these details, provide the following:

1.  **Assessment and Recommendations (assessmentAndRecommendations)**:
    *   Provide a general assessment of the group's plan and its viability.
    *   Offer specific, actionable recommendations for structuring the group's operations. This should cover:
        *   Contribution collection (e.g., individual contributions per period in INR) and management methods (e.g., dedicated group bank account).
        *   Clear decision-making processes, especially for loan disbursal if applicable (e.g., criteria, approval process by members, interest rates if any).
        *   Essential record-keeping practices (e.g., member contributions, loans, meeting minutes, passbooks).
        *   Suggestions for meeting schedules and typical agenda items (e.g., financial review, loan application discussions).
        *   Possible roles within the group (e.g., President/Chairperson, Secretary, Treasurer) and their responsibilities.

2.  **Potential Challenges (potentialChallenges)**:
    *   Identify 2-3 potential challenges this specific group might face based on their inputs (e.g., ensuring consistent member contributions, managing internal conflicts, risk of default if loans are given, impact of local economic conditions on members' ability to contribute or repay).
    *   For each challenge, suggest a brief, practical mitigation strategy. Format this as a list, e.g., "- Challenge: Mitigation strategy."

3.  **Key Success Factors (successFactors)**:
    *   Outline 3-4 key factors crucial for this group's long-term success and sustainability (e.g., High level of trust and transparency among members, Regular and active participation in meetings, Clear and consistently applied rules and bylaws (group constitution), Strong shared vision and commitment to group goals, Effective leadership and conflict resolution mechanisms, Linkages with banks or government schemes if applicable). Format this as a list, e.g., "- Factor: Brief explanation."

Ensure your response is practical, easy to understand, and empowering for the group. Format the output according to the schema.
The "assessmentAndRecommendations" should be comprehensive.
The "potentialChallenges" and "successFactors" strings should use newlines and hyphens or asterisks to create bulleted lists for readability.
Avoid making guarantees or promises. Emphasize that this advice is for guidance.
`,
});

const groupLendingAdvisorFlow = ai.defineFlow(
  {
    name: 'groupLendingAdvisorFlow',
    inputSchema: GroupLendingAdvisorInputSchema,
    outputSchema: GroupLendingAdvisorOutputSchema,
  },
  async input => {
    const {output} = await groupLendingAdvisorPrompt(input);
    if (!output) {
      throw new Error("Failed to get a response from the AI model for group lending advice.");
    }
    return output;
  }
);

