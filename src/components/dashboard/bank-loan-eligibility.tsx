'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Landmark, Loader2, Info, CheckCircle2, AlertCircle, ListChecks, Briefcase, Wallet, FileQuestion } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { handleAssessLoanEligibility } from '@/app/actions';
import { type BankLoanEligibilityInput, type BankLoanEligibilityOutput } from '@/ai/flows/bank-loan-eligibility';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Define the Zod schema for form validation locally in the client component
const formSchema = z.object({
  monthlyIncome: z
    .number({required_error: "Monthly income is required."})
    .positive({message: "Monthly income must be a positive number."}),
  employmentStatus: z
    .enum(['Employed', 'Self-Employed', 'Unemployed', 'Student', 'Retired', 'Other'], {required_error: "Employment status is required."}),
  desiredLoanAmount: z
    .number()
    .positive({message: "Desired loan amount must be a positive number."})
    .optional(),
  loanPurpose: z
    .string()
    .min(3, {message: "Loan purpose should be at least 3 characters."})
    .optional(),
  creditScoreEstimate: z
    .enum(['Excellent (750+)', 'Good (700-749)', 'Fair (650-699)', 'Poor (Below 650)', 'Unknown'], {required_error: "Credit score estimate is required."}),
  existingMonthlyDebtPayments: z
    .number()
    .nonnegative({message: "Existing monthly debt payments cannot be negative."})
    .optional(),
});


export function BankLoanEligibility() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState<BankLoanEligibilityOutput | null>(null);

  const form = useForm<BankLoanEligibilityInput>({
    resolver: zodResolver(formSchema), // Use the locally defined formSchema
    defaultValues: {
      monthlyIncome: undefined,
      employmentStatus: undefined,
      desiredLoanAmount: undefined,
      loanPurpose: '',
      creditScoreEstimate: undefined,
      existingMonthlyDebtPayments: undefined,
    },
  });

  const onSubmit: SubmitHandler<BankLoanEligibilityInput> = async (values) => {
    setIsLoading(true);
    setEligibilityResult(null);
    const result = await handleAssessLoanEligibility(values);
    setIsLoading(false);

    if ('error' in result) {
      toast({
        variant: 'destructive',
        title: 'Error Assessing Loan Eligibility',
        description: result.error,
      });
    } else {
      setEligibilityResult(result);
      toast({
        title: 'Loan Eligibility Assessed',
        description: 'Your general loan eligibility has been assessed.',
      });
    }
  };

  const getEligibilityIcon = (assessment: string | undefined) => {
    if (!assessment) return <Info className="h-6 w-6 text-primary" />;
    if (assessment.toLowerCase().includes('likely eligible')) {
      return <CheckCircle2 className="h-6 w-6 text-green-500" />;
    }
    if (assessment.toLowerCase().includes('challenging') || assessment.toLowerCase().includes('unlikely')) {
      return <AlertCircle className="h-6 w-6 text-red-500" />;
    }
    return <Info className="h-6 w-6 text-yellow-500" />;
  };


  return (
    <Card className="shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 group w-full">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-[-3deg]">
            <Landmark className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Bank Loan Eligibility Estimator</CardTitle>
        </div>
        <CardDescription>Estimate your general eligibility for bank loans based on your financial profile. This is for informational purposes only.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="monthlyIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Wallet className="mr-2 h-4 w-4 text-muted-foreground" />Monthly Income ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 6000" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employmentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />Employment Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {['Employed', 'Self-Employed', 'Unemployed', 'Student', 'Retired', 'Other'].map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="desiredLoanAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Wallet className="mr-2 h-4 w-4 text-muted-foreground" />Desired Loan Amount ($) <span className="text-xs text-muted-foreground ml-1">(Optional)</span></FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 10000" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="creditScoreEstimate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><ListChecks className="mr-2 h-4 w-4 text-muted-foreground" />Credit Score Estimate</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select credit score range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {['Excellent (750+)', 'Good (700-749)', 'Fair (650-699)', 'Poor (Below 650)', 'Unknown'].map(score => (
                          <SelectItem key={score} value={score}>{score}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="existingMonthlyDebtPayments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Wallet className="mr-2 h-4 w-4 text-muted-foreground" />Existing Monthly Debt Payments ($) <span className="text-xs text-muted-foreground ml-1">(Optional)</span></FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 500" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="loanPurpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><FileQuestion className="mr-2 h-4 w-4 text-muted-foreground" />Loan Purpose <span className="text-xs text-muted-foreground ml-1">(Optional)</span></FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Car purchase, home renovation, debt consolidation..."
                      className="resize-y min-h-[80px]"
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
              Assess Eligibility
            </Button>
          </CardFooter>
        </form>
      </Form>
      {eligibilityResult && (
        <CardContent className="mt-6 border-t pt-6 space-y-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              {getEligibilityIcon(eligibilityResult.eligibilityAssessment)}
              <h3 className="text-xl font-semibold text-primary">Eligibility Assessment</h3>
            </div>
            <p className="text-lg font-medium">{eligibilityResult.eligibilityAssessment}</p>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-1 text-foreground/90">Key Factors:</h4>
            <p className="text-sm whitespace-pre-wrap text-muted-foreground">{eligibilityResult.keyFactors}</p>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-1 text-foreground/90">Suggested Next Steps:</h4>
            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
              {eligibilityResult.suggestedNextSteps.split('\n').map((step, index) => step.trim() && <li key={index}>{step.replace(/^- /, '')}</li>)}
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-primary mb-3">Potential Lender Types</h3>
            <Accordion type="single" collapsible className="w-full">
              {eligibilityResult.potentialLenders.map((lender, index) => (
                <AccordionItem value={`item-${index}`} key={index} className="bg-secondary/20 rounded-md mb-2">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex items-center space-x-2">
                       <Landmark className="h-5 w-5 text-primary/80" />
                       <span className="font-medium text-base">{lender.bankName}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-0 pb-3 space-y-2">
                    <p className="text-sm"><strong className="font-medium text-foreground/80">Relevant Loan Products:</strong> {lender.loanProducts.join(', ')}</p>
                    <p className="text-sm"><strong className="font-medium text-foreground/80">Typical Interest Rate Info:</strong> {lender.typicalInterestRateInfo}</p>
                    <p className="text-sm"><strong className="font-medium text-foreground/80">Common Requirements:</strong> {lender.commonRequirements}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
             <p className="mt-4 text-xs text-muted-foreground">
              Disclaimer: The lender information provided is illustrative and for general informational purposes only. It does not constitute an endorsement or guarantee of loan approval or specific terms. Actual loan availability, interest rates, and terms will vary and depend on individual circumstances and lender requirements. Always do your own research and consult with financial institutions directly.
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

