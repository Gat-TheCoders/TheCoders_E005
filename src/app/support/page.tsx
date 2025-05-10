
import type { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, LifeBuoy, Bot, Mail, Phone as PhoneIcon, MessageSquare } from "lucide-react";
import { ScrollReveal } from '@/components/utils/scroll-reveal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Support | Own Finance',
  description: 'Get help and support for Own Finance services and features.',
};

export default function SupportPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
      <ScrollReveal delay={0}>
         <header className="mb-12 text-center">
            <LifeBuoy className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-primary">
            Own Finance Support Center
          </h1>
          <p className="mt-4 text-lg leading-8 text-foreground/80 max-w-2xl mx-auto">
            Need help? We&apos;re here to assist you. Explore the support options below.
          </p>
        </header>
      </ScrollReveal>
      
      <ScrollReveal delay={200}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <CardHeader className="items-center text-center">
              <div className="p-3 rounded-full bg-primary/10 mb-3">
                <Bot className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl text-primary">AI Chat Assistant</CardTitle>
            </CardHeader>
            <CardContent className="text-center flex-grow">
              <p className="text-muted-foreground mb-4">
                For quick answers to common questions about Own Finance features, account information, or general financial topics, try our AI assistant, Finley.
              </p>
              <p className="text-sm text-foreground/70">
                Finley is available 24/7 via the chat icon <MessageSquare className="inline h-4 w-4 text-accent" /> at the bottom-right of your screen.
              </p>
            </CardContent>
            <CardFooter className="justify-center">
                <p className="text-xs text-muted-foreground italic">Finley is ready to help!</p>
            </CardFooter>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <CardHeader className="items-center text-center">
              <div className="p-3 rounded-full bg-primary/10 mb-3">
                 <Mail className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl text-primary">Direct Contact</CardTitle>
            </CardHeader>
            <CardContent className="text-center flex-grow">
              <p className="text-muted-foreground mb-4">
                If you have specific account issues, detailed inquiries, or prefer to speak with a human support agent, please get in touch with us directly.
              </p>
              <div className="space-y-2 mb-6">
                <p className="text-sm">
                  <Mail className="inline h-4 w-4 mr-1 text-accent" /> Email: <a href="mailto:support@ownfinance.com" className="text-accent hover:underline">support@ownfinance.com</a>
                </p>
                <p className="text-sm">
                  <PhoneIcon className="inline h-4 w-4 mr-1 text-accent" /> Phone: <span className="text-accent">+1 (555) 123-4567</span>
                </p>
              </div>
              <Button asChild className="animated-bg-gradient">
                <Link href="/contact-us">
                  Go to Contact Page
                </Link>
              </Button>
            </CardContent>
             <CardFooter className="justify-center">
                <p className="text-xs text-muted-foreground italic">We&apos;ll get back to you as soon as possible.</p>
            </CardFooter>
          </Card>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={400}>
        <div className="mt-16 text-center">
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
