
'use client';

import { useState } from 'react';
import { useForm, useFieldArray, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PiggyBank, DollarSign, ShoppingCart, Target, PlusCircle, Trash2, Loader2, Lightbulb, ShieldAlert, Info, BarChartBig } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { handleGenerateSavingsPlan } from '@/app/actions';
import { PersonalizedSavingsPlanInputSchema, type PersonalizedSavingsPlanInput, type PersonalizedSavingsPlanOutput } from '@/ai/schemas/personalized-savings-plan-schemas';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '../ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


export function PersonalizedSavingsPlanForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [planResult, setPlanResult] = useState<PersonalizedSavingsPlanOutput | null>(null);

  const form = useForm<PersonalizedSavingsPlanInput>({
    resolver: zodResolver(PersonalizedSavingsPlanInputSchema),
    defaultValues: {
      monthlyIncome: undefined,
      monthlyExpenses: undefined,
      customGoals: [{ goalName: '', targetAmount: undefined, currentAmount: 0, targetDate: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "customGoals",
  });

  const onSubmit: SubmitHandler<PersonalizedSavingsPlanInput> = async (values) => {
    setIsLoading(true);
    setPlanResult(null);
    
    const processedValues = {
      ...values,
      monthlyIncome: Number(values.monthlyIncome),
      monthlyExpenses: Number(values.monthlyExpenses),
      customGoals: values.customGoals.map(goal => ({
        ...goal,
        targetAmount: Number(goal.targetAmount),
        currentAmount: goal.currentAmount === undefined ? 0 : Number(goal.currentAmount),
        targetDate: goal.targetDate === '' ? undefined : goal.targetDate,
      })),
    };

    const result = await handleGenerateSavingsPlan(processedValues);
    setIsLoading(false);

    if ('error' in result) {
      toast({
        variant: 'destructive',
        title: 'Error Generating Plan',
        description: result.error,
      });
    } else {
      setPlanResult(result);
      toast({
        title: 'Savings Plan Generated',
        description: 'Your AI-powered personalized savings plan is ready.',
      });
    }
  };

  const renderFormattedTextAsList = (text: string | undefined) => {
    if (!text) return null;
    return (
      <ul className="list-disc list-inside space-y-1">
        {text.split('\n').map((item, index) => {
          const trimmedItem = item.trim().replace(/^- /, '');
          return trimmedItem && <li key={index}>{trimmedItem}</li>;
        })}
      </ul>
    );
  };


  return (
    <Card className="shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 group w-full">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-[-3deg]">
            <PiggyBank className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>AI Savings Plan Generator</CardTitle>
        </div>
        <CardDescription>Enter your financial details and goals to get a personalized savings strategy from our AI.</CardDescription>
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
                    <FormControl><Input type="number" placeholder="e.g., 60000" {...field} value={field.value ?? ""} onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="monthlyExpenses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><ShoppingCart className="mr-2 h-4 w-4 text-muted-foreground" />Monthly Expenses (₹)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 35000" {...field} value={field.value ?? ""} onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <h4 className="text-lg font-medium mb-2 text-foreground/90 flex items-center"><Target className="mr-2 h-5 w-5 text-primary" />Your Financial Goals</h4>
              {fields.map((item, index) => (
                <Card key={item.id} className="mb-4 p-4 bg-secondary/20 border-border/50">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="font-semibold text-primary">Goal #{index + 1}</h5>
                    {fields.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive hover:bg-destructive/10 h-7 w-7">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name={`customGoals.${index}.goalName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Goal Name</FormLabel>
                          <FormControl><Input placeholder="e.g., Buy a new car" {...field} /></FormControl>
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
                            <FormControl><Input type="number" placeholder="e.g., 500000" {...field} value={field.value ?? ""} onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}/></FormControl>
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
                            <FormControl><Input type="number" placeholder="e.g., 50000" {...field} value={field.value ?? ""} onChange={e => field.onChange(e.target.value === '' ? 0 : parseFloat(e.target.value))} /></FormControl>
                             <FormDescription className="text-xs">Optional, defaults to 0.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name={`customGoals.${index}.targetDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Date <span className="text-xs text-muted-foreground">(Optional)</span></FormLabel>
                          <FormControl><Input placeholder="e.g., In 2 years, By Dec 2026" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ goalName: '', targetAmount: undefined, currentAmount: 0, targetDate: '' })}
                className="mt-2"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Goal
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full animated-bg-gradient">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
              Generate My Savings Plan
            </Button>
          </CardFooter>
        </form>
      </Form>

      {planResult && (
        <CardContent className="mt-6 border-t pt-6 space-y-6">
          <h3 className="text-2xl font-semibold text-primary mb-4 flex items-center">
            <BarChartBig className="h-7 w-7 mr-2 text-accent" />
            Your Personalized Savings Plan
          </h3>

          <div className="p-4 border rounded-lg bg-primary/5">
            <h4 className="text-lg font-medium text-primary mb-1">Overall Assessment</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{planResult.overallAssessment}</p>
          </div>
          
          <div className="p-4 border rounded-lg bg-primary/5">
            <h4 className="text-lg font-medium text-primary mb-1">General Savings Advice</h4>
            <div className="text-sm text-muted-foreground space-y-1">
                {renderFormattedTextAsList(planResult.generalSavingsAdvice)}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-primary mb-3">Detailed Goal Plans</h4>
            <Accordion type="multiple" className="w-full space-y-3">
              {planResult.detailedGoalPlans.map((goalPlan, index) => (
                <AccordionItem value={`goal-${index}`} key={index} className="border bg-card rounded-md shadow-sm">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full">
                        <span className="font-semibold text-base text-primary text-left">{goalPlan.goalName}</span>
                        <span className="text-xs text-accent sm:ml-2 whitespace-nowrap mt-1 sm:mt-0">
                            {goalPlan.completionPercentage.toFixed(1)}% Complete
                        </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-0 pb-3 space-y-3 text-sm">
                    <Progress value={goalPlan.completionPercentage} className="h-2 mt-1 mb-3" />
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <p><strong className="font-medium text-foreground/80">Target:</strong> ₹{goalPlan.targetAmount.toLocaleString('en-IN')}</p>
                        <p><strong className="font-medium text-foreground/80">Saved:</strong> ₹{goalPlan.currentAmount.toLocaleString('en-IN')}</p>
                        <p><strong className="font-medium text-foreground/80">Remaining:</strong> ₹{goalPlan.remainingAmount.toLocaleString('en-IN')}</p>
                        {goalPlan.estimatedTimeToGoal && <p><strong className="font-medium text-foreground/80">Est. Time:</strong> {goalPlan.estimatedTimeToGoal}</p>}
                    </div>
                    <div>
                        <h5 className="font-medium text-foreground/90 mt-2 mb-1">Strategy:</h5>
                        <div className="text-muted-foreground space-y-1 text-xs">
                            {renderFormattedTextAsList(goalPlan.savingsStrategyForGoal)}
                        </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          
          <Alert variant="default" className="mt-8 bg-primary/5 border-primary/20">
            <ShieldAlert className="h-5 w-5 text-primary" />
            <AlertTitle className="text-primary">Important Disclaimer</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              {planResult.disclaimer}
            </AlertDescription>
          </Alert>
        </CardContent>
      )}
    </Card>
  );
}
