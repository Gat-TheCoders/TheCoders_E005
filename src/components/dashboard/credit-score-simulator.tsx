'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TrendingUp, Loader2, Info, CreditCard, CheckSquare, ShieldAlert, ListTree } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { handleSimulateCreditScore } from '@/app/actions';
import type { CreditScoreSimulationInput, CreditScoreSimulationOutput } from '@/ai/flows/credit-score-simulation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  transactionPatterns: z.string().min(5, { message: "Please provide a detailed description of transaction patterns (min 5 characters)." }),
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
        description: 'Your simulated credit score and related insights have been generated.',
      });
    }
  }

  return (
    <Card className="shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 group w-full bg-card">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-[-5deg]">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Credit Score Simulator</CardTitle>
        </div>
        <CardDescription>Understand factors affecting your creditworthiness, learn about credit benefits, and see illustrative card suggestions based on a simulated score.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="transactionPatterns"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />Transaction Patterns</FormLabel>
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
                  <FormLabel className="flex items-center"><ListTree className="mr-2 h-4 w-4 text-muted-foreground" />Mobile Usage Patterns</FormLabel>
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
              Simulate Score & Get Insights
            </Button>
          </CardFooter>
        </form>
      </Form>
      {simulationResult && (
        <CardContent className="mt-6 border-t pt-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-primary flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" /> Simulation Result
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div>
                    <p className="text-sm text-muted-foreground">Simulated Credit Score</p>
                    <p className="text-5xl font-bold text-accent">{simulationResult.simulatedCreditScore}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Factors Influencing Score</p>
                    <p className="text-sm whitespace-pre-wrap bg-secondary/20 p-3 rounded-md">{simulationResult.factorsInfluencingScore}</p>
                </div>
            </div>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-1 text-foreground/90 flex items-center">
                <CheckSquare className="h-5 w-5 mr-2 text-primary/80" />
                Benefits of a Good Credit Score:
            </h4>
            <ul className="list-none space-y-1 text-sm text-muted-foreground bg-secondary/20 p-3 rounded-md">
              {simulationResult.benefitsOfGoodCreditScore.split('\n').map((benefit, index) => benefit.trim() && (
                <li key={index} className="flex items-start">
                  <CheckSquare className="h-4 w-4 mr-2 mt-0.5 shrink-0 text-accent" />
                  <span>{benefit.replace(/^- /, '')}</span>
                </li>
              ))}
            </ul>
          </div>

          {simulationResult.eligibleCards && simulationResult.eligibleCards.length > 0 && (
            <div>
              <h4 className="text-md font-semibold mb-2 text-foreground/90 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-primary/80" />
                Illustrative Card Suggestions (Based on Simulated Score):
              </h4>
              <Accordion type="single" collapsible className="w-full">
                {simulationResult.eligibleCards.map((card, index) => (
                  <AccordionItem value={`card-${index}`} key={index} className="bg-secondary/20 rounded-md mb-2">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      <div className="flex items-center space-x-2">
                         <CreditCard className="h-5 w-5 text-primary/70" />
                         <span className="font-medium text-base">{card.cardName} ({card.cardType})</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pt-0 pb-3 space-y-2 text-sm">
                      <p><strong className="font-medium text-foreground/80">Issuer:</strong> {card.issuer}</p>
                      <p><strong className="font-medium text-foreground/80">Key Features:</strong></p>
                      <ul className="list-disc list-inside ml-4">
                        {card.keyFeatures.map((feature, fIndex) => <li key={fIndex}>{feature}</li>)}
                      </ul>
                      <p><strong className="font-medium text-foreground/80">Typical Credit Score Range:</strong> {card.typicalCreditScoreRange}</p>
                      {card.notes && <p><strong className="font-medium text-foreground/80">Notes:</strong> {card.notes}</p>}
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
              {simulationResult.disclaimer}
            </AlertDescription>
          </Alert>

        </CardContent>
      )}
    </Card>
  );
}