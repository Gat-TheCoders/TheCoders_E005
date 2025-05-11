
import type { Metadata } from 'next';
import { PersonalizedSavingsPlanForm } from "@/components/dashboard/personalized-savings-plan-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, PiggyBank } from "lucide-react";
import { ScrollReveal } from '@/components/utils/scroll-reveal';

export const metadata: Metadata = {
  title: 'Personalized Savings Plan | Own Finance',
  description: 'Get an AI-powered savings strategy tailored to your income, expenses, and financial goals.',
};

export default function PersonalizedSavingsPlanPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <ScrollReveal delay={0}>
         <header className="mb-10 text-center">
          <PiggyBank className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-primary">
            Personalized Savings Plan
          </h1>
          <p className="mt-4 text-lg leading-8 text-foreground/80 max-w-2xl mx-auto">
            Input your financial details and goals to receive a tailored AI-powered savings strategy.
          </p>
        </header>
      </ScrollReveal>
      <ScrollReveal delay={200}>
        <div className="max-w-3xl mx-auto">
          <PersonalizedSavingsPlanForm />
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
