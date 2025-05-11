
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DollarSign, Lightbulb, Loader2, Briefcase, TrendingUp, ShieldAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { handleSuggestInvestment } from '@/app/actions';
import type { SuggestedInvestmentInput, SuggestedInvestmentOutput } from '@/ai/flows/suggested-investment-flow';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from "@/lib/utils";

const formSchema = z.object({
  monthlyIncome: z.coerce
    .number({ required_error: 'Monthly income is required.' })
    .positive({ message: 'Monthly income must be a positive number.' }),
  investmentCapacity: z.coerce
    .number({ invalid_type_error: 'Investment capacity must be a number.' })
    .positive({ message: 'Investment capacity must be a positive number.' })
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function SuggestedInvestmentCard() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestionsResult, setSuggestionsResult] = useState<SuggestedInvestmentOutput | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monthlyIncome: undefined,
      investmentCapacity: undefined,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setIsLoading(true);
    setSuggestionsResult(null);
    
    const processedValues: SuggestedInvestmentInput = {
      monthlyIncome: Number(values.monthlyIncome),
      investmentCapacity: values.investmentCapacity === undefined ? undefined : Number(values.investmentCapacity),
    };

    const result = await handleSuggestInvestment(processedValues);
    setIsLoading(false);

    if ('error' in result) {
      toast({
        variant: 'destructive',
        title: 'Error Getting Suggestions',
        description: result.error,
      });
    } else {
      setSuggestionsResult(result);
      toast({
        title: 'Investment Suggestions Ready',
        description: 'AI-powered investment ideas based on your income and capacity.',
      });
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'low': return 'text-green-600 dark:text-green-500';
      case 'medium': return 'text-yellow-600 dark:text-yellow-500';
      case 'high': return 'text-red-600 dark:text-red-500';
      case 'varies': return 'text-blue-600 dark:text-blue-500';
      default: return 'text-muted-foreground';
    }
  };


  return (
    <Card className="shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 group w-full">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-[-3deg]">
            <Lightbulb className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>AI Investment Suggester</CardTitle>
        </div>
        <CardDescription>Enter your monthly income and optional investment capacity (INR) to get general investment ideas. This is not financial advice.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="monthlyIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />Monthly Income (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 50000" {...field} value={field.value ?? ""} onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="investmentCapacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />Monthly Investment Capacity (₹) <span className="text-xs text-muted-foreground ml-1">(Optional)</span></FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 10000" {...field} value={field.value ?? ""} onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full animated-bg-gradient">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
              Get Investment Ideas
            </Button>
          </CardFooter>
        </form>
      </Form>

      {suggestionsResult && (
        <CardContent className="mt-6 border-t pt-6 space-y-6">
          <h3 className="text-xl font-semibold text-primary mb-4">Investment Ideas for You:</h3>
          
          {suggestionsResult.suggestions.length > 0 && (
            <Accordion type="single" collapsible className="w-full">
              {suggestionsResult.suggestions.map((suggestion, index) => (
                <AccordionItem value={`suggestion-${index}`} key={index} className="bg-secondary/20 rounded-md mb-3">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-3">
                            <TrendingUp className="h-5 w-5 text-primary/80" />
                            <span className="font-medium text-base text-left">{suggestion.investmentName}</span>
                        </div>
                        <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", getRiskColor(suggestion.riskLevel), 
                            suggestion.riskLevel.toLowerCase() === 'low' && 'bg-green-100 dark:bg-green-900/30',
                            suggestion.riskLevel.toLowerCase() === 'medium' && 'bg-yellow-100 dark:bg-yellow-900/30',
                            suggestion.riskLevel.toLowerCase() === 'high' && 'bg-red-100 dark:bg-red-900/30',
                            suggestion.riskLevel.toLowerCase() === 'varies' && 'bg-blue-100 dark:bg-blue-900/30'
                        )}>
                            {suggestion.riskLevel} Risk
                        </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-0 pb-3 space-y-2 text-sm">
                    <p><strong className="font-medium text-foreground/80">Type:</strong> {suggestion.investmentType}</p>
                    {suggestion.exampleSymbol && <p><strong className="font-medium text-foreground/80">Example Symbol:</strong> {suggestion.exampleSymbol}</p>}
                    <p><strong className="font-medium text-foreground/80">Rationale:</strong> {suggestion.rationale}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
          
          <Alert variant="default" className="mt-6 bg-primary/5 border-primary/20">
            <ShieldAlert className="h-5 w-5 text-primary" />
            <AlertTitle className="text-primary">Important Disclaimer</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              {suggestionsResult.disclaimer}
            </AlertDescription>
          </Alert>
        </CardContent>
      )}
    </Card>
  );
}

