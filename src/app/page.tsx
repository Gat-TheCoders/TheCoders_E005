
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'; // Corrected import order
import { ScrollReveal } from "@/components/utils/scroll-reveal";
import { TrendingUp, PiggyBank, Landmark, Users, Wallet, ArrowRight, Database, SlidersHorizontal, Receipt, Lightbulb, FileText, PackageSearch, Cog } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface CardLinkProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

function CardLink({ href, icon, title, description, className }: CardLinkProps) {
  return (
    <Link href={href} className={cn("group h-full flex flex-col rounded-lg shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-2 cursor-pointer border-border hover:border-primary", className)}>
      <CardHeader className="items-center text-center pt-8 pb-4">
        <div className="p-4 bg-primary/10 rounded-full mb-3 transition-all duration-300 ease-out group-hover:scale-110 group-hover:bg-accent/10">
          {icon}
        </div>
        <CardTitle className="text-xl text-primary group-hover:text-accent transition-colors">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center flex-grow px-4 pb-4">
        <CardDescription className="text-xs text-muted-foreground">{description}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0 text-center justify-center">
          <Button variant="outline" size="sm" className="font-semibold text-primary group-hover:text-accent group-hover:border-accent transition-colors animated-bg-gradient hover:text-primary-foreground group-hover:text-accent-foreground">
            Explore Feature <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
          </Button>
      </CardFooter>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <ScrollReveal>
          <section className="py-16 md:py-24 lg:py-32 text-center bg-gradient-to-br from-background via-primary/5 to-background">
            <div className="container mx-auto px-4 md:px-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl animated-text-gradient">
                Welcome to Own Finance
              </h1>
              <p className="mt-6 text-lg leading-8 text-foreground/80 max-w-2xl mx-auto">
                Empowering you with AI-driven insights to navigate your financial journey. Explore our tools to simulate credit scores, generate personalized savings plans, assess loan eligibility, and more.
              </p>
              {/* "Get Started" button removed from here */}
            </div>
          </section>
        </ScrollReveal>

        {/* Features Grid Section */}
        <section className="py-12 md:py-20 bg-background/70">
          <div className="container mx-auto px-4 md:px-6">
            <ScrollReveal delay={200}>
              <h2 className="text-3xl font-semibold mb-10 md:mb-16 text-center text-primary animated-text-gradient">
                Explore Our Features
              </h2>
            </ScrollReveal>
            
            {/* Row for Credit Score, Savings Plan, Loan Eligibility */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-12">
              <ScrollReveal delay={300} className="h-full">
                <CardLink 
                  href="/credit-score-simulator"
                  icon={<TrendingUp className="h-10 w-10 text-accent group-hover:animate-pulse" />}
                  title="Credit Score Simulator"
                  description="Estimate your creditworthiness based on transaction and mobile usage patterns."
                />
              </ScrollReveal>
              <ScrollReveal delay={400} className="h-full">
                 <CardLink
                  href="/personalized-savings-plan"
                  icon={<PiggyBank className="h-10 w-10 text-accent group-hover:animate-pulse" />}
                  title="Personalized Savings Plan"
                  description="Get an AI-powered savings strategy tailored to your income, expenses, and financial goals."
                />
              </ScrollReveal>
              <ScrollReveal delay={500} className="h-full">
                <CardLink
                  href="/bank-loan-eligibility"
                  icon={<Landmark className="h-10 w-10 text-accent group-hover:animate-pulse" />}
                  title="Bank Loan Eligibility"
                  description="Assess your general loan eligibility and explore potential lender information."
                />
              </ScrollReveal>
            </div>

            {/* Row for Group Lending, Digital Wallet, Open Account */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-12">
              <ScrollReveal delay={700} className="h-full">
                <CardLink
                  href="/group-lending-advisor"
                  icon={<Users className="h-10 w-10 text-accent group-hover:animate-pulse" />}
                  title="Group Lending Advisor"
                  description="Receive AI-driven advice for your Self-Help Group or group lending initiatives."
                />
              </ScrollReveal>
              <ScrollReveal delay={800} className="h-full">
                 <CardLink
                  href="/digital-wallet"
                  icon={<Wallet className="h-10 w-10 text-accent group-hover:animate-pulse" />}
                  title="Simulated Digital Wallet"
                  description="Explore a simulation of community support funding credited to a virtual wallet."
                />
              </ScrollReveal>
              <ScrollReveal delay={900} className="h-full">
                <CardLink
                  href="/open-bank-account"
                  icon={<FileText className="h-10 w-10 text-accent group-hover:animate-pulse" />}
                  title="Open Bank Account"
                  description="Securely open an account with our online KYC process, featuring face capture and geo-tagging."
                />
              </ScrollReveal>
            </div>
            
            {/* Row for Expense Optimizer, Bill Payment, Fixed Deposit */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-12">
              <ScrollReveal delay={1100} className="h-full">
                <CardLink
                  href="/expense-optimizer"
                  icon={<SlidersHorizontal className="h-10 w-10 text-accent group-hover:animate-pulse" />}
                  title="Expense Optimizer"
                  description="Analyze your transaction patterns, get reduction tips, and optimize your savings and investment strategy."
                />
              </ScrollReveal>
              <ScrollReveal delay={1200} className="h-full">
                <CardLink
                  href="/bill-payment"
                  icon={<Receipt className="h-10 w-10 text-accent group-hover:animate-pulse" />}
                  title="Bill Payment"
                  description="Manage and pay your bills securely and conveniently. (Mock Interface)"
                />
              </ScrollReveal>
              <ScrollReveal delay={1300} className="h-full">
                <CardLink
                  href="/fixed-deposit"
                  icon={<Database className="h-10 w-10 text-accent group-hover:animate-pulse" />}
                  title="Fixed Deposit"
                  description="Explore fixed deposit options and calculate potential returns."
                />
              </ScrollReveal>
            </div>

            {/* Row for Suggested Investment */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-12 justify-center">
              <ScrollReveal delay={1400} className="h-full lg:col-span-1 md:col-span-2 col-span-1 md:max-w-md lg:max-w-none mx-auto w-full sm:max-w-md">
                <CardLink
                  href="/suggested-investment"
                  icon={<Lightbulb className="h-10 w-10 text-accent group-hover:animate-pulse" />}
                  title="Suggested Investment"
                  description="Get AI-powered investment ideas based on your income and capacity."
                />
              </ScrollReveal>
            </div>

          </div>
        </section>

        {/* Placeholder for additional sections like Testimonials or CTA */}
        <ScrollReveal delay={600}>
          <section className="py-12 md:py-20 bg-primary/5">
            <div className="container mx-auto px-4 md:px-6 text-center">
              <Cog className="h-12 w-12 text-primary mx-auto mb-4 animate-spin-slow" />
              <h3 className="text-2xl font-semibold text-primary mb-3">Continuous Improvement</h3>
              <p className="text-foreground/70 max-w-xl mx-auto">
                Own Finance is constantly evolving. We are committed to adding new features and enhancing existing tools to provide you with the best financial companion.
              </p>
            </div>
          </section>
        </ScrollReveal>
      </main>
    </div>
  );
}

