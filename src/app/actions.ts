// src/app/actions.ts
"use server";

import { 
  simulateCreditScore as simulateCreditScoreFlow,
  type CreditScoreSimulationInput,
  type CreditScoreSimulationOutput 
} from '@/ai/flows/credit-score-simulation';
import { 
  generateSavingsPlan as generateSavingsPlanFlow,
  type GenerateSavingsPlanInput,
  type GenerateSavingsPlanOutput
} from '@/ai/flows/personalized-savings-plan';

export async function handleSimulateCreditScore(input: CreditScoreSimulationInput): Promise<CreditScoreSimulationOutput | { error: string }> {
  try {
    // Input validation can be done here using the Zod schema if needed, though react-hook-form will handle it client-side.
    const result = await simulateCreditScoreFlow(input);
    return result;
  } catch (e) {
    console.error("Error in handleSimulateCreditScore:", e);
    return { error: e instanceof Error ? e.message : "An unexpected error occurred during credit score simulation." };
  }
}

export async function handleGenerateSavingsPlan(input: GenerateSavingsPlanInput): Promise<GenerateSavingsPlanOutput | { error: string }> {
  try {
    const result = await generateSavingsPlanFlow(input);
    return result;
  } catch (e) {
    console.error("Error in handleGenerateSavingsPlan:", e);
    return { error: e instanceof Error ? e.message : "An unexpected error occurred during savings plan generation." };
  }
}
