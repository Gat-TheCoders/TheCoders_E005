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
import {
  assessLoanEligibility as assessLoanEligibilityFlow,
  type BankLoanEligibilityInput,
  type BankLoanEligibilityOutput,
} from '@/ai/flows/bank-loan-eligibility';

export async function handleSimulateCreditScore(input: CreditScoreSimulationInput): Promise<CreditScoreSimulationOutput | { error: string }> {
  try {
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

export async function handleAssessLoanEligibility(input: BankLoanEligibilityInput): Promise<BankLoanEligibilityOutput | { error: string }> {
  try {
    const result = await assessLoanEligibilityFlow(input);
    return result;
  } catch (e) {
    console.error("Error in handleAssessLoanEligibility:", e);
    return { error: e instanceof Error ? e.message : "An unexpected error occurred during loan eligibility assessment." };
  }
}
