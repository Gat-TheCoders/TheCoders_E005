
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, Lock, LogIn, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const loginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  mobileNumber: z.string().min(10, { message: "Mobile number must be at least 10 digits." }).regex(/^\+?[0-9\s-]+$/, { message: "Invalid mobile number format."}),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      mobileNumber: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsLoading(true);
    console.log('Login Data Submitted:', data);
    // Simulate API call for login
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast({
      title: 'Login Successful (Mock)',
      description: 'You have been successfully logged in.',
      variant: 'default',
    });
    // In a real app, you would redirect or update auth state here
    // form.reset(); // Optionally reset form
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <div className="flex items-center space-x-2">
            <div className="transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-[-3deg]">
                <LogIn className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>User Login</CardTitle>
        </div>
        <CardDescription>Enter your credentials to access your account.</CardDescription>
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
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full animated-bg-gradient">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
              Login
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
