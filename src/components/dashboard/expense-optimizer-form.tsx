
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BarChartBig, Loader2, Search, TrendingDown, ShieldAlert, Lightbulb, DollarSign, Info } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { handleAnalyzeExpensesAndOptimizeSavings } from '@/app/actions';
import type { ExpenseOptimizerInput, ExpenseOptimizerOutput } from '@/ai/flows/expense-optimizer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  monthlyIncome: z.coerce.number({invalid_type_error: "Monthly income must be a number.", required_error: "Monthly income is required."}).positive({ message: "Monthly income must be a positive number." }),
  transactionHistoryDescription: z
    .string({ required_error: "Transaction history description is required."})
    .min(50, { message: "Please provide a detailed description of your transaction history (min 50 characters)." }),
  savingsGoals: z.string().min(10, { message: "Please describe your savings goals (min 10 characters)." }),
});

export function ExpenseOptimizerForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ExpenseOptimizerOutput | null>(null);

  const form = useForm<ExpenseOptimizerInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monthlyIncome: undefined, 
      transactionHistoryDescription: '',
      savingsGoals: '',
    },
  });

  const onSubmit: SubmitHandler<ExpenseOptimizerInput> = async (values) => {
    setIsLoading(true);
    setAnalysisResult(null);
    
    // Ensure monthlyIncome is a number
    const processedValues = {
      ...values,
      monthlyIncome: Number(values.monthlyIncome),
    };

    const result = await handleAnalyzeExpensesAndOptimizeSavings(processedValues);
    setIsLoading(false);

    if ('error' in result) {
      toast({
        variant: 'destructive',
        title: 'Error Analyzing Expenses',
        description: result.error,
      });
    } else {
      setAnalysisResult(result);
      toast({
        title: 'Expense Analysis Complete',
        description: 'Your personalized expense optimization plan is ready.',
      });
    }
  };

  return (
    <Card className="shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 group w-full">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-[-3deg]">
            <BarChartBig className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>AI-Powered Expense Optimizer</CardTitle>
        </div>
        <CardDescription>Input your income, describe your transaction patterns, and state your goals to receive AI-driven advice on how to save and invest smarter.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="monthlyIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />Monthly Income (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 50000" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transactionHistoryDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Info className="mr-2 h-4 w-4 text-muted-foreground" />Transaction History Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your recent spending from your digital wallet: e.g., 'Weekly groceries around ₹3000 at various supermarkets, ₹100 daily for chai/snacks, ₹1500 on fuel every 2 weeks, multiple streaming subscriptions totaling ₹800/month, dine out 2-3 times a month spending about ₹1000 each time, occasional online shopping for clothes/electronics averaging ₹2000-₹4000/month...'"
                      className="resize-y min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="savingsGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Lightbulb className="mr-2 h-4 w-4 text-muted-foreground" />Savings & Investment Goals</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Save ₹2,00,000 for a bike down payment in 1 year, invest 10% of income for retirement, build a ₹50,000 emergency fund..."
                      className="resize-y min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Analyze & Optimize Expenses
            </Button>
          </CardFooter>
        </form>
      </Form>

      {analysisResult && (
        <CardContent className="mt-6 border-t pt-6 space-y-6">
          <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
            <Search className="h-6 w-6 mr-2 text-accent" />
            Your Personalized Expense & Savings Analysis
          </h3>

          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-medium mb-1 text-foreground/90">Expense Analysis Overview:</h4>
              <p className="text-sm whitespace-pre-wrap text-muted-foreground bg-secondary/20 p-3 rounded-md">{analysisResult.expenseAnalysis}</p>
            </div>

            {analysisResult.reductionSuggestions && analysisResult.reductionSuggestions.length > 0 && (
              <div>
                <h4 className="text-lg font-medium mb-2 text-foreground/90 flex items-center">
                    <TrendingDown className="h-5 w-5 mr-2 text-primary/80" />
                    Expense Reduction Suggestions:
                </h4>
                <Accordion type="single" collapsible className="w-full">
                  {analysisResult.reductionSuggestions.map((suggestion, index) => (
                    <AccordionItem value={`suggestion-${index}`} key={index} className="bg-secondary/20 rounded-md mb-2">
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex items-center space-x-2">
                           <DollarSign className="h-5 w-5 text-destructive" />
                           <span className="font-medium text-base">Reduce {suggestion.categoryName} by ₹{suggestion.suggestedReductionAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/month</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pt-0 pb-3 space-y-1 text-sm">
                        <p><strong className="font-medium text-foreground/80">Potential Monthly Savings:</strong> ₹{suggestion.potentialMonthlySavings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p><strong className="font-medium text-foreground/80">Reasoning:</strong> {suggestion.reasoning}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

            <div>
              <h4 className="text-lg font-medium mb-1 text-foreground/90 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-primary/80" />
                Savings Optimization Plan:
              </h4>
              <p className="text-sm whitespace-pre-wrap text-muted-foreground bg-secondary/20 p-3 rounded-md">{analysisResult.savingsOptimizationPlan}</p>
            </div>

            {analysisResult.investmentIdeas && analysisResult.investmentIdeas.length > 0 && (
              <div>
                <h4 className="text-lg font-medium mb-2 text-foreground/90">General Investment Ideas:</h4>
                 <Accordion type="single" collapsible className="w-full">
                    {analysisResult.investmentIdeas.map((idea, index) => (
                        <AccordionItem value={`investment-${index}`} key={index} className="bg-secondary/20 rounded-md mb-2">
                        <AccordionTrigger className="px-4 py-3 hover:no-underline">
                            <div className="flex items-center space-x-2">
                               <BarChartBig className="h-5 w-5 text-primary/80" />
                               <span className="font-medium text-base">{idea.type} {idea.riskLevel && `(${idea.riskLevel} Risk)`}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pt-0 pb-3 space-y-1 text-sm">
                            <p>{idea.description}</p>
                        </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
              </div>
            )}
            
            <Alert variant="default" className="mt-6 bg-primary/5 border-primary/20">
              <ShieldAlert className="h-5 w-5 text-primary" />
              <AlertTitle className="text-primary">Important Disclaimer</AlertTitle>
              <AlertDescription className="text-muted-foreground">
                {analysisResult.disclaimer}
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

