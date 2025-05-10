import { CreditScoreSimulator } from "@/components/dashboard/credit-score-simulator";
import { SavingsPlanGenerator } from "@/components/dashboard/savings-plan-generator";
import { BankLoanEligibility } from "@/components/dashboard/bank-loan-eligibility";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollReveal } from "@/components/utils/scroll-reveal";
import { FileText } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <ScrollReveal initialClass="opacity-0 -translate-y-10" finalClass="opacity-100 translate-y-0" delay={0}>
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl animated-text-gradient">
            Welcome to FinanceForward
          </h1>
          <p className="mt-6 text-lg leading-8 text-foreground/80 max-w-2xl mx-auto">
            Empowering you with AI-driven insights to navigate your financial journey. Simulate credit scores, generate personalized savings plans, and assess loan eligibility with ease.
          </p>
        </section>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 mb-12">
        <ScrollReveal delay={200}>
          <CreditScoreSimulator />
        </ScrollReveal>
        <ScrollReveal delay={400}>
          <SavingsPlanGenerator />
        </ScrollReveal>
      </div>

      <ScrollReveal delay={600}>
        <BankLoanEligibility />
      </ScrollReveal>


      <ScrollReveal delay={800}>
        <Card className="mt-12 shadow-lg bg-card transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1">
          <CardHeader>
            <div className="flex items-center space-x-2 group">
              <div className="transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Financial Literacy & AI</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base">
              FinanceForward uses advanced AI models to provide simulations and suggestions.
              These tools are designed for educational purposes to help you understand financial concepts.
              The simulated credit score does not impact your actual creditworthiness, savings plans are suggestions to guide your financial planning, and loan eligibility assessments are estimates, not guarantees.
              Always consult with a qualified financial advisor for personalized advice and directly with financial institutions for loan applications.
            </CardDescription>
          </CardContent>
        </Card>
      </ScrollReveal>

    </div>
  );
}
