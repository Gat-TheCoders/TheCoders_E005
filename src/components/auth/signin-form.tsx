
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';

export function SignInForm() {
  // This is a placeholder component.
  // In a real application, this would contain the sign-in form fields and logic.
  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <div className="flex items-center space-x-2">
            <div className="transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-[-3deg]">
                <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Create Account</CardTitle>
        </div>
        <CardDescription>Sign in to create a new Own Finance account.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-muted-foreground">
          Sign-in functionality is under construction.
        </p>
        <p className="text-center">
            Already have an account?{' '}
            <Button variant="link" asChild className="px-0">
                <Link href="/login">Login here</Link>
            </Button>
        </p>
      </CardContent>
    </Card>
  );
}
