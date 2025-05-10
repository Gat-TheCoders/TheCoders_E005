'use server';
/**
 * @fileOverview A financial assistant chatbot AI agent.
 *
 * - financialChat - A function that handles chat interactions with the financial assistant.
 * - FinancialChatInput - The input type for the financialChat function.
 * - FinancialChatOutput - The return type for the financialChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialChatInputSchema = z.object({
  userQuery: z.string().min(1, { message: "Query cannot be empty." }).describe("The user's question or message."),
  // Optional: chatHistory: z.array(z.object({ role: z.enum(['user', 'model']), parts: z.array(z.object({text: z.string()})) })).optional().describe("Previous conversation history.")
});
export type FinancialChatInput = z.infer<typeof FinancialChatInputSchema>;

const FinancialChatOutputSchema = z.object({
  aiResponse: z.string().describe("The AI's response to the user's query."),
});
export type FinancialChatOutput = z.infer<typeof FinancialChatOutputSchema>;

export async function financialChat(input: FinancialChatInput): Promise<FinancialChatOutput> {
  return financialChatFlow(input);
}

const financialChatPrompt = ai.definePrompt({
  name: 'financialChatPrompt',
  input: {schema: FinancialChatInputSchema},
  output: {schema: FinancialChatOutputSchema},
  prompt: `You are "Finley", a friendly and knowledgeable AI financial assistant for the "Own Finance" website.
Your purpose is to help users understand and navigate the features of Own Finance, and to provide general information on related financial topics.

Own Finance offers the following tools:
- Credit Score Simulator: Estimates creditworthiness based on transaction and mobile usage patterns.
- Personalized Savings Plan: Generates AI-powered savings strategies.
- Bank Loan Eligibility: Assesses general loan eligibility and explores potential lender information.
- Group Lending Advisor: Provides AI-driven advice for Self-Help Groups.
- Simulated Digital Wallet & Support Advisor: Simulates community support funding.
- Open Bank Account: Allows users to securely open an account with online KYC.
- Expense Optimizer: Analyzes transaction patterns for expense reduction and savings optimization.

When responding:
- Be clear, concise, and helpful.
- If a question is about a specific Own Finance feature, briefly explain it and guide the user on how they might use it or where to find it.
- For general financial questions, provide informative answers.
- **Important Disclaimer**: If you provide any financial advice or suggestions, YOU MUST ALWAYS include this disclaimer: "Please remember, I'm an AI assistant. This information is for educational purposes only and not financial advice. Consult with a qualified financial professional for personalized guidance."
- If you cannot answer a question or if it's outside your scope (e.g., personal medical advice, illegal activities, highly specific non-financial topics), politely state that you cannot help with that specific request.
- Keep your responses focused on finance and the "Own Finance" platform.
- Do not ask for or store any Personally Identifiable Information (PII) like names, addresses, bank account numbers, etc.
- If the user asks "What can you do?", list the Own Finance features and state that you can answer questions about them and general finance.

User's query: {{{userQuery}}}

Provide your response:
`,
});

const financialChatFlow = ai.defineFlow(
  {
    name: 'financialChatFlow',
    inputSchema: FinancialChatInputSchema,
    outputSchema: FinancialChatOutputSchema,
  },
  async input => {
    // If chatHistory is added to input, it would be passed to the prompt like:
    // const history = input.chatHistory?.map(msg => ({ role: msg.role, parts: [{text: msg.text}] })) || [];
    // const {output} = await financialChatPrompt({userQuery: input.userQuery}, {history});

    const {output} = await financialChatPrompt(input);
    if (!output) {
      throw new Error("Failed to get a response from the AI model for financial chat.");
    }
    return output;
  }
);
