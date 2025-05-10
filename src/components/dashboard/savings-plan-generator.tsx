
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PiggyBank, Loader2, Lightbulb } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { handleGenerateSavingsPlan } from '@/app/actions';
import type { GenerateSavingsPlanInput, GenerateSavingsPlanOutput } from '@/ai/flows/personalized-savings-plan';

const formSchema = z.object({
  income: z.coerce.number().positive({ message: "Income must be a positive number." }),
  expenses: z.coerce.number().nonnegative({ message: "Expenses must be a non-negative number." }),
  financialGoals: z.string().min(10, { message: "Please describe your financial goals (min 10 characters)." }),
}).refine(data => data.income > data.expenses, {
  message: "Income must be greater than expenses to generate a savings plan.",
  path: ["income"], // You can also use "expenses" or a general form error
});

export function SavingsPlanGenerator() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [savingsPlan, setSavingsPlan] = useState<GenerateSavingsPlanOutput | null>(null);

  const form = useForm<GenerateSavingsPlanInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      income: '' as unknown as number, // Initialize with empty string for controlled input
      expenses: '' as unknown as number, // Initialize with empty string for controlled input
      financialGoals: '',
    },
  });

  async function onSubmit(values: GenerateSavingsPlanInput) {
    setIsLoading(true);
    setSavingsPlan(null);
    const result = await handleGenerateSavingsPlan(values);
    setIsLoading(false);

    if ('error' in result) {
      toast({
        variant: 'destructive',
        title: 'Error Generating Savings Plan',
        description: result.error,
      });
    } else {
      setSavingsPlan(result);
      toast({
        title: 'Savings Plan Generated',
        description: 'Your personalized savings plan is ready.',
      });
    }
  }

  return (
    <Card className="shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 group h-full">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-[-5deg]">
            <PiggyBank className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Personalized Savings Plan</CardTitle>
        </div>
        <CardDescription>Get an AI-powered savings strategy based on your income, expenses, and financial goals.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="income"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Income ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 5000" {...field} value={field.value === 0 ? "" : field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expenses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Expenses ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 3500" {...field} value={field.value === 0 ? "" : field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="financialGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Financial Goals</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Save for a down payment, build an emergency fund, invest for retirement..."
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
              Generate Plan
            </Button>
          </CardFooter>
        </form>
      </Form>
      {savingsPlan && (
        <CardContent className="mt-6 border-t pt-6">
           <div className="flex items-center space-x-2 mb-2 group">
             <div className="transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-6">
                <Lightbulb className="h-5 w-5 text-accent" />
             </div>
            <h3 className="text-lg font-semibold text-primary">Your Personalized Savings Plan</h3>
          </div>
          <div className="p-4 bg-secondary/30 rounded-md prose prose-sm max-w-none dark:prose-invert">
            {savingsPlan.savingsPlan
              .split('\n')
              .map(line => line.trim())
              .filter(line => line.length > 0)
              .map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

