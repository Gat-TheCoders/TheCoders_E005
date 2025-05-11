
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TrendingUp, Loader2, Info, CreditCard, CheckSquare, ShieldAlert, ListTree, Landmark, History, Percent, CalendarClock, Layers3, FilePlus2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { handleSimulateCreditScore } from '@/app/actions';
import type { CreditScoreSimulationInput, CreditScoreSimulationOutput } from '@/ai/flows/credit-score-simulation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  transactionPatterns: z.string().min(5, { message: "Transaction patterns: min 5 characters." }),
  bankName: z.string().optional().or(z.literal('')),
  paymentHistory: z.string().min(10, { message: "Payment history: min 10 characters." }),
  creditUtilization: z.coerce
    .number({ invalid_type_error: "Credit utilization must be a number." })
    .min(0, { message: "Credit utilization must be 0 or greater." })
    .max(100, { message: "Credit utilization cannot exceed 100." })
    .optional(),
  lengthOfCreditHistory: z.string().min(3, { message: "Length of credit history: min 3 characters." }).optional().or(z.literal('')),
  creditMix: z.string().min(5, { message: "Credit mix: min 5 characters." }),
  newCredit: z.string().min(5, { message: "New credit activity: min 5 characters." }),
});

const exampleBankNames = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank", "Punjab National Bank", "Bank of Baroda", "Other"];

export function CreditScoreSimulator() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [simulationResult, setSimulationResult] = useState<CreditScoreSimulationOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({ // Use inferred type for stricter RHF typing
    resolver: zodResolver(formSchema),
    defaultValues: {
      transactionPatterns: '',
      bankName: '',
      paymentHistory: '',
      creditUtilization: undefined, 
      lengthOfCreditHistory: '',
      creditMix: '',
      newCredit: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSimulationResult(null);

    const processedValues: CreditScoreSimulationInput = {
        ...values,
        // mobileUsagePatterns is removed
        creditUtilization: values.creditUtilization === undefined ? undefined : Number(values.creditUtilization),
        bankName: values.bankName === '' ? undefined : values.bankName,
        lengthOfCreditHistory: values.lengthOfCreditHistory === '' ? undefined : values.lengthOfCreditHistory,
    };

    const result = await handleSimulateCreditScore(processedValues);
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
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Landmark className="mr-2 h-4 w-4 text-muted-foreground" />Primary Bank Name <span className="text-xs text-muted-foreground ml-1">(Optional)</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your primary bank" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {exampleBankNames.map(bank => (
                        <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><History className="mr-2 h-4 w-4 text-muted-foreground" />Payment History</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., All payments made on time for the last 3 years. One credit card payment was 5 days late 1 year ago."
                      className="resize-y min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="creditUtilization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Percent className="mr-2 h-4 w-4 text-muted-foreground" />Credit Utilization (%) <span className="text-xs text-muted-foreground ml-1">(Optional)</span></FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 30 (for 30%)" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lengthOfCreditHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><CalendarClock className="mr-2 h-4 w-4 text-muted-foreground" />Length of Credit History <span className="text-xs text-muted-foreground ml-1">(Optional)</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 5 years" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="creditMix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Layers3 className="mr-2 h-4 w-4 text-muted-foreground" />Credit Mix</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 2 credit cards, 1 auto loan (active). No mortgages."
                      className="resize-y min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newCredit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><FilePlus2 className="mr-2 h-4 w-4 text-muted-foreground" />New Credit Activity</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Applied for one new credit card 3 months ago. No other recent inquiries."
                      className="resize-y min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

