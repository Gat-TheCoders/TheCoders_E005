// src/app/dashboard/page.tsx
'use client';

import type { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, BarChart, PiggyBank, TrendingDown, TrendingUp, DollarSign, Wallet, PackageOpen, LineChart as LineChartIcon } from "lucide-react";
import { ScrollReveal } from '@/components/utils/scroll-reveal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

// Metadata can't be dynamically generated in client components easily without workarounds.
// For static metadata, it's fine. If dynamic needed, consider moving to server component or layout.
// export const metadata: Metadata = { // This will cause a warning if used in a 'use client' component directly for dynamic titles
//   title: 'Financial Insights | Own Finance',
//   description: 'View your financial year overview including income, expenses, investments, and savings.',
// };


const financialYearData = [
  { month: "Apr", income: 75000, expenses: 45000, investments: 15000, savings: 15000 },
  { month: "May", income: 76000, expenses: 46000, investments: 16000, savings: 14000 },
  { month: "Jun", income: 77000, expenses: 44000, investments: 17000, savings: 16000 },
  { month: "Jul", income: 75000, expenses: 47000, investments: 15000, savings: 13000 },
  { month: "Aug", income: 78000, expenses: 48000, investments: 18000, savings: 12000 },
  { month: "Sep", income: 80000, expenses: 45000, investments: 20000, savings: 15000 },
  { month: "Oct", income: 82000, expenses: 50000, investments: 18000, savings: 14000 },
  { month: "Nov", income: 79000, expenses: 47000, investments: 19000, savings: 13000 },
  { month: "Dec", income: 85000, expenses: 48000, investments: 22000, savings: 15000 },
  { month: "Jan", income: 80000, expenses: 46000, investments: 20000, savings: 14000 },
  { month: "Feb", income: 81000, expenses: 45000, investments: 21000, savings: 15000 },
  { month: "Mar", income: 83000, expenses: 47000, investments: 23000, savings: 13000 },
];

const chartConfig = {
  income: { label: "Income", color: "hsl(var(--chart-1))", icon: DollarSign },
  expenses: { label: "Expenses", color: "hsl(var(--chart-4))", icon: Wallet },
  investments: { label: "Investments", color: "hsl(var(--chart-2))", icon: PackageOpen },
  savings: { label: "Savings", color: "hsl(var(--chart-3))", icon: PiggyBank },
} satisfies ChartConfig;

export default function FinancialInsightsPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <ScrollReveal delay={0}>
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-primary">
            Financial Insights
          </h1>
          <p className="mt-4 text-lg leading-8 text-foreground/80 max-w-2xl mx-auto">
            A visual overview of your simulated financial activity throughout the year. All data is illustrative.
          </p>
        </header>
      </ScrollReveal>

      <ScrollReveal delay={200}>
        <Card className="shadow-xl col-span-1 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <LineChartIcon className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl text-primary">Financial Year Overview</CardTitle>
            </div>
            <CardDescription>Monthly breakdown of income, expenses, investments, and savings (₹).</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full aspect-video">
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={financialYearData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
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
                  <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} name="Expenses" />
                  <Line type="monotone" dataKey="investments" stroke="var(--color-investments)" strokeWidth={2} dot={false} name="Investments"/>
                  <Line type="monotone" dataKey="savings" stroke="var(--color-savings)" strokeWidth={2} dot={false} name="Savings"/>
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
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