// src/app/page.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollReveal } from "@/components/utils/scroll-reveal";
import { TrendingUp, PiggyBank, Landmark, Users, Wallet, ArrowRight, Clipboard, BarChartBig, ShieldCheck, Activity, Flame, LineChart, Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SuggestedInvestmentCard } from '@/components/dashboard/suggested-investment-card'; // Import the new component

export default function HomePage() {
  const features = [
    { 
      href: '/credit-score-simulator', 
      title: 'Credit Score Simulator', 
      icon: <TrendingUp className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />, 
      description: "Estimate your creditworthiness based on transaction and mobile usage patterns." 
    },
    { 
      href: '/personalized-savings-plan', 
      title: 'Personalized Savings Plan', 
      icon: <PiggyBank className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />, 
      description: "Get an AI-powered savings strategy tailored to your income, expenses, and financial goals." 
    },
    { 
      href: '/bank-loan-eligibility', 
      title: 'Bank Loan Eligibility', 
      icon: <Landmark className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />, 
      description: "Assess your general loan eligibility and explore potential lender information." 
    },
    { 
      href: '/group-lending-advisor', 
      title: 'Group Lending Advisor', 
      icon: <Users className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />, 
      description: "Receive AI-driven advice for your Self-Help Group or group lending initiatives." 
    },
    { 
      href: '/digital-wallet', 
      title: 'Simulated Digital Wallet', 
      icon: <Wallet className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />, 
      description: "Explore a simulation of community support funding credited to a virtual wallet." 
    },
    {
      href: '/open-bank-account',
      title: 'Open Bank Account',
      icon: <Clipboard className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />,
      description: "Securely open an account with our online KYC process, featuring face capture and geo-tagging."
    },
    {
      href: '/expense-optimizer',
      title: 'Expense Optimizer',
      icon: <BarChartBig className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />,
      description: "Analyze your transaction patterns, get reduction tips, and optimize your savings and investment strategy."
    },
    {
      href: '/bill-payment',
      title: 'Bill Payment',
      icon: <Receipt className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />,
      description: "Easily manage and pay your bills through our secure platform. (Coming Soon)"
    }
  ];


  return (
    <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
      <section className="mb-16 text-center">
        <h1
          className={cn(
            "text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl animated-text-gradient"
          )}
        >
          Welcome to Own Finance
        </h1>

        <ScrollReveal initialClass="opacity-0" finalClass="opacity-100" delay={0}>
            <p className="mt-6 text-lg leading-8 text-foreground/80 max-w-3xl mx-auto">
              Empowering you with AI-driven insights to navigate your financial journey. Explore our tools to simulate credit scores, generate personalized savings plans, assess loan eligibility, and more.
            </p>
        </ScrollReveal>
      </section>

      <section>
        <ScrollReveal initialClass="opacity-0" finalClass="opacity-100" delay={100}>
          <h2 className="text-3xl font-semibold mb-10 text-center animated-text-gradient">Explore Our Features</h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <ScrollReveal 
              key={feature.href} 
              delay={200 + (100 * index)}
              className={cn(
                "h-full",
                // Center if 1 card in last row of LG (3-col grid)
                features.length % 3 === 1 && index === features.length - 1 && "lg:col-start-2",
                // Center if 1 card in last row of SM (2-col grid), and reset for LG
                features.length % 2 === 1 && index === features.length - 1 && "sm:col-span-2 sm:flex sm:justify-center lg:col-span-1 lg:col-start-auto",
                // Specific handling for 7 items on LG to ensure centering, as the SM rule's LG reset might override the LG centering rule.
                // features.length === 7 && index === features.length - 1 && "lg:col-start-2" 
                 (features.length === 7 && index === features.length - 1) || (features.length === 8 && index >= features.length - 2 && features.length % 3 === 2) ? "lg:col-start-auto" : "",
                 features.length === 7 && index === features.length -1 && "lg:col-start-2",
                 features.length === 8 && index === features.length -2 && "lg:col-start-[auto] sm:col-span-1", // Ensure 2nd to last on 8 items is normal on sm
                 features.length === 8 && index === features.length -1 && "lg:col-start-auto sm:col-span-2 sm:flex sm:justify-center lg:col-span-1" // last on 8 items
              )}
            >
              <Link href={feature.href} passHref legacyBehavior>
                <Card className={cn(
                  "group h-full flex flex-col rounded-lg shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-2 cursor-pointer border-border hover:border-primary",
                  // Ensure centered card on SM takes appropriate width if its parent (ScrollReveal) is flex-centered
                  features.length % 2 === 1 && index === features.length -1 && "sm:max-w-md w-full",
                  features.length === 8 && index === features.length -1 && "sm:max-w-md w-full" 
                )}>
                  <CardHeader className="items-center text-center pt-8 pb-4">
                    <div className="p-4 rounded-full bg-primary/10 mb-4 transition-colors group-hover:bg-accent/10">
                        {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-semibold group-hover:text-accent transition-colors">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center flex-grow px-6 pb-6">
                    <CardDescription className="text-sm text-muted-foreground">{feature.description}</CardDescription>
                  </CardContent>
                  <div className="p-6 pt-0 text-center">
                      <Button variant="default" className="font-semibold animated-bg-gradient">
                        Explore Feature <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                  </div>
                </Card>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <ScrollReveal initialClass="opacity-0" finalClass="opacity-100" delay={100}>
          <h2 className="text-3xl font-semibold mb-10 text-center animated-text-gradient">AI Investment Suggester</h2>
        </ScrollReveal>
        <ScrollReveal initialClass="opacity-0" finalClass="opacity-100" delay={200}>
          <div className="max-w-2xl mx-auto">
            <SuggestedInvestmentCard />
          </div>
        </ScrollReveal>
        <ScrollReveal initialClass="opacity-0" finalClass="opacity-100" delay={400}>
          <p className="mt-8 text-center text-xs text-muted-foreground">
            Disclaimer: The investment suggestions provided are for illustrative and educational purposes only and do not constitute financial advice. Investing in financial markets involves risk, including the possible loss of principal. Always conduct your own research and consult with a qualified financial advisor before making any investment decisions.
          </p>
        </ScrollReveal>
      </section>

    </div>
  );
}

