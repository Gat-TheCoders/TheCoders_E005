// src/app/dashboard/page.tsx
import type { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, CreditCard, PiggyBank, BarChartBig, Landmark, LayoutDashboard, TrendingUp, ListChecks, Settings, Home, Info, ArrowRight } from "lucide-react";
import { ScrollReveal } from '@/components/utils/scroll-reveal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'My Dashboard | Own Finance',
  description: 'Your financial command center. Access tools and get a quick overview of your financial activities.',
};

const dashboardFeatures = [
  {
    title: "Credit Score Simulator",
    description: "Estimate your creditworthiness.",
    href: "/credit-score-simulator",
    icon: <CreditCard className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />,
  },
  {
    title: "Personalized Savings Plan",
    description: "Create AI-powered savings strategies.",
    href: "/personalized-savings-plan",
    icon: <PiggyBank className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />,
  },
  {
    title: "Expense Optimizer",
    description: "Analyze spending and optimize savings.",
    href: "/expense-optimizer",
    icon: <BarChartBig className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />,
  },
  {
    title: "Bank Loan Eligibility",
    description: "Assess your general loan eligibility.",
    href: "/bank-loan-eligibility",
    icon: <Landmark className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />,
  },
];

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <ScrollReveal delay={0}>
        <header className="mb-10 text-center">
          <LayoutDashboard className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-primary">
            My Dashboard
          </h1>
          <p className="mt-4 text-lg leading-8 text-foreground/80 max-w-2xl mx-auto">
            Welcome to your financial command center. Access key tools and manage your finances effectively.
          </p>
        </header>
      </ScrollReveal>

      <ScrollReveal delay={200}>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center text-primary/90">Quick Access Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardFeatures.map((feature, index) => (
              <Link href={feature.href} passHref key={index} legacyBehavior>
                <Card className="group h-full flex flex-col rounded-lg shadow-md transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 cursor-pointer border-border hover:border-primary">
                  <CardHeader className="items-center text-center pt-6 pb-3">
                    <div className="p-3 rounded-full bg-primary/10 mb-3 transition-colors group-hover:bg-accent/10">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg font-semibold group-hover:text-accent transition-colors">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center flex-grow px-4 pb-4">
                    <CardDescription className="text-xs text-muted-foreground">{feature.description}</CardDescription>
                  </CardContent>
                   <CardFooter className="p-4 pt-0 text-center justify-center">
                      <Button variant="outline" size="sm" className="font-medium text-primary group-hover:text-accent group-hover:border-accent transition-colors">
                        Go to Tool <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </ScrollReveal>
      
      <ScrollReveal delay={300}>
        <section className="mb-12">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl text-primary">Financial Overview</CardTitle>
                    <CardDescription>View a detailed breakdown of your financial activities.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">
                        For a comprehensive visual summary of your income, expenses, investments, and savings over the financial year, please visit the Insights page.
                    </p>
                    <Button asChild className="animated-bg-gradient">
                        <Link href="/insights">
                            View Financial Insights <ArrowRight className="ml-2 h-4 w-4"/>
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </section>
      </ScrollReveal>


      <ScrollReveal delay={400}>
        <div className="mt-12 text-center">
          <Button variant="outline" asChild className="transition-all hover:shadow-md">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </ScrollReveal>
    </div>
  );
}