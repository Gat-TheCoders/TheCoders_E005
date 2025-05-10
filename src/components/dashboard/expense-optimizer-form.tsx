
'use client';

import { useState } from 'react';
import { useForm, useFieldArray, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BarChartBig, Loader2, PlusCircle, Trash2, Info, Search, TrendingDown, ShieldAlert, Lightbulb, DollarSign } from 'lucide-react';

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

const expenseCategorySchema = z.object({
  categoryName: z.string().min(1, { message: "Category name cannot be empty." }),
  amountSpent: z.coerce.number().positive({ message: "Amount must be a positive number." }),
});

const formSchema = z.object({
  monthlyIncome: z.coerce.number().positive({ message: "Monthly income must be a positive number." }),
  expenseCategories: z.array(expenseCategorySchema).min(1, { message: "Please add at least one expense category." }),
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
      expenseCategories: [{ categoryName: '', amountSpent: undefined as unknown as number }],
      savingsGoals: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "expenseCategories"
  });

  const onSubmit: SubmitHandler<ExpenseOptimizerInput> = async (values) => {
    setIsLoading(true);
    setAnalysisResult(null);
    
    // Ensure amountSpent is a number
    const processedValues = {
        ...values,
        expenseCategories: values.expenseCategories.map(cat => ({
            ...cat,
            amountSpent: Number(cat.amountSpent) || 0
        }))
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
        <CardDescription>Input your income, expenses, and goals to receive AI-driven advice on how to save and invest smarter.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="monthlyIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />Monthly Income ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 5000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel className="text-base font-medium">Expense Categories</FormLabel>
              <p className="text-sm text-muted-foreground mb-2">List your primary monthly expenses.</p>
              {fields.map((item, index) => (
                <div key={item.id} className="flex items-end gap-2 mb-3 p-3 border rounded-md bg-secondary/10">
                  <FormField
                    control={form.control}
                    name={`expenseCategories.${index}.categoryName`}
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormLabel className="text-xs">Category Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Groceries" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`expenseCategories.${index}.amountSpent`}
                    render={({ field }) => (
                      <FormItem className="w-1/3">
                        <FormLabel className="text-xs">Amount ($)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 400" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ categoryName: '', amountSpent: undefined as unknown as number })}
                className="mt-1"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Expense Category
              </Button>
               <FormMessage>{form.formState.errors.expenseCategories?.root?.message}</FormMessage>
            </div>
            
            <FormField
              control={form.control}
              name="savingsGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Lightbulb className="mr-2 h-4 w-4 text-muted-foreground" />Savings & Investment Goals</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Save $10,000 for a house down payment in 2 years, invest 10% of income for retirement, build a $3000 emergency fund..."
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
                           <span className="font-medium text-base">Reduce {suggestion.categoryName} by ${suggestion.suggestedReductionAmount.toFixed(2)}/month</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pt-0 pb-3 space-y-1 text-sm">
                        <p><strong className="font-medium text-foreground/80">Potential Monthly Savings:</strong> ${suggestion.potentialMonthlySavings.toFixed(2)}</p>
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

    