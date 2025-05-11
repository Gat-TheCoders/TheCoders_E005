
'use client';

import { useState } from 'react';
import { useForm, useFieldArray, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PiggyBank, DollarSign, Target as TargetIcon, CalendarDays, PlusCircle, Trash2, Loader2, Info, Lightbulb, BarChart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { handleGenerateSavingsPlan } from '@/app/actions'; // Will be created in actions.ts
import { PersonalizedSavingsPlanInputSchema, type PersonalizedSavingsPlanInput, type PersonalizedSavingsPlanOutput, type GoalInput } from '@/ai/schemas/personalized-savings-plan-schemas';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
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
      customGoals: [{ goalName: '', targetAmount: undefined, targetDate: '', currentAmount: undefined }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'customGoals',
  });

  const onSubmit: SubmitHandler<PersonalizedSavingsPlanInput> = async (values) => {
    setIsLoading(true);
    setPlanResult(null);
    
    const processedValues: PersonalizedSavingsPlanInput = {
      ...values,
      // monthlyIncome and monthlyExpenses are already numbers due to z.coerce.number and RHF handling
      // but ensuring they are numbers before sending if needed.
      monthlyIncome: Number(values.monthlyIncome),
      monthlyExpenses: Number(values.monthlyExpenses),
      customGoals: values.customGoals.map(goal => ({
        ...goal,
        targetAmount: Number(goal.targetAmount),
        currentAmount: goal.currentAmount === undefined || goal.currentAmount === null ? 0 : Number(goal.currentAmount),
        targetDate: goal.targetDate || undefined, 
      })),
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
      setPlanResult(result);
      toast({
        title: 'Savings Plan Generated!',
        description: 'Your personalized savings plan is ready.',
      });
    }
  };

  return (
    <Card className="shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 group w-full">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-[-3deg]">
            <PiggyBank className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Personalized Savings Plan Generator</CardTitle>
        </div>
        <CardDescription>Tell us about your finances and goals, and our AI will help you craft a savings strategy. All amounts in INR.</CardDescription>
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
                    <FormControl><Input type="number" placeholder="e.g., 50000" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} /></FormControl>
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
                    <FormControl><Input type="number" placeholder="e.g., 30000" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-3 text-primary">Your Financial Goals</h3>
              {fields.map((field, index) => (
                <Card key={field.id} className="mb-4 p-4 bg-secondary/20 border-border/50">
                  <CardHeader className="p-0 pb-3 mb-3 border-b">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-md text-primary/90">Goal #{index + 1}</CardTitle>
                      {fields.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive hover:text-destructive/80 h-7 w-7">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 p-0">
                    <FormField
                      control={form.control}
                      name={`customGoals.${index}.goalName`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel className="text-sm flex items-center"><TargetIcon className="mr-2 h-4 w-4 text-muted-foreground" />Goal Name</FormLabel>
                          <FormControl><Input placeholder="e.g., Emergency Fund, New Laptop" {...f} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                       <FormField
                        control={form.control}
                        name={`customGoals.${index}.targetAmount`}
                        render={({ field: f }) => (
                            <FormItem>
                            <FormLabel className="text-sm flex items-center"><DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />Target Amount (₹)</FormLabel>
                            <FormControl><Input type="number" placeholder="e.g., 50000" {...f} value={f.value ?? ''} onChange={e => f.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name={`customGoals.${index}.currentAmount`}
                        render={({ field: f }) => (
                            <FormItem>
                            <FormLabel className="text-sm flex items-center"><PiggyBank className="mr-2 h-4 w-4 text-muted-foreground" />Currently Saved (₹) <span className="text-xs ml-1">(Optional)</span></FormLabel>
                            <FormControl><Input type="number" placeholder="e.g., 10000" {...f} value={f.value ?? ''} onChange={e => f.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <FormField
                      control={form.control}
                      name={`customGoals.${index}.targetDate`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel className="text-sm flex items-center"><CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />Target Date/Timeline <span className="text-xs ml-1">(Optional)</span></FormLabel>
                          <FormControl><Input placeholder="e.g., In 6 months, By Dec 2025" {...f} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ goalName: '', targetAmount: undefined, targetDate: '', currentAmount: undefined })}
                className="mt-2"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Another Goal
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full animated-bg-gradient">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PiggyBank className="mr-2 h-4 w-4" />}
              Generate Savings Plan
            </Button>
          </CardFooter>
        </form>
      </Form>

      {planResult && (
        <CardContent className="mt-6 border-t pt-6 space-y-6">
          <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
            <Lightbulb className="h-6 w-6 mr-2 text-accent" />
            Your Personalized Savings Plan
          </h3>

          <Alert variant="default" className="bg-primary/5 border-primary/20">
            <Info className="h-5 w-5 text-primary" />
            <AlertTitle className="text-primary">Overall Savings Summary</AlertTitle>
            <AlertDescription className="text-muted-foreground whitespace-pre-wrap">{planResult.overallSavingsSummary}</AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h4 className="text-lg font-medium text-foreground/90">Detailed Goal Plans:</h4>
            {planResult.detailedGoalPlans.length > 0 ? (
                <Accordion type="multiple" className="w-full space-y-3">
                    {planResult.detailedGoalPlans.map((goalPlan, index) => (
                    <AccordionItem value={`goal-${index}`} key={index} className="bg-secondary/20 rounded-md border-border/50">
                        <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full">
                            <span className="font-medium text-base text-primary/90 flex items-center">
                                <TargetIcon className="h-5 w-5 mr-2 text-accent" />
                                {goalPlan.goalName}
                            </span>
                            <span className="text-xs text-muted-foreground mt-1 sm:mt-0">
                                {goalPlan.completionPercentage.toFixed(1)}% Complete
                            </span>
                        </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pt-0 pb-3 space-y-3 text-sm">
                            <Progress value={goalPlan.completionPercentage} className="w-full h-2 my-2" />
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                <p><strong className="font-medium text-foreground/80">Target:</strong> ₹{goalPlan.targetAmount.toLocaleString('en-IN')}</p>
                                <p><strong className="font-medium text-foreground/80">Saved:</strong> ₹{goalPlan.currentAmount.toLocaleString('en-IN')}</p>
                                <p><strong className="font-medium text-foreground/80">Remaining:</strong> ₹{goalPlan.remainingAmount.toLocaleString('en-IN')}</p>
                                {goalPlan.estimatedTimeToAchieve && <p><strong className="font-medium text-foreground/80">Est. Time:</strong> {goalPlan.estimatedTimeToAchieve}</p>}
                            </div>
                             <p className="text-xs italic text-muted-foreground mt-1">Strategy:</p>
                            <p className="whitespace-pre-wrap text-muted-foreground">{goalPlan.savingsStrategyForGoal}</p>
                        </AccordionContent>
                    </AccordionItem>
                    ))}
                </Accordion>
            ) : (
                <p className="text-sm text-muted-foreground">No specific goal plans were generated. This might happen if your expenses exceed your income.</p>
            )}
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-1 text-foreground/90 flex items-center">
                <BarChart className="h-5 w-5 mr-2 text-primary/80" /> General Advice:
            </h4>
            <ul className="list-none space-y-1 text-sm text-muted-foreground bg-secondary/20 p-3 rounded-md">
                {planResult.generalAdvice.split('\n').map((advice, index) => {
                     const trimmedAdvice = advice.trim().replace(/^- /, '');
                     return trimmedAdvice && (
                        <li key={index} className="flex items-start">
                            <Lightbulb className="h-4 w-4 mr-2 mt-0.5 shrink-0 text-accent" />
                            <span>{trimmedAdvice}</span>
                        </li>
                    );
                })}
            </ul>
          </div>
          
          <Alert variant="default" className="mt-6 bg-primary/5 border-primary/20">
            <Info className="h-5 w-5 text-primary" />
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

