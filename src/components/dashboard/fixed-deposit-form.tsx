
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Database, DollarSign, CalendarClock, TrendingUp, Loader2, Info, Percent, Wallet } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const fixedDepositFormSchema = z.object({
  principalAmount: z.coerce
    .number({ required_error: "Principal amount is required." })
    .positive({ message: "Principal amount must be a positive number." })
    .min(1000, { message: "Minimum principal amount is ₹1,000."}),
  durationInMonths: z.coerce
    .number({ required_error: "Duration is required." })
    .int({ message: "Duration must be an integer."})
    .positive({ message: "Duration must be a positive number of months." })
    .min(1, { message: "Minimum duration is 1 month."})
    .max(120, { message: "Maximum duration is 120 months (10 years)."}),
  annualInterestRate: z.coerce
    .number({ required_error: "Annual interest rate is required."})
    .positive({ message: "Interest rate must be positive."})
    .min(1, { message: "Minimum interest rate is 1%."})
    .max(20, { message: "Maximum interest rate is 20%."}),
});

type FixedDepositFormValues = z.infer<typeof fixedDepositFormSchema>;

interface CalculationResult {
  principal: number;
  interestEarned: number;
  maturityAmount: number;
  durationMonths: number;
  annualRate: number;
}

export function FixedDepositForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);

  const form = useForm<FixedDepositFormValues>({
    resolver: zodResolver(fixedDepositFormSchema),
    defaultValues: {
      principalAmount: undefined,
      durationInMonths: undefined,
      annualInterestRate: undefined,
    },
  });

  const calculateFdReturns = (values: FixedDepositFormValues): CalculationResult => {
    const principal = values.principalAmount;
    const annualRate = values.annualInterestRate / 100;
    const durationYears = values.durationInMonths / 12;
    
    const maturityAmount = principal * Math.pow((1 + annualRate), durationYears);
    const interestEarned = maturityAmount - principal;

    return {
      principal,
      interestEarned: parseFloat(interestEarned.toFixed(2)),
      maturityAmount: parseFloat(maturityAmount.toFixed(2)),
      durationMonths: values.durationInMonths,
      annualRate: values.annualInterestRate,
    };
  };

  const onSubmit: SubmitHandler<FixedDepositFormValues> = async (values) => {
    setIsLoading(true);
    setCalculationResult(null);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result = calculateFdReturns(values);
    setCalculationResult(result);
    setIsLoading(false);

    toast({
      title: 'Fixed Deposit Calculated',
      description: 'Potential returns have been estimated.',
    });
  };

  const handleCreateFdSimulation = () => {
    if (calculationResult) {
      toast({
        title: "Fixed Deposit Creation Simulated",
        description: `Simulating creation of a Fixed Deposit for ₹${calculationResult.principal.toLocaleString('en-IN')} from your digital wallet. This is a mock transaction.`,
        variant: "default"
      });
    }
  };

  return (
    <Card className="shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 group w-full">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-[-3deg]">
            <Database className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Fixed Deposit Calculator</CardTitle>
        </div>
        <CardDescription>Estimate the potential returns on your fixed deposit investment. Interest is assumed to be compounded annually for this simulation.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="principalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />Principal Amount (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 50000" {...field} value={field.value ?? ""} onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="durationInMonths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><CalendarClock className="mr-2 h-4 w-4 text-muted-foreground" />Duration (Months)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 12 for 1 year" {...field} value={field.value ?? ""} onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="annualInterestRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Percent className="mr-2 h-4 w-4 text-muted-foreground" />Annual Interest Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 6.5" {...field} value={field.value ?? ""} onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full animated-bg-gradient">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TrendingUp className="mr-2 h-4 w-4" />}
              Calculate Returns
            </Button>
          </CardFooter>
        </form>
      </Form>

      {calculationResult && (
        <CardContent className="mt-6 border-t pt-6 space-y-6">
          <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-accent" />
            Estimated Fixed Deposit Returns
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 p-4 border rounded-lg bg-primary/5">
            <div>
              <p className="text-sm text-muted-foreground">Principal Amount</p>
              <p className="text-lg font-semibold text-foreground">₹{calculationResult.principal.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="text-lg font-semibold text-foreground">{calculationResult.durationMonths} months ({ (calculationResult.durationMonths / 12).toFixed(1) } years)</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Annual Interest Rate</p>
              <p className="text-lg font-semibold text-foreground">{calculationResult.annualRate}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Interest Earned</p>
              <p className="text-lg font-semibold text-green-600">₹{calculationResult.interestEarned.toLocaleString('en-IN')}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">Maturity Amount (Principal + Interest)</p>
              <p className="text-2xl font-bold text-accent">₹{calculationResult.maturityAmount.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="mt-6">
            <Button 
              onClick={handleCreateFdSimulation} 
              className="w-full animated-bg-gradient"
              disabled={isLoading}
            >
              <Wallet className="mr-2 h-4 w-4" /> Create Fixed Deposit
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              This will simulate creating an FD with the principal amount from your digital wallet.
            </p>
          </div>
          
          <Alert variant="default" className="mt-6 bg-primary/5 border-primary/20">
            <Info className="h-5 w-5 text-primary" />
            <AlertTitle className="text-primary">Important Disclaimer</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              This calculation is for illustrative purposes only and based on the inputs provided, assuming annual compounding of interest. Actual returns may vary based on the specific bank, prevailing interest rates, compounding frequency (e.g., quarterly, half-yearly), and terms and conditions of the fixed deposit scheme. This does not constitute financial advice. Please consult with banks directly for exact figures and schemes.
            </AlertDescription>
          </Alert>
        </CardContent>
      )}
    </Card>
  );
}

