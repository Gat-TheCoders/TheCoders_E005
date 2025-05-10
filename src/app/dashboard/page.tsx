// src/app/dashboard/page.tsx
'use client'; // Ensure this is a client component for chart interaction and state

import type { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  ArrowLeft, 
  CreditCard, 
  PiggyBank as PiggyBankIcon, // Renamed to avoid conflict with data key
  BarChartBig as BarChartBigIcon, // Renamed
  Landmark, 
  LayoutDashboard, 
  ArrowRight,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  LineChart as LineChartLucideIcon // Renamed for clarity
} from "lucide-react";
import { ScrollReveal } from '@/components/utils/scroll-reveal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, StackedBar } from 'recharts';

// Static metadata can be defined here if needed, but for dynamic titles, useEffect is better in client components
// export const metadata: Metadata = {
//   title: 'My Dashboard | Own Finance',
//   description: 'Your financial command center. Access tools, get a quick overview of your financial activities including detailed investment breakdown.',
// };

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
    icon: <PiggyBankIcon className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />,
  },
  {
    title: "Expense Optimizer",
    description: "Analyze spending and optimize savings.",
    href: "/expense-optimizer",
    icon: <BarChartBigIcon className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />,
  },
  {
    title: "Bank Loan Eligibility",
    description: "Assess your general loan eligibility.",
    href: "/bank-loan-eligibility",
    icon: <Landmark className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />,
  },
];

const financialDashboardData = [
  { month: "Apr", income: 75000, savings: 15000, insuranceInvestments: 2000, stockInvestments: 5000, mutualFundInvestments: 3000 },
  { month: "May", income: 76000, savings: 14000, insuranceInvestments: 2000, stockInvestments: 5500, mutualFundInvestments: 3200 },
  { month: "Jun", income: 77000, savings: 16000, insuranceInvestments: 2100, stockInvestments: 5800, mutualFundInvestments: 3000 },
  { month: "Jul", income: 75000, savings: 13000, insuranceInvestments: 2100, stockInvestments: 6000, mutualFundInvestments: 3500 },
  { month: "Aug", income: 78000, savings: 12000, insuranceInvestments: 2200, stockInvestments: 6200, mutualFundInvestments: 3800 },
  { month: "Sep", income: 80000, savings: 15000, insuranceInvestments: 2200, stockInvestments: 6500, mutualFundInvestments: 4000 },
  { month: "Oct", income: 82000, savings: 14000, insuranceInvestments: 2300, stockInvestments: 6800, mutualFundInvestments: 4200 },
  { month: "Nov", income: 79000, savings: 13000, insuranceInvestments: 2300, stockInvestments: 7000, mutualFundInvestments: 3700 },
  { month: "Dec", income: 85000, savings: 15000, insuranceInvestments: 2400, stockInvestments: 7500, mutualFundInvestments: 4500 },
  { month: "Jan", income: 80000, savings: 14000, insuranceInvestments: 2400, stockInvestments: 7200, mutualFundInvestments: 4300 },
  { month: "Feb", income: 81000, savings: 15000, insuranceInvestments: 2500, stockInvestments: 7300, mutualFundInvestments: 4000 },
  { month: "Mar", income: 83000, savings: 13000, insuranceInvestments: 2500, stockInvestments: 7800, mutualFundInvestments: 4600 },
].map(item => ({
  ...item,
  totalInvestments: item.insuranceInvestments + item.stockInvestments + item.mutualFundInvestments
}));


const dashboardChartConfig = {
  income: { label: "Income", color: "hsl(var(--chart-1))", icon: DollarSign },
  savings: { label: "Savings", color: "hsl(var(--chart-2))", icon: PiggyBankIcon },
  insuranceInvestments: { label: "Insurance", color: "hsl(var(--chart-3))", icon: ShieldCheck },
  stockInvestments: { label: "Stocks", color: "hsl(var(--chart-4))", icon: TrendingUp },
  mutualFundInvestments: { label: "Mutual Funds", color: "hsl(var(--chart-5))", icon: BarChartBigIcon },
} satisfies ChartConfig;


export default function DashboardPage() {
  // useEffect for dynamic title updates if needed
  // useEffect(() => {
  //   document.title = 'My Dashboard | Own Finance';
  // }, []);

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
            <Card className="shadow-xl">
                <CardHeader>
                    <div className="flex items-center space-x-3">
                        <LineChartLucideIcon className="h-8 w-8 text-primary" />
                        <CardTitle className="text-2xl text-primary">Financial Overview</CardTitle>
                    </div>
                    <CardDescription>Monthly income, savings, and investment breakdown (₹). All data is illustrative.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={dashboardChartConfig} className="min-h-[350px] w-full aspect-video">
                        <ResponsiveContainer width="100%" height={400}>
                            <ComposedChart 
                                data={financialDashboardData} 
                                margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis 
                                    dataKey="month" 
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <YAxis 
                                    tickFormatter={(value) => `₹${value/1000}k`}
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="dot" />}
                                />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Line type="monotone" dataKey="income" stroke="var(--color-income)" strokeWidth={2} dot={false} name="Income"/>
                                <Line type="monotone" dataKey="savings" stroke="var(--color-savings)" strokeWidth={2} dot={false} name="Savings"/>
                                <Bar dataKey="insuranceInvestments" stackId="investments" fill="var(--color-insuranceInvestments)" radius={[4, 4, 0, 0]} name="Insurance" barSize={30}/>
                                <Bar dataKey="stockInvestments" stackId="investments" fill="var(--color-stockInvestments)" name="Stocks" barSize={30}/>
                                <Bar dataKey="mutualFundInvestments" stackId="investments" fill="var(--color-mutualFundInvestments)" radius={[4, 4, 0, 0]} name="Mutual Funds" barSize={30}/>
                            </ComposedChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                     <p className="mt-4 text-xs text-muted-foreground text-center">
                        Note: "Total Investments" is represented by the sum of stacked Insurance, Stocks, and Mutual Funds bars.
                        For a view including expenses, visit the <Link href="/insights" className="text-primary hover:underline">Insights page</Link>.
                    </p>
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
