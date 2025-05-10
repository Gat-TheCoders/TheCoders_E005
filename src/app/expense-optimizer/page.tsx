
import type { Metadata } from 'next';
import { ExpenseOptimizerForm } from "@/components/dashboard/expense-optimizer-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ScrollReveal } from '@/components/utils/scroll-reveal';

export const metadata: Metadata = {
  title: 'Expense Optimizer | Own Finance',
  description: 'Analyze your spending patterns, get suggestions to reduce expenses, and optimize your savings and investments with AI-powered insights based on your transaction history.',
};

export default function ExpenseOptimizerPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <ScrollReveal delay={0}>
         <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-primary">
            AI-Powered Expense Optimizer
          </h1>
          <p className="mt-4 text-lg leading-8 text-foreground/80 max-w-2xl mx-auto">
            Describe your transaction patterns, receive personalized suggestions to cut costs, and learn how to boost your savings and investments effectively.
          </p>
        </header>
      </ScrollReveal>
      <ScrollReveal delay={200}>
        <div className="max-w-3xl mx-auto">
          <ExpenseOptimizerForm />
        </div>
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
