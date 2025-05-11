
// src/app/actions.ts
"use server";

import { 
  simulateCreditScore as simulateCreditScoreFlow,
  type CreditScoreSimulationInput,
  type CreditScoreSimulationOutput 
} from '@/ai/flows/credit-score-simulation';
import {
  assessLoanEligibility as assessLoanEligibilityFlow,
  type BankLoanEligibilityInput,
  type BankLoanEligibilityOutput,
} from '@/ai/flows/bank-loan-eligibility';
import {
  adviseOnGroupLending as adviseOnGroupLendingFlow,
  type GroupLendingAdvisorInput,
  type GroupLendingAdvisorOutput,
} from '@/ai/flows/group-lending-advisor';
import {
  simulateCommunitySupport as simulateCommunitySupportFlow,
  type CommunitySupportAdvisorInput,
  type CommunitySupportAdvisorOutput,
} from '@/ai/flows/community-support-advisor';
import {
  analyzeExpensesAndOptimizeSavings as analyzeExpensesAndOptimizeSavingsFlow,
  type ExpenseOptimizerInput,
  type ExpenseOptimizerOutput,
} from '@/ai/flows/expense-optimizer';
import {
  financialChat as financialChatFlow,
  type FinancialChatInput,
  type FinancialChatOutput,
} from '@/ai/flows/financial-chat-flow';
import {
  suggestInvestment as suggestInvestmentFlow,
  type SuggestedInvestmentInput,
  type SuggestedInvestmentOutput,
} from '@/ai/flows/suggested-investment-flow';


export async function handleSimulateCreditScore(input: CreditScoreSimulationInput): Promise<CreditScoreSimulationOutput | { error: string }> {
  try {
    const result = await simulateCreditScoreFlow(input);
    return result;
  } catch (e) {
    console.error("Error in handleSimulateCreditScore:", e);
    return { error: e instanceof Error ? e.message : "An unexpected error occurred during credit score simulation." };
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

export async function handleAdviseOnGroupLending(input: GroupLendingAdvisorInput): Promise<GroupLendingAdvisorOutput | { error: string }> {
  try {
    const result = await adviseOnGroupLendingFlow(input);
    return result;
  } catch (e) {
    console.error("Error in handleAdviseOnGroupLending:", e);
    return { error: e instanceof Error ? e.message : "An unexpected error occurred during group lending advice generation." };
  }
}

export async function handleSimulateCommunitySupport(input: CommunitySupportAdvisorInput): Promise<CommunitySupportAdvisorOutput | { error: string }> {
  try {
    const result = await simulateCommunitySupportFlow(input);
    return result;
  } catch (e) {
    console.error("Error in handleSimulateCommunitySupport:", e);
    return { error: e instanceof Error ? e.message : "An unexpected error occurred during community support simulation." };
  }
}

export async function handleAnalyzeExpensesAndOptimizeSavings(input: ExpenseOptimizerInput): Promise<ExpenseOptimizerOutput | { error: string }> {
  try {
    const result = await analyzeExpensesAndOptimizeSavingsFlow(input);
    return result;
  } catch (e) {
    console.error("Error in handleAnalyzeExpensesAndOptimizeSavings:", e);
    return { error: e instanceof Error ? e.message : "An unexpected error occurred during expense analysis and savings optimization." };
  }
}

export async function handleFinancialChat(input: FinancialChatInput): Promise<FinancialChatOutput | { error: string }> {
  try {
    const result = await financialChatFlow(input);
    return result;
  } catch (e) {
    console.error("Error in handleFinancialChat:", e);
    return { error: e instanceof Error ? e.message : "An unexpected error occurred during chat processing." };
  }
}

export async function handleSuggestInvestment(input: SuggestedInvestmentInput): Promise<SuggestedInvestmentOutput | { error: string }> {
  try {
    const result = await suggestInvestmentFlow(input);
    return result;
  } catch (e) {
    console.error("Error in handleSuggestInvestment:", e);
    return { error: e instanceof Error ? e.message : "An unexpected error occurred during investment suggestion." };
  }
}

