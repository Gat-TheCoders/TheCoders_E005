
import type { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Info as InfoIcon, Building, Target } from "lucide-react";
import { ScrollReveal } from '@/components/utils/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'About Us | Own Finance',
  description: 'Learn more about Own Finance, our mission, and our team.',
};

export default function AboutUsPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <ScrollReveal delay={0}>
         <header className="mb-10 text-center">
          <InfoIcon className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-primary">
            About Own Finance
          </h1>
          <p className="mt-4 text-lg leading-8 text-foreground/80 max-w-2xl mx-auto">
            Discover our story, mission, and the values that drive us to empower your financial journey.
          </p>
        </header>
      </ScrollReveal>
      
      <ScrollReveal delay={200}>
        <Card className="max-w-3xl mx-auto shadow-lg mb-8">
            <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                    <Building className="h-8 w-8 text-accent" />
                    <CardTitle className="text-2xl text-primary">Our Mission</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                    At Own Finance, our mission is to democratize financial literacy and provide accessible, AI-powered tools that help individuals make informed decisions about their money. We believe that everyone deserves the opportunity to achieve financial well-being, and we are committed to building a platform that simplifies complex financial concepts and empowers users to take control of their financial future.
                </p>
            </CardContent>
        </Card>
      </ScrollReveal>

      <ScrollReveal delay={300}>
        <Card className="max-w-3xl mx-auto shadow-lg mb-8">
            <CardHeader>
                 <div className="flex items-center space-x-3 mb-2">
                    <Target className="h-8 w-8 text-accent" />
                    <CardTitle className="text-2xl text-primary">Our Vision</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                    We envision a world where financial planning is intuitive, personal, and empowering for everyone. By leveraging cutting-edge technology and a user-centric approach, Own Finance aims to be the leading companion in your journey towards financial independence and security. We strive to continuously innovate and adapt to meet the evolving needs of our users.
                </p>
            </CardContent>
        </Card>
      </ScrollReveal>
      
      <ScrollReveal delay={500}>
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

