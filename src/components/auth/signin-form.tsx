
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, Lock, UserPlus, Loader2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const signInFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  mobileNumber: z.string().min(10, { message: "Mobile number must be at least 10 digits." }).regex(/^\+?[0-9\s-]+$/, { message: "Invalid mobile number format."}),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"], // Set error on confirmPassword field
});

type SignInFormValues = z.infer<typeof signInFormSchema>;

export function SignInForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: '',
      mobileNumber: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit: SubmitHandler<SignInFormValues> = async (data) => {
    setIsLoading(true);
    // console.log('Sign In Data Submitted:', data); // Removed console.log
    // Simulate API call for sign-in
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast({
      title: 'Account Created (Mock)',
      description: 'Your account has been successfully created.',
      variant: 'default',
    });
    form.reset(); // Reset form on successful submission
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <div className="flex items-center space-x-2">
            <div className="transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-[-3deg]">
                <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Create Account</CardTitle>
        </div>
        <CardDescription>Enter your details to create a new Own Finance account.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground" />Email Address</FormLabel>
                  <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Phone className="mr-2 h-4 w-4 text-muted-foreground" />Mobile Number</FormLabel>
                  <FormControl><Input type="tel" placeholder="+1 123 456 7890" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Lock className="mr-2 h-4 w-4 text-muted-foreground" />Password</FormLabel>
                  <FormControl><Input type="password" placeholder="********" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Lock className="mr-2 h-4 w-4 text-muted-foreground" />Confirm Password</FormLabel>
                  <FormControl><Input type="password" placeholder="********" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col items-stretch space-y-4">
            <Button type="submit" disabled={isLoading} className="w-full animated-bg-gradient">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
              Create Account
            </Button>
            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Button variant="link" asChild className="px-1">
                    <Link href="/login">Login here</Link>
                </Button>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

