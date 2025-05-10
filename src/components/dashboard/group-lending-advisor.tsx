
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Users, DollarSign, ClipboardList, ShieldCheck, Lightbulb, Loader2, ListChecks, Brain, TrendingUp, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { handleAdviseOnGroupLending } from '@/app/actions';
import type { GroupLendingAdvisorInput, GroupLendingAdvisorOutput } from '@/ai/flows/group-lending-advisor';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const formSchema = z.object({
  groupSize: z
    .coerce.number({invalid_type_error: "Group size must be a number.", required_error: "Group size is required." })
    .int({message: "Group size must be an integer."})
    .positive({ message: "Group size must be a positive integer." })
    .min(2, { message: "A group must have at least 2 members."}),
  totalPooledFundTarget: z
    .coerce.number({invalid_type_error: "Fund target must be a number.", required_error: "Total pooled fund target is required." })
    .positive({ message: "Fund target must be a positive number." }),
  groupPurpose: z
    .string({ required_error: "Group purpose is required." })
    .min(10, { message: "Please describe the group's purpose in at least 10 characters." }),
  memberContributionFrequency: z
    .enum(['Weekly', 'Bi-Weekly', 'Monthly', 'Quarterly'], { required_error: "Contribution frequency is required."}),
  groupRiskProfile: z
    .enum(['Conservative', 'Balanced', 'Growth-Oriented'], { required_error: "Group risk profile is required." }),
});

export function GroupLendingAdvisor() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [adviceResult, setAdviceResult] = useState<GroupLendingAdvisorOutput | null>(null);

  const form = useForm<GroupLendingAdvisorInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupSize: '' as unknown as number,
      totalPooledFundTarget: '' as unknown as number,
      groupPurpose: '',
      memberContributionFrequency: undefined,
      groupRiskProfile: undefined,
    },
  });

  const onSubmit: SubmitHandler<GroupLendingAdvisorInput> = async (values) => {
    setIsLoading(true);
    setAdviceResult(null);
    const result = await handleAdviseOnGroupLending(values);
    setIsLoading(false);

    if ('error' in result) {
      toast({
        variant: 'destructive',
        title: 'Error Getting Advice',
        description: result.error,
      });
    } else {
      setAdviceResult(result);
      toast({
        title: 'Group Lending Advice Generated',
        description: 'Your AI-powered advice for group lending is ready.',
      });
    }
  };

  const renderFormattedText = (text: string) => {
    return text.split('\n').map((paragraph, pIndex) => (
      <p key={pIndex} className="mb-2 last:mb-0">
        {paragraph.startsWith('- ') || paragraph.startsWith('* ') ? (
          <ul className="list-disc list-inside ml-4">
            {paragraph.split('\n').map((item, iIndex) => {
              if (item.trim().length === 0) return null;
              const cleanedItem = item.replace(/^[-*]\s*/, '');
              return cleanedItem.trim() && <li key={`${pIndex}-${iIndex}`}>{cleanedItem}</li>;
            })}
          </ul>
        ) : (
          paragraph
        )}
      </p>
    ));
  };


  return (
    <Card className="shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 group w-full">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-[-3deg]">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>AI-Powered Group Lending Advisor</CardTitle>
        </div>
        <CardDescription>Get AI-driven insights and recommendations for your Self-Help Group (SHG) or group lending initiative.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="groupSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Users className="mr-2 h-4 w-4 text-muted-foreground" />Group Size (Members)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 10" {...field} value={field.value === 0 ? "" : field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalPooledFundTarget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />Total Pooled Fund Target (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 50000" {...field} value={field.value === 0 ? "" : field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="groupPurpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><ClipboardList className="mr-2 h-4 w-4 text-muted-foreground" />Group Purpose</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Micro-enterprise funding, emergency support, agricultural inputs..."
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
                name="memberContributionFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><ListChecks className="mr-2 h-4 w-4 text-muted-foreground" />Member Contribution Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {['Weekly', 'Bi-Weekly', 'Monthly', 'Quarterly'].map(freq => (
                          <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="groupRiskProfile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><ShieldCheck className="mr-2 h-4 w-4 text-muted-foreground" />Group Financial Profile</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select profile" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {['Conservative', 'Balanced', 'Growth-Oriented'].map(profile => (
                          <SelectItem key={profile} value={profile}>{profile}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Get Group Advice
            </Button>
          </CardFooter>
        </form>
      </Form>

      {adviceResult && (
        <CardContent className="mt-6 border-t pt-6 space-y-6">
          <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
            <Lightbulb className="h-6 w-6 mr-2 text-accent" />
            AI-Generated Advice for Your Group
          </h3>
          
          <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
            <AccordionItem value="item-1" className="bg-secondary/20 rounded-md mb-2">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center space-x-2">
                   <Brain className="h-5 w-5 text-primary/80" />
                   <span className="font-medium text-base">Assessment & Recommendations</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-0 pb-3 space-y-2 text-sm text-muted-foreground prose prose-sm max-w-none dark:prose-invert">
                {renderFormattedText(adviceResult.assessmentAndRecommendations)}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-secondary/20 rounded-md mb-2">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center space-x-2">
                   <AlertTriangle className="h-5 w-5 text-primary/80" />
                   <span className="font-medium text-base">Potential Challenges</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-0 pb-3 space-y-2 text-sm text-muted-foreground prose prose-sm max-w-none dark:prose-invert">
                {renderFormattedText(adviceResult.potentialChallenges)}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-secondary/20 rounded-md">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center space-x-2">
                   <TrendingUp className="h-5 w-5 text-primary/80" />
                   <span className="font-medium text-base">Key Success Factors</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-0 pb-3 space-y-2 text-sm text-muted-foreground prose prose-sm max-w-none dark:prose-invert">
                {renderFormattedText(adviceResult.successFactors)}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
           <p className="mt-4 text-xs text-muted-foreground">
              Disclaimer: This AI-generated advice is for informational and educational purposes only. It does not constitute professional financial or legal advice. Group dynamics and local regulations can vary. Always consider seeking advice from qualified professionals for specific situations.
            </p>
        </CardContent>
      )}
    </Card>
  );
}

