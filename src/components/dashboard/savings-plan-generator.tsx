
'use client';

import { useState } from 'react';
import { useForm, useFieldArray, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PiggyBank, Loader2, Lightbulb, PlusCircle, Trash2, DollarSign, Info, Target, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { handleGenerateSavingsPlan } from '@/app/actions';
import { type GenerateSavingsPlanInput, type GenerateSavingsPlanOutput } from '@/ai/flows/personalized-savings-plan';
import { GenerateSavingsPlanInputSchema } from '@/ai/schemas/personalized-savings-plan-schemas';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '../ui/separator';


export function SavingsPlanGenerator() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [savingsPlanResult, setSavingsPlanResult] = useState<GenerateSavingsPlanOutput | null>(null);

  const form = useForm<GenerateSavingsPlanInput>({
    resolver: zodResolver(GenerateSavingsPlanInputSchema),
    defaultValues: {
      monthlyIncome: '' as unknown as number,
      monthlyExpenses: '' as unknown as number,
      customGoals: [{ name: '', targetAmount: '' as unknown as number, currentAmount: '' as unknown as number }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "customGoals",
  });

  const onSubmit: SubmitHandler<GenerateSavingsPlanInput> = async (values) => {
    setIsLoading(true);
    setSavingsPlanResult(null);
    
    const processedValues = {
        ...values,
        customGoals: values.customGoals.map(goal => ({
            ...goal,
            targetAmount: Number(goal.targetAmount),
            currentAmount: Number(goal.currentAmount),
        }))
    };

    const result = await handleGenerateSavingsPlan(processedValues);
    setIsLoading(false);

    if ('error' in result) {
      toast({
        variant: 'destructive',
        title: 'Error Generating Savings Plan',
        description: result.error,
      });
    } else {
      setSavingsPlanResult(result);
      toast({
        title: 'Savings Plan Generated',
        description: 'Your personalized savings plan and goal analysis are ready.',
      });
    }
  };

  return (
    <Card className="shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 group w-full">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-[-5deg]">
            <PiggyBank className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>My Goals & Savings Plan</CardTitle>
        </div>
        <CardDescription>Define your financial goals, input your income and expenses, and get an AI-powered savings strategy to help you achieve them.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="monthlyIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />Monthly Income (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 50000" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="monthlyExpenses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />Monthly Expenses (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 35000" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <FormLabel className="text-lg font-semibold flex items-center mb-3"><Target className="mr-2 h-5 w-5 text-muted-foreground"/>Financial Goals</FormLabel>
              {fields.map((item, index) => (
                <Card key={item.id} className="mb-4 p-4 space-y-3 bg-secondary/20 border border-border/50">
                  <FormField
                    control={form.control}
                    name={`customGoals.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Goal Name</FormLabel>
                        <FormControl><Input placeholder="e.g., Emergency Fund, Buy a Car" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name={`customGoals.${index}.targetAmount`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Amount (₹)</FormLabel>
                          <FormControl><Input type="number" placeholder="e.g., 100000" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))} value={field.value ?? ""} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`customGoals.${index}.currentAmount`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Amount Saved (₹)</FormLabel>
                          <FormControl><Input type="number" placeholder="e.g., 10000" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))} value={field.value ?? ""} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)} disabled={fields.length <= 1}>
                    <Trash2 className="mr-1 h-4 w-4" /> Remove Goal
                  </Button>
                </Card>
              ))}
              <Button type="button" variant="outline" onClick={() => append({ name: '', targetAmount: '' as unknown as number, currentAmount: '' as unknown as number })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Another Goal
              </Button>
               {form.formState.errors.customGoals && !form.formState.errors.customGoals.message && (
                 <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.customGoals.root?.message}</p>
               )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full animated-bg-gradient">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
              Generate My Plan & Analyze Goals
            </Button>
          </CardFooter>
        </form>
      </Form>

      {savingsPlanResult && (
        <CardContent className="mt-6 border-t pt-6 space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-3">
                <Info className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold text-primary">Overall Savings Summary</h3>
            </div>
            <div className="p-4 bg-secondary/20 rounded-md prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
              {savingsPlanResult.overallSavingsSummary}
            </div>
          </div>

          <Separator className="my-6"/>

          <div>
            <div className="flex items-center space-x-2 mb-4">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold text-primary">Detailed Goal Plans</h3>
            </div>
            <div className="space-y-6">
            {savingsPlanResult.detailedGoalPlans.map((goal, index) => (
              <Card key={index} className="p-4 shadow-md bg-card">
                <CardHeader className="p-0 pb-3">
                  <CardTitle className="text-lg text-accent">{goal.goalName}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Progress:</span>
                    <span className="font-semibold">{goal.currentAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })} / {goal.targetAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })}</span>
                  </div>
                  <Progress value={goal.completionPercentage} aria-label={`${goal.completionPercentage}% completed`} className="h-3" />
                  <p className="text-xs text-right text-muted-foreground">{goal.completionPercentage.toFixed(1)}% Complete</p>
                  
                  <p><strong className="text-foreground/80">Remaining Amount:</strong> {goal.remainingAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                  
                  <div>
                    <strong className="text-foreground/80 block mb-1">Savings Strategy:</strong>
                    <div className="p-3 bg-secondary/20 rounded-md prose prose-xs max-w-none dark:prose-invert whitespace-pre-wrap">
                        {goal.savingsStrategyForGoal}
                    </div>
                  </div>

                  {goal.projectedTimeline && (
                    <p><strong className="text-foreground/80">Projected Timeline:</strong> {goal.projectedTimeline}</p>
                  )}
                </CardContent>
              </Card>
            ))}
            </div>
          </div>
          
          <Alert variant="default" className="mt-8 bg-primary/5 border-primary/20">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <AlertTitle className="text-primary">Important Disclaimer</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              {savingsPlanResult.disclaimer}
            </AlertDescription>
          </Alert>
        </CardContent>
      )}
    </Card>
  );
}

