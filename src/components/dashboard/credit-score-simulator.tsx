'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TrendingUp, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { handleSimulateCreditScore } from '@/app/actions';
import type { CreditScoreSimulationInput, CreditScoreSimulationOutput } from '@/ai/flows/credit-score-simulation';

const formSchema = z.object({
  transactionPatterns: z.string().min(50, { message: "Please provide a detailed description of transaction patterns (min 50 characters)." }),
  mobileUsagePatterns: z.string().min(50, { message: "Please provide a detailed description of mobile usage patterns (min 50 characters)." }),
});

export function CreditScoreSimulator() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [simulationResult, setSimulationResult] = useState<CreditScoreSimulationOutput | null>(null);

  const form = useForm<CreditScoreSimulationInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transactionPatterns: '',
      mobileUsagePatterns: '',
    },
  });

  async function onSubmit(values: CreditScoreSimulationInput) {
    setIsLoading(true);
    setSimulationResult(null);
    const result = await handleSimulateCreditScore(values);
    setIsLoading(false);

    if ('error' in result) {
      toast({
        variant: 'destructive',
        title: 'Error Simulating Credit Score',
        description: result.error,
      });
    } else {
      setSimulationResult(result);
      toast({
        title: 'Credit Score Simulated',
        description: 'Your simulated credit score has been generated.',
      });
    }
  }

  return (
    <Card className="shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 group h-full">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-[-5deg]">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Credit Score Simulator</CardTitle>
        </div>
        <CardDescription>Understand factors affecting your creditworthiness based on transaction and mobile usage patterns.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="transactionPatterns"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Patterns</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Frequent small online purchases, monthly utility bill payments, occasional large transfers..."
                      className="resize-y min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobileUsagePatterns"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Usage Patterns</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., High data consumption on streaming apps, regular use of banking apps, low call frequency..."
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
              Simulate Score
            </Button>
          </CardFooter>
        </form>
      </Form>
      {simulationResult && (
        <CardContent className="mt-6 border-t pt-6">
          <h3 className="text-lg font-semibold mb-2 text-primary">Simulation Result</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Simulated Credit Score</p>
              <p className="text-4xl font-bold text-accent">{simulationResult.simulatedCreditScore}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Factors Influencing Score</p>
              <p className="text-sm whitespace-pre-wrap">{simulationResult.factorsInfluencingScore}</p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
