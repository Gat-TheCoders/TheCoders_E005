'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollReveal } from "@/components/utils/scroll-reveal";
import { TrendingUp, PiggyBank, Landmark, Users, Wallet, ArrowRight, Clipboard, BarChartBig } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const [showRestOfPage, setShowRestOfPage] = useState(false); // Controls visibility of everything AFTER the h1
  const [headingGlow, setHeadingGlow] = useState(true);     // Controls glow effect on h1

  useEffect(() => {
    // Timer for the glow effect to stop
    const glowTimer = setTimeout(() => {
      setHeadingGlow(false);
    }, 3000); // Glow for 3 seconds

    // Timer for revealing the rest of the page content
    const contentTimer = setTimeout(() => {
      setShowRestOfPage(true);
    }, 3000); // Content appears after 3 seconds (coincides with glow ending)

    return () => {
      clearTimeout(glowTimer);
      clearTimeout(contentTimer);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

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
    }
  ];

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
      <section className="mb-16 text-center">
        {/* H1: Always rendered. Glow is controlled by `headingGlow` state. */}
        <h1
          className={cn(
            "text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl animated-text-gradient",
            headingGlow && "animate-text-glow-active" // Apply glow class if headingGlow is true
          )}
        >
          Welcome to Own Finance
        </h1>

        {/* Paragraph: Rendered and animated by ScrollReveal only when showRestOfPage is true */}
        {showRestOfPage && (
          <ScrollReveal initialClass="opacity-0" finalClass="opacity-100" delay={0}> {/* Delay 0 as parent controls timing */}
            <p className="mt-6 text-lg leading-8 text-foreground/80 max-w-3xl mx-auto">
              Empowering you with AI-driven insights to navigate your financial journey. Explore our tools to simulate credit scores, generate personalized savings plans, assess loan eligibility, and more.
            </p>
          </ScrollReveal>
        )}
      </section>

      {/* Features Section: Rendered and animated by ScrollReveal only when showRestOfPage is true */}
      {showRestOfPage && (
        <section>
          <ScrollReveal initialClass="opacity-0" finalClass="opacity-100" delay={100}> {/* Small delay for section title */}
            <h2 className="text-3xl font-semibold mb-10 text-center animated-text-gradient">Explore Our Features</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <ScrollReveal key={feature.href} delay={200 + (150 * index)} className="h-full">
                <Link href={feature.href} passHref legacyBehavior>
                  <Card className="group h-full flex flex-col rounded-lg shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-2 cursor-pointer border-border hover:border-primary">
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
      )}
    </div>
  );
}
