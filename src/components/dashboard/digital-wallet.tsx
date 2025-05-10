'use client';

import { useState, type EffectCallback, type DependencyList, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wallet, Loader2, MessageSquareHeart, ArrowRightCircle, HelpingHand, Users, Info, CircleDollarSign } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { handleSimulateCommunitySupport } from '@/app/actions';
import type { CommunitySupportAdvisorInput, CommunitySupportAdvisorOutput } from '@/ai/flows/community-support-advisor';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  currentSituation: z
    .string({ required_error: "Please describe your current situation."})
    .min(50, { message: "Please provide more details about your situation (min 50 characters)." }),
  monthlyIncome: z
    .number({ required_error: "Monthly income is required."})
    .nonnegative({ message: "Monthly income cannot be negative." }),
  householdSize: z
    .number({ required_error: "Household size is required."})
    .int()
    .positive({ message: "Household size must be a positive integer." }),
  reasonForSupport: z
    .enum(['Job Loss', 'Medical Emergency', 'Unexpected Essential Expense', 'Low Income', 'Natural Disaster Impact', 'Other'], { required_error: "Reason for seeking support is required."}),
});

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}


export function DigitalWallet() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [supportResult, setSupportResult] = useState<CommunitySupportAdvisorOutput | null>(null);
  const [animatedBalance, setAnimatedBalance] = useState(0);

  const form = useForm<CommunitySupportAdvisorInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentSituation: '',
      monthlyIncome: undefined,
      householdSize: undefined,
      reasonForSupport: undefined,
    },
  });

  const debouncedBalance = useDebounce(supportResult?.simulatedWalletCredit ?? 0, 100);

  useEffect(() => {
    if (supportResult) {
      let start = 0;
      const end = supportResult.simulatedWalletCredit;
      if (end === start) {
        setAnimatedBalance(end);
        return;
      }
      const duration = 1000; // 1 second
      const incrementTime = 20; // Update every 20ms
      const totalIncrements = duration / incrementTime;
      const incrementValue = (end - start) / totalIncrements;

      let currentIncrement = 0;
      const timer = setInterval(() => {
        currentIncrement++;
        start += incrementValue;
        if (currentIncrement >= totalIncrements) {
          setAnimatedBalance(end);
          clearInterval(timer);
        } else {
          setAnimatedBalance(parseFloat(start.toFixed(2)));
        }
      }, incrementTime);
      return () => clearInterval(timer);
    } else {
      setAnimatedBalance(0);
    }
  }, [debouncedBalance, supportResult]);


  const onSubmit: SubmitHandler<CommunitySupportAdvisorInput> = async (values) => {
    setIsLoading(true);
    setSupportResult(null);
    setAnimatedBalance(0); // Reset animated balance on new submission
    const result = await handleSimulateCommunitySupport(values);
    setIsLoading(false);

    if ('error' in result) {
      toast({
        variant: 'destructive',
        title: 'Error Simulating Support',
        description: result.error,
      });
    } else {
      setSupportResult(result);
      toast({
        title: 'Community Support Simulated',
        description: 'A simulated support allocation has been determined.',
      });
    }
  };

  return (
    <Card className="shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 group w-full">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-[-3deg]">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Simulated Digital Wallet & Support Advisor</CardTitle>
        </div>
        <CardDescription>This tool simulates a community support allocation to a virtual wallet based on your situation. This is for illustrative purposes only and does not involve real money.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="currentSituation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><MessageSquareHeart className="mr-2 h-4 w-4 text-muted-foreground" />Describe Your Current Situation</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Lost my job due to company downsizing and struggling to cover rent..."
                      className="resize-y min-h-[100px]"
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
                name="monthlyIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><CircleDollarSign className="mr-2 h-4 w-4 text-muted-foreground" />Monthly Income ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 1200" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="householdSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Users className="mr-2 h-4 w-4 text-muted-foreground" />Household Size</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 3" {...field} onChange={e => field.onChange(parseInt(e.target.value) || undefined)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="reasonForSupport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><HelpingHand className="mr-2 h-4 w-4 text-muted-foreground" />Reason for Seeking Support</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {['Job Loss', 'Medical Emergency', 'Unexpected Essential Expense', 'Low Income', 'Natural Disaster Impact', 'Other'].map(reason => (
                          <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Simulate Support Allocation
            </Button>
          </CardFooter>
        </form>
      </Form>
      
      {supportResult && (
        <CardContent className="mt-6 border-t pt-6 space-y-6">
          <Alert variant="default" className="bg-primary/10 border-primary/30">
             <div className="flex items-center space-x-2">
                <Wallet className="h-5 w-5 text-primary" />
                <AlertTitle className="text-primary text-lg">Simulated Wallet Update</AlertTitle>
              </div>
            <AlertDescription className="mt-2">
              <p className="text-2xl font-bold text-accent">
                Simulated Credit: ${animatedBalance.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">This amount has been hypothetically credited to your simulated digital wallet by the AI Community Support Advisor.</p>
            </AlertDescription>
          </Alert>

          <div>
            <h4 className="text-md font-semibold mb-1 text-foreground/90 flex items-center">
              <MessageSquareHeart className="mr-2 h-5 w-5 text-primary/80" />
              Advisor's Message:
            </h4>
            <p className="text-sm whitespace-pre-wrap text-muted-foreground bg-secondary/30 p-3 rounded-md">{supportResult.advisorMessage}</p>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-1 text-foreground/90 flex items-center">
              <ArrowRightCircle className="mr-2 h-5 w-5 text-primary/80" />
              Guidance for Seeking Real Support:
            </h4>
            <ul className="list-none space-y-1 text-sm text-muted-foreground bg-secondary/30 p-3 rounded-md">
              {supportResult.guidanceForRealSupport.split('\n').map((step, index) => {
                const trimmedStep = step.trim().replace(/^- /, '');
                return trimmedStep && (
                  <li key={index} className="flex items-start">
                    <ArrowRightCircle className="h-4 w-4 mr-2 mt-1 shrink-0 text-accent" />
                    <span>{trimmedStep}</span>
                  </li>
                );
              })}
            </ul>
          </div>

           <Alert variant="destructive" className="mt-6">
            <Info className="h-5 w-5" />
            <AlertTitle>Important Disclaimer</AlertTitle>
            <AlertDescription>
              The "digital wallet" and "credited amount" are part of a simulation for educational and illustrative purposes only. No real funds are involved, allocated, or accessible. This tool does not provide actual financial assistance. If you need real financial help, please consult the guidance provided above or contact relevant local authorities and support organizations.
            </AlertDescription>
          </Alert>
        </CardContent>
      )}
    </Card>
  );
}
