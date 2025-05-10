
import type { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, CandlestickChart, PieChart, TrendingUp, Landmark, Briefcase, DollarSign, Scale, PiggyBank, Receipt } from "lucide-react";
import { ScrollReveal } from '@/components/utils/scroll-reveal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from "@/components/ui/progress";

export const metadata: Metadata = {
  title: 'Financial Dashboard | Own Finance',
  description: 'View your stock, mutual fund investments, savings, and expenses. This is an illustrative dashboard.',
};

// Dummy data for illustrative purposes
const stockInvestments = [
  { id: 'stock1', name: 'TechNova Solutions Ltd.', symbol: 'TNVINDIA', shares: 100, currentPrice: 1507.50, purchasePrice: 1205.00, dataAiHint: "technology chart" },
  { id: 'stock2', name: 'GreenEnergy India', symbol: 'GEINDIA', shares: 200, currentPrice: 752.00, purchasePrice: 600.00, dataAiHint: "ecology graph" },
  { id: 'stock3', name: 'HealthPlus Pharma', symbol: 'HPSINDIA', shares: 50, currentPrice: 2800.00, purchasePrice: 2500.00, dataAiHint: "medical data" },
];

const mutualFundInvestments = [
  { id: 'mf1', name: 'India Growth Fund', type: 'Equity', units: 500, nav: 45.60, investedValue: 20000, dataAiHint: "india finance" },
  { id: 'mf2', name: 'Dynamic Asset Allocation Fund', type: 'Hybrid', units: 1000, nav: 22.30, investedValue: 18000, dataAiHint: "scale balance" },
  { id: 'mf3', name: 'Secure Income Plan', type: 'Debt', units: 1500, nav: 15.75, investedValue: 22000, dataAiHint: "safe money" },
];

const savingsAccounts = [
  { id: 'savings1', name: 'Emergency Fund', balance: 52500.75, goal: 100000, currency: '₹', dataAiHint: "safe moneybox" },
  { id: 'savings2', name: 'Vacation Fund', balance: 18200.50, goal: 30000, currency: '₹', dataAiHint: "travel savings" },
  { id: 'savings3', name: 'General Savings', balance: 76800.00, currency: '₹', dataAiHint: "piggy bank icon" },
];
const totalSavings = savingsAccounts.reduce((acc, s) => acc + s.balance, 0);

const expenseCategories = [
  { id: 'expense1', name: 'Housing', amount: 12500.00, currency: '₹', dataAiHint: "home rent" },
  { id: 'expense2', name: 'Food & Groceries', amount: 4750.50, currency: '₹', dataAiHint: "shopping cart" },
  { id: 'expense3', name: 'Transportation', amount: 2100.00, currency: '₹', dataAiHint: "bus car" },
  { id: 'expense4', name: 'Entertainment', amount: 1650.25, currency: '₹', dataAiHint: "movie tickets" },
  { id: 'expense5', name: 'Utilities', amount: 1850.70, currency: '₹', dataAiHint: "electricity bill" },
];
const totalMonthlyExpenses = expenseCategories.reduce((acc, e) => acc + e.amount, 0);


export default function DashboardPage() {
  const totalStockValue = stockInvestments.reduce((acc, stock) => acc + (stock.shares * stock.currentPrice), 0);
  const totalMutualFundValue = mutualFundInvestments.reduce((acc, mf) => acc + (mf.units * mf.nav), 0);
  const totalInvestmentValue = totalStockValue + totalMutualFundValue;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <ScrollReveal delay={0}>
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-primary text-center">
            Financial Dashboard
          </h1>
          <p className="mt-4 text-lg leading-8 text-foreground/80 max-w-2xl mx-auto text-center">
            Overview of your simulated investments, savings, and expenses. All data is illustrative.
          </p>
        </header>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <Card className="mb-8 shadow-lg bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-accent flex items-center"><DollarSign className="mr-2 h-7 w-7"/>Overall Financial Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total Investment Value:</p>
                <p className="text-lg font-semibold text-primary">₹{totalInvestmentValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Savings:</p>
                <p className="text-lg font-semibold text-primary">₹{totalSavings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
               <div>
                <p className="text-muted-foreground">Total Stock Value:</p>
                <p className="font-semibold text-foreground/90">₹{totalStockValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Mutual Fund Value:</p>
                <p className="font-semibold text-foreground/90">₹{totalMutualFundValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Monthly Expenses (Simulated):</p>
                <p className="text-lg font-semibold text-primary">₹{totalMonthlyExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ScrollReveal delay={200}>
          <Card className="shadow-xl h-full">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <CandlestickChart className="h-8 w-8 text-primary" />
                <CardTitle className="text-2xl text-primary">Stock Investments</CardTitle>
              </div>
              <CardDescription>Your current simulated stock holdings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {stockInvestments.map((stock) => (
                <Card key={stock.id} className="bg-secondary/20 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex justify-between items-center">
                      <span>{stock.name} ({stock.symbol})</span>
                      <Badge variant={stock.currentPrice >= stock.purchasePrice ? "default" : "destructive"} className={stock.currentPrice >= stock.purchasePrice ? "bg-green-500/80 hover:bg-green-600/80" : "bg-red-500/80 hover:bg-red-600/80"}>
                        {stock.currentPrice >= stock.purchasePrice ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />}
                        {(((stock.currentPrice - stock.purchasePrice) / stock.purchasePrice) * 100).toFixed(2)}%
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <div className="flex justify-between"><span>Shares:</span> <span className="font-medium">{stock.shares}</span></div>
                    <div className="flex justify-between"><span>Current Price:</span> <span className="font-medium">₹{stock.currentPrice.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Purchase Price:</span> <span className="font-medium">₹{stock.purchasePrice.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Total Value:</span> <span className="font-bold text-primary">₹{(stock.shares * stock.currentPrice).toFixed(2)}</span></div>
                    <div className="h-24 w-full mt-2 rounded bg-muted flex items-center justify-center">
                       <img 
                        src={`https://picsum.photos/seed/${stock.id}/300/100`} 
                        alt={`${stock.name} chart placeholder`} 
                        className="object-cover w-full h-full rounded"
                        data-ai-hint={stock.dataAiHint}
                        />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <Card className="shadow-xl h-full">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <PieChart className="h-8 w-8 text-primary" />
                <CardTitle className="text-2xl text-primary">Mutual Fund Investments</CardTitle>
              </div>
              <CardDescription>Your current simulated mutual fund holdings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {mutualFundInvestments.map((mf) => (
                <Card key={mf.id} className="bg-secondary/20 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                     <CardTitle className="text-lg flex justify-between items-center">
                      <span>{mf.name}</span>
                      <Badge variant="secondary">{mf.type}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <div className="flex justify-between"><span>Units:</span> <span className="font-medium">{mf.units.toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between"><span>NAV:</span> <span className="font-medium">₹{mf.nav.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Invested Value:</span> <span className="font-medium">₹{mf.investedValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                    <div className="flex justify-between"><span>Current Value:</span> <span className="font-bold text-primary">₹{(mf.units * mf.nav).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                     <div className="h-24 w-full mt-2 rounded bg-muted flex items-center justify-center">
                       <img 
                        src={`https://picsum.photos/seed/${mf.id}/300/100`} 
                        alt={`${mf.name} chart placeholder`} 
                        className="object-cover w-full h-full rounded"
                        data-ai-hint={mf.dataAiHint}
                        />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </ScrollReveal>

        <ScrollReveal delay={400}>
          <Card className="shadow-xl h-full">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <PiggyBank className="h-8 w-8 text-primary" />
                <CardTitle className="text-2xl text-primary">Savings Overview</CardTitle>
              </div>
              <CardDescription>Your current simulated savings status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {savingsAccounts.map((account) => (
                <Card key={account.id} className="bg-secondary/20 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{account.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <div className="flex justify-between">
                        <span>Current Balance:</span> 
                        <span className="font-bold text-primary">{account.currency}{account.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    {account.goal && (
                      <>
                        <div className="flex justify-between">
                            <span>Goal:</span> 
                            <span className="font-medium">{account.currency}{account.goal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <Progress value={(account.balance / account.goal) * 100} className="h-2" />
                        <p className="text-xs text-muted-foreground text-right">{((account.balance / account.goal) * 100).toFixed(1)}% Achieved</p>
                      </>
                    )}
                     <div className="h-20 w-full mt-2 rounded bg-muted flex items-center justify-center">
                       <img 
                        src={`https://picsum.photos/seed/${account.id}/280/80`} 
                        alt={`${account.name} visual placeholder`} 
                        className="object-cover w-full h-full rounded"
                        data-ai-hint={account.dataAiHint}
                        />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </ScrollReveal>

        <ScrollReveal delay={500}>
          <Card className="shadow-xl h-full">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Receipt className="h-8 w-8 text-primary" />
                <CardTitle className="text-2xl text-primary">Monthly Expense Summary</CardTitle>
              </div>
              <CardDescription>Your simulated monthly expense categories.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {expenseCategories.map((expense) => (
                <Card key={expense.id} className="bg-secondary/20 hover:shadow-md transition-shadow">
                  <CardContent className="pt-4 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{expense.name}</span>
                      <span className="font-bold text-primary">{expense.currency}{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                     <div className="h-16 w-full mt-2 rounded bg-muted flex items-center justify-center">
                       <img 
                        src={`https://picsum.photos/seed/${expense.id}/280/60`} 
                        alt={`${expense.name} visual placeholder`} 
                        className="object-cover w-full h-full rounded"
                        data-ai-hint={expense.dataAiHint}
                        />
                    </div>
                  </CardContent>
                </Card>
              ))}
               <div className="pt-4 border-t border-border/50">
                <div className="flex justify-between text-md font-semibold">
                    <span>Total Monthly Expenses:</span>
                    <span className="text-accent">₹{totalMonthlyExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
               </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>

      <ScrollReveal delay={600}>
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

