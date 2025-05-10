// src/app/page.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollReveal } from "@/components/utils/scroll-reveal";
import { TrendingUp, PiggyBank, Landmark, Users, Wallet, ArrowRight, Clipboard, BarChartBig, ShieldCheck, Activity, Flame, LineChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    }
  ];

  const suggestedInvestments = {
    lowRisk: [
      { id: 'inv1', name: 'Govt. Bond Fund', symbol: 'GBFIN', description: 'Focuses on stable returns and principal protection through government-backed securities. Ideal for conservative investors.', dataAiHint: "safe investment", icon: <ShieldCheck className="h-6 w-6 text-green-600" /> },
      { id: 'inv2', name: 'BlueChip Equity Fund', symbol: 'BLUCHIP', description: 'Invests in large, well-established companies with a history of stable performance. Suitable for long-term, lower-risk equity exposure.', dataAiHint: "stock market", icon: <ShieldCheck className="h-6 w-6 text-green-600" /> }
    ],
    midRisk: [
      { id: 'inv3', name: 'Diversified Sector Fund', symbol: 'DIVSEC', description: 'Aims for balanced growth by investing across various economic sectors, offering diversification and moderate risk.', dataAiHint: "finance chart", icon: <Activity className="h-6 w-6 text-yellow-500" /> },
      { id: 'inv4', name: 'Emerging Tech ETF', symbol: 'EMTECH', description: 'Tracks a basket of promising technology companies, offering potential for higher growth with moderate volatility.', dataAiHint: "technology growth", icon: <Activity className="h-6 w-6 text-yellow-500" /> }
    ],
    highRisk: [
      { id: 'inv5', name: 'SmallCap Alpha Fund', symbol: 'SCALPHA', description: 'Invests in small-capitalization companies with high growth potential, accompanied by higher risk and volatility.', dataAiHint: "rocket graph", icon: <Flame className="h-6 w-6 text-red-500" /> },
      { id: 'inv6', name: 'Global Thematic Fund (Simulated)', symbol: 'GLOTHEME', description: 'Focuses on specific global trends like AI or renewable energy. High potential returns but subject to market speculation.', dataAiHint: "global trends", icon: <Flame className="h-6 w-6 text-red-500" /> }
    ]
  };

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
              delay={200 + (150 * index)} 
              className={cn(
                "h-full",
                index === features.length - 1 && features.length % 2 === 1 && "sm:col-span-2 sm:flex sm:justify-center",
                index === features.length - 1 && features.length % 3 === 1 && "lg:col-start-2 lg:col-span-1"
              )}
            >
              <Link href={feature.href} passHref legacyBehavior>
                <Card className={cn(
                  "group h-full flex flex-col rounded-lg shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-2 cursor-pointer border-border hover:border-primary",
                  index === features.length - 1 && features.length % 2 === 1 && "sm:max-w-md w-full"
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
          <h2 className="text-3xl font-semibold mb-10 text-center animated-text-gradient">Suggested Investments (Illustrative)</h2>
        </ScrollReveal>
        <ScrollReveal initialClass="opacity-0" finalClass="opacity-100" delay={200}>
          <Tabs defaultValue="lowRisk" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="lowRisk" className="flex items-center gap-2"><ShieldCheck className="h-5 w-5"/>Low Risk</TabsTrigger>
              <TabsTrigger value="midRisk" className="flex items-center gap-2"><Activity className="h-5 w-5"/>Mid Risk</TabsTrigger>
              <TabsTrigger value="highRisk" className="flex items-center gap-2"><Flame className="h-5 w-5"/>High Risk</TabsTrigger>
            </TabsList>
            <TabsContent value="lowRisk">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {suggestedInvestments.lowRisk.map((item, index) => (
                  <ScrollReveal key={item.id} delay={100 * index} className="h-full">
                    <Card className="group h-full flex flex-col rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-border hover:border-green-500/50">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-green-700 dark:text-green-500">{item.name}</CardTitle>
                          {item.icon}
                        </div>
                        <CardDescription className="text-xs text-muted-foreground">{item.symbol}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow text-sm">
                        <p className="text-muted-foreground mb-3">{item.description}</p>
                        <img 
                          src={`https://picsum.photos/seed/${item.id}/300/100`} 
                          alt={`${item.name} placeholder image`}
                          className="w-full h-24 object-cover rounded-md bg-muted"
                          data-ai-hint={item.dataAiHint}
                        />
                      </CardContent>
                      <div className="p-4 pt-2">
                        <Button variant="outline" size="sm" className="w-full border-green-500/50 text-green-600 hover:bg-green-500/10 hover:text-green-700">Learn More</Button>
                      </div>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="midRisk">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {suggestedInvestments.midRisk.map((item, index) => (
                  <ScrollReveal key={item.id} delay={100 * index} className="h-full">
                    <Card className="group h-full flex flex-col rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-border hover:border-yellow-500/50">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-yellow-700 dark:text-yellow-500">{item.name}</CardTitle>
                          {item.icon}
                        </div>
                        <CardDescription className="text-xs text-muted-foreground">{item.symbol}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow text-sm">
                        <p className="text-muted-foreground mb-3">{item.description}</p>
                         <img 
                          src={`https://picsum.photos/seed/${item.id}/300/100`} 
                          alt={`${item.name} placeholder image`}
                          className="w-full h-24 object-cover rounded-md bg-muted"
                          data-ai-hint={item.dataAiHint}
                        />
                      </CardContent>
                       <div className="p-4 pt-2">
                        <Button variant="outline" size="sm" className="w-full border-yellow-500/50 text-yellow-600 hover:bg-yellow-500/10 hover:text-yellow-700">Learn More</Button>
                      </div>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="highRisk">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {suggestedInvestments.highRisk.map((item, index) => (
                  <ScrollReveal key={item.id} delay={100 * index} className="h-full">
                    <Card className="group h-full flex flex-col rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-border hover:border-red-500/50">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-red-700 dark:text-red-500">{item.name}</CardTitle>
                          {item.icon}
                        </div>
                        <CardDescription className="text-xs text-muted-foreground">{item.symbol}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow text-sm">
                        <p className="text-muted-foreground mb-3">{item.description}</p>
                         <img 
                          src={`https://picsum.photos/seed/${item.id}/300/100`} 
                          alt={`${item.name} placeholder image`}
                          className="w-full h-24 object-cover rounded-md bg-muted"
                          data-ai-hint={item.dataAiHint}
                        />
                      </CardContent>
                      <div className="p-4 pt-2">
                        <Button variant="outline" size="sm" className="w-full border-red-500/50 text-red-600 hover:bg-red-500/10 hover:text-red-700">Learn More</Button>
                      </div>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
            </TabsContent>
          </Tabs>
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
