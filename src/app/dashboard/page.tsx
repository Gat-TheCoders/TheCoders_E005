// src/app/dashboard/page.tsx
'use client'; 

import Link from "next/link";
import { 
  ArrowLeft, 
  PiggyBank as PiggyBankIcon,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  LineChart as LineChartLucideIcon,
  CalendarDays,
  PackagePlus,
  Landmark
} from "lucide-react";
import { ScrollReveal } from '@/components/utils/scroll-reveal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";


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


export default function DashboardPage() {

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <ScrollReveal delay={0}>
        <header className="mb-10 text-center">
          <LineChartLucideIcon className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-primary">
            Financial Overview
          </h1>
          <p className="mt-4 text-lg leading-8 text-foreground/80 max-w-2xl mx-auto">
            View your monthly income, savings, and investment breakdown. All data is illustrative.
          </p>
        </header>
      </ScrollReveal>
      
      <ScrollReveal delay={100}>
        <section className="mb-12">
            <Card className="shadow-xl">
                <CardHeader>
                    <div className="flex items-center space-x-3">
                        <LineChartLucideIcon className="h-8 w-8 text-primary" />
                        <CardTitle className="text-2xl text-primary">Monthly Financial Summary</CardTitle>
                    </div>
                    <CardDescription>Monthly income, savings, and investment breakdown (₹). All data is illustrative.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {financialDashboardData.map((item, index) => (
                        <div key={item.month} className="p-4 border rounded-lg shadow-sm bg-secondary/10">
                            <h4 className="text-lg font-semibold text-primary mb-3 flex items-center">
                                <CalendarDays className="h-5 w-5 mr-2 text-accent" />
                                {item.month}
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm">
                                <div className="flex items-center">
                                    <DollarSign className="h-4 w-4 mr-1.5 text-muted-foreground" />
                                    <span className="font-medium">Income:</span>
                                    <span className="ml-1 text-foreground">₹{item.income.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex items-center">
                                    <PiggyBankIcon className="h-4 w-4 mr-1.5 text-muted-foreground" />
                                    <span className="font-medium">Savings:</span>
                                    <span className="ml-1 text-foreground">₹{item.savings.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex items-center col-span-2 md:col-span-1">
                                    <PackagePlus className="h-4 w-4 mr-1.5 text-muted-foreground" />
                                    <span className="font-medium">Total Investments:</span>
                                    <span className="ml-1 text-foreground">₹{item.totalInvestments.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex items-center">
                                    <ShieldCheck className="h-4 w-4 mr-1.5 text-muted-foreground" />
                                    <span className="font-medium">Insurance:</span>
                                    <span className="ml-1 text-foreground">₹{item.insuranceInvestments.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex items-center">
                                    <TrendingUp className="h-4 w-4 mr-1.5 text-muted-foreground" />
                                    <span className="font-medium">Stocks:</span>
                                    <span className="ml-1 text-foreground">₹{item.stockInvestments.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex items-center">
                                    <Landmark className="h-4 w-4 mr-1.5 text-muted-foreground" /> {/* Using Landmark for Mutual Funds */}
                                    <span className="font-medium">Mutual Funds:</span>
                                    <span className="ml-1 text-foreground">₹{item.mutualFundInvestments.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                            {index < financialDashboardData.length - 1 && <Separator className="my-4" />}
                        </div>
                    ))}
                     <p className="mt-6 text-xs text-muted-foreground text-center">
                        For a detailed expense view, visit the <Link href="/insights" className="text-primary hover:underline">Insights page</Link>.
                    </p>
                </CardContent>
            </Card>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={200}>
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

