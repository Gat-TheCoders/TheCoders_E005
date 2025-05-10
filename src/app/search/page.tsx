
import type { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, SearchIcon } from "lucide-react";
import { ScrollReveal } from '@/components/utils/scroll-reveal';

export const metadata: Metadata = {
  title: 'Search | Own Finance',
  description: 'Search for features and information on Own Finance.',
};

export default function SearchPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
      <ScrollReveal delay={0}>
         <header className="mb-10 text-center">
           <SearchIcon className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-primary">
            Search
          </h1>
          <p className="mt-4 text-lg leading-8 text-foreground/80 max-w-2xl mx-auto">
            This page is under construction. Search functionality will be available soon.
          </p>
        </header>
      </ScrollReveal>
      
      <ScrollReveal delay={200}>
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
