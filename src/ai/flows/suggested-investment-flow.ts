'use server';
/**
 * @fileOverview AI flow to suggest investments based on user's monthly income and investment capacity.
 *
 * - suggestInvestment - A function that takes monthly income and optional investment capacity, then returns investment suggestions.
 * - SuggestedInvestmentInput (type) - The input type for the suggestInvestment function.
 * - SuggestedInvestmentOutput (type) - The return type for the suggestInvestment function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  SuggestedInvestmentInputSchema,
  SuggestedInvestmentOutputSchema,
  type SuggestedInvestmentInput,
  type SuggestedInvestmentOutput,
} from '@/ai/schemas/suggested-investment-schemas';

export type { SuggestedInvestmentInput, SuggestedInvestmentOutput };

export async function suggestInvestment(
  input: SuggestedInvestmentInput
): Promise<SuggestedInvestmentOutput> {
  return suggestedInvestmentFlow(input);
}

const suggestedInvestmentPrompt = ai.definePrompt({
  name: 'suggestedInvestmentPrompt',
  input: { schema: SuggestedInvestmentInputSchema },
  output: { schema: SuggestedInvestmentOutputSchema },
  prompt: `You are an AI financial assistant. Your task is to provide general investment suggestions based on the user's monthly income and, if provided, their monthly investment capacity. These suggestions are for educational and illustrative purposes only and DO NOT constitute financial advice. Assume all monetary values are in Indian Rupees (INR).

User's Financial Profile:
- Monthly Income (INR): {{{monthlyIncome}}}
{{#if investmentCapacity}}
- Estimated Monthly Investment Capacity (INR): {{{investmentCapacity}}}
{{else}}
- Estimated Monthly Investment Capacity (INR): Not specified
{{/if}}

Based on this profile, provide 2-3 general investment suggestions. For each suggestion, include:
1.  'investmentName': A descriptive name for the investment type (e.g., "NIFTY 50 Index Fund SIP", "Public Provident Fund (PPF)", "Gold Sovereign Bond").
2.  'investmentType': The category of investment (e.g., "Index Fund SIP", "Government Scheme", "Commodity").
3.  'rationale': A brief explanation of why this type of investment might be suitable for someone with the provided income level and investment capacity. If investment capacity is specified, relate the suggestion to it (e.g., "This SIP can be started with an amount that fits well within your ₹{{{investmentCapacity}}} capacity.").
4.  'riskLevel': A general risk assessment ('Low', 'Medium', 'High', 'Varies').
5.  'exampleSymbol' (optional): An illustrative or placeholder symbol (e.g., "NIFTYBEES" for an Nifty ETF, or "PPFACC" as a placeholder for PPF). These are NOT live trading symbols.

Consider the following when formulating suggestions:
- If income is low (e.g., below ₹25,000/month){{#if investmentCapacity}} or investment capacity is low (e.g., below ₹5,000/month){{/if}}, prioritize suggestions like starting an emergency fund, small systematic investment plans (SIPs) in diversified index funds, or government savings schemes like PPF.
- If income is moderate (e.g., ₹25,000 - ₹75,000/month){{#if investmentCapacity}} and investment capacity is moderate (e.g., ₹5,000 - ₹15,000/month){{/if}}, you can suggest a mix of SIPs, potentially some direct equity in stable blue-chip companies (as a concept, not specific stock picks), or debt instruments.
- If income is high (e.g., above ₹75,000/month){{#if investmentCapacity}} and investment capacity is high (e.g., above ₹15,000/month){{/if}}, suggestions can be more diversified, including higher risk/reward options like thematic mutual funds or a larger portion towards direct equity, while still maintaining a balanced approach.
- If investment capacity is provided, make the rationale more specific to that capacity. For example, if capacity is ₹10,000, an SIP suggestion could be for ₹2,000-₹5,000.
- ALWAYS emphasize diversification and long-term perspective.
- DO NOT recommend specific company stocks by name for direct equity (use conceptual terms like "blue-chip stocks" or "growth sector stocks").
- For mutual funds or ETFs, suggest categories (e.g., "Large Cap Index Fund", "Diversified Equity Mutual Fund") rather than specific fund names.

Crucially, you MUST include the following disclaimer as the 'disclaimer' field in your output:
"These suggestions are for educational purposes only, based on generalized assumptions for your income level and investment capacity (if provided), and do not constitute financial advice. Investing in financial markets involves risk, including the possible loss of principal. Actual investment decisions should be made after careful research, consideration of individual financial situations and risk tolerance, and consultation with a qualified financial advisor."

Ensure your response strictly adheres to the output schema.
Provide 2 to 3 suggestions in the 'suggestions' array.
`,
});

const suggestedInvestmentFlow = ai.defineFlow(
  {
    name: 'suggestedInvestmentFlow',
    inputSchema: SuggestedInvestmentInputSchema,
    outputSchema: SuggestedInvestmentOutputSchema,
  },
  async (input) => {
    const { output } = await suggestedInvestmentPrompt(input);
    if (!output) {
      throw new Error('The AI model did not return any investment suggestions.');
    }
    // Ensure the disclaimer is always present and correct
    output.disclaimer = "These suggestions are for educational purposes only, based on generalized assumptions for your income level and investment capacity (if provided), and do not constitute financial advice. Investing in financial markets involves risk, including the possible loss of principal. Actual investment decisions should be made after careful research, consideration of individual financial situations and risk tolerance, and consultation with a qualified financial advisor.";
    return output;
  }
);
