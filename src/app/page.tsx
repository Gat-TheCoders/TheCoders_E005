import { CreditScoreSimulator } from "@/components/dashboard/credit-score-simulator";
import { SavingsPlanGenerator } from "@/components/dashboard/savings-plan-generator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
          Welcome to FinanceForward
        </h1>
        <p className="mt-6 text-lg leading-8 text-foreground/80 max-w-2xl mx-auto">
          Empowering you with AI-driven insights to navigate your financial journey. Simulate credit scores and generate personalized savings plans with ease.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <CreditScoreSimulator />
        <SavingsPlanGenerator />
      </div>

      <Card className="mt-12 shadow-lg bg-card">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-primary" />
            <CardTitle>Financial Literacy & AI</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base">
            FinanceForward uses advanced AI models to provide simulations and suggestions. 
            These tools are designed for educational purposes to help you understand financial concepts.
            The simulated credit score does not impact your actual creditworthiness, and savings plans are suggestions to guide your financial planning.
            Always consult with a qualified financial advisor for personalized advice.
          </CardDescription>
        </CardContent>
      </Card>

    </div>
  );
}
