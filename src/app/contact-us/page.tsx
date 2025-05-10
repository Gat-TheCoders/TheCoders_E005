
import type { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Mail, Phone as PhoneIcon, MapPin } from "lucide-react"; // Renamed Phone to avoid conflict
import { ScrollReveal } from '@/components/utils/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Contact Us | Own Finance',
  description: 'Get in touch with Own Finance support.',
};

export default function ContactUsPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <ScrollReveal delay={0}>
         <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-primary">
            Contact Us
          </h1>
          <p className="mt-4 text-lg leading-8 text-foreground/80 max-w-2xl mx-auto">
            We&apos;re here to help. Reach out to us through any of the channels below.
          </p>
        </header>
      </ScrollReveal>
      
      <ScrollReveal delay={200}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="items-center">
              <div className="p-3 rounded-full bg-primary/10 mb-3">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl text-primary">Email Us</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">Send your queries to:</p>
              <a href="mailto:support@ownfinance.com" className="text-accent hover:underline font-medium">
                support@ownfinance.com
              </a>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="items-center">
              <div className="p-3 rounded-full bg-primary/10 mb-3">
                <PhoneIcon className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl text-primary">Call Us</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">Talk to our support team:</p>
              <p className="text-accent font-medium">+1 (555) 123-4567</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="items-center">
               <div className="p-3 rounded-full bg-primary/10 mb-3">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl text-primary">Visit Us</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">Find our office at:</p>
              <p className="text-accent font-medium">
                123 Finance Street, Moneyville, USA
              </p>
            </CardContent>
          </Card>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={400}>
        <div className="mt-16 text-center">
          <p className="text-foreground/80 mb-4">Alternatively, try our AI Chatbot for quick answers!</p>
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
