
import { config } from 'dotenv';
config();

import '@/ai/flows/credit-score-simulation.ts';
// import '@/ai/flows/personalized-savings-plan.ts'; // Removed
import '@/ai/flows/bank-loan-eligibility.ts';
import '@/ai/flows/group-lending-advisor.ts';
import '@/ai/flows/community-support-advisor.ts';
import '@/ai/flows/expense-optimizer.ts';
import '@/ai/flows/financial-chat-flow.ts';
import '@/ai/flows/suggested-investment-flow.ts'; 

// Import schema files if they are separate and need to be part of the build/watch process for Genkit
// import '@/ai/schemas/personalized-savings-plan-schemas.ts'; // Removed
import '@/ai/schemas/suggested-investment-schemas.ts'; 
    
