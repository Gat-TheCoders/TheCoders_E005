
/**
 * @fileOverview Zod schemas for the Suggested Investment AI flow.
 *
 * - SuggestedInvestmentInputSchema - Input schema for suggesting investments based on income.
 * - StockSuggestionSchema - Schema for an individual stock/investment suggestion.
 * - SuggestedInvestmentOutputSchema - Output schema for the list of suggestions and disclaimer.
 */

import { z } from 'genkit';

export const SuggestedInvestmentInputSchema = z.object({
  monthlyIncome: z.coerce
    .number({ required_error: 'Monthly income is required.' })
    .positive({ message: 'Monthly income must be a positive number.' })
    .describe("User's gross monthly income in INR."),
});
export type SuggestedInvestmentInput = z.infer<typeof SuggestedInvestmentInputSchema>;

export const StockSuggestionSchema = z.object({
  investmentName: z
    .string()
    .describe('Name of the suggested investment (e.g., "NIFTY 50 Index Fund", "Bluechip Equity XYZ").'),
  investmentType: z
    .string()
    .describe('Type of investment (e.g., "Index Fund SIP", "Large-cap Equity Stock", "Diversified Mutual Fund").'),
  rationale: z
    .string()
    .describe('Brief explanation why this investment type might be suitable for the given income level and general financial goals.'),
  riskLevel: z
    .enum(['Low', 'Medium', 'High', 'Varies'])
    .describe('General risk level associated with this type of investment.'),
  exampleSymbol: z
    .string()
    .optional()
    .describe('An illustrative or placeholder symbol, if applicable (e.g., "NIFTY50BEES", "XYZBLUECHIP"). Not a live trading symbol.'),
});
export type StockSuggestion = z.infer<typeof StockSuggestionSchema>;

export const SuggestedInvestmentOutputSchema = z.object({
  suggestions: z
    .array(StockSuggestionSchema)
    .min(1, 'At least one suggestion should be provided.')
    .max(3, 'No more than three suggestions should be provided.')
    .describe('A list of 2-3 general investment suggestions tailored to the user\'s income level.'),
  disclaimer: z
    .string()
    .describe('A mandatory disclaimer stating that the suggestions are for educational purposes only and not financial advice.'),
});
export type SuggestedInvestmentOutput = z.infer<typeof SuggestedInvestmentOutputSchema>;

