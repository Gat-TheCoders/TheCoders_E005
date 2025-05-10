
import { CreditScoreSimulator } from "@/components/dashboard/credit-score-simulator";
import { SavingsPlanGenerator } from "@/components/dashboard/savings-plan-generator";
import { BankLoanEligibility } from "@/components/dashboard/bank-loan-eligibility";
import { GroupLendingAdvisor } from "@/components/dashboard/group-lending-advisor";
import { DigitalWallet } from "@/components/dashboard/digital-wallet";
import { ScrollReveal } from "@/components/utils/scroll-reveal";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <ScrollReveal initialClass="opacity-0 -translate-y-10" finalClass="opacity-100 translate-y-0" delay={0}>
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl animated-text-gradient">
            Welcome to Own Finance
          </h1>
          <p className="mt-6 text-lg leading-8 text-foreground/80 max-w-3xl mx-auto">
            Empowering you with AI-driven insights to navigate your financial journey. Simulate credit scores, generate personalized savings plans, assess loan eligibility, get advice for group lending, and explore simulated community support.
          </p>
        </section>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 mb-12">
        <ScrollReveal delay={200} className="h-full">
          <CreditScoreSimulator />
        </ScrollReveal>
        <ScrollReveal delay={400} className="h-full">
          <SavingsPlanGenerator />
        </ScrollReveal>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 mb-12">
        <ScrollReveal delay={600} className="h-full">
         <BankLoanEligibility />
        </ScrollReveal>
        <ScrollReveal delay={800} className="h-full">
          <GroupLendingAdvisor />
        </ScrollReveal>
      </div>
      
      <ScrollReveal delay={1000}>
        <DigitalWallet />
      </ScrollReveal>
    </div>
  );
}
