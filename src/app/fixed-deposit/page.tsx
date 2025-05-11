
import type { Metadata } from 'next';
import { FixedDepositForm } from "@/components/dashboard/fixed-deposit-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Database } from "lucide-react";
import { ScrollReveal } from '@/components/utils/scroll-reveal';

export const metadata: Metadata = {
  title: 'Fixed Deposit Calculator | Own Finance',
  description: 'Calculate potential returns on your fixed deposits and explore options.',
};

export default function FixedDepositPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <ScrollReveal delay={0}>
         <header className="mb-10 text-center">
          <Database className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-primary">
            Fixed Deposit Calculator
          </h1>
          <p className="mt-4 text-lg leading-8 text-foreground/80 max-w-2xl mx-auto">
            Enter your investment amount and duration to estimate potential returns on fixed deposits.
          </p>
        </header>
      </ScrollReveal>
      
      <ScrollReveal delay={200}>
        <div className="max-w-2xl mx-auto">
            <FixedDepositForm />
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
