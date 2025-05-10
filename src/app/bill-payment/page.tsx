
import type { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Receipt, Construction } from "lucide-react";
import { ScrollReveal } from '@/components/utils/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Bill Payment | Own Finance',
  description: 'Manage and pay your bills securely and conveniently through Own Finance.',
};

export default function BillPaymentPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <ScrollReveal delay={0}>
         <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-primary">
            Bill Payment Center
          </h1>
          <p className="mt-4 text-lg leading-8 text-foreground/80 max-w-2xl mx-auto">
            Easily manage and pay your utility bills, subscriptions, and more. This feature is currently under development.
          </p>
        </header>
      </ScrollReveal>
      
      <ScrollReveal delay={200}>
        <Card className="max-w-xl mx-auto shadow-lg">
            <CardHeader className="items-center">
                <div className="p-3 rounded-full bg-primary/10 mb-3">
                    <Receipt className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl text-primary">Pay Your Bills</CardTitle>
                <CardDescription>Securely manage your bill payments in one place.</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-10">
                <Construction className="h-20 w-20 text-muted-foreground/50 mx-auto animate-bounce" />
                <p className="mt-6 text-lg text-muted-foreground">
                    Our bill payment feature is coming soon!
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                    We are working hard to bring you a seamless bill payment experience. Stay tuned!
                </p>
            </CardContent>
        </Card>
      </ScrollReveal>

      <ScrollReveal delay={400}>
        <div className="mt-12 text-center">
          <Button variant="outline" asChild className="transition-all hover:shadow-md">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </ScrollReveal>
    </div>
  );
}
