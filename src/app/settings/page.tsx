
import type { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Settings as SettingsIcon } from "lucide-react"; // Renamed to avoid conflict
import { ScrollReveal } from '@/components/utils/scroll-reveal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Settings | Own Finance',
  description: 'Manage your Own Finance account settings.',
};

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <ScrollReveal delay={0}>
         <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-primary">
            Account Settings
          </h1>
          <p className="mt-4 text-lg leading-8 text-foreground/80 max-w-2xl mx-auto">
            Manage your profile, preferences, and security settings.
          </p>
        </header>
      </ScrollReveal>
      
      <ScrollReveal delay={200}>
        <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader>
                <div className="flex items-center space-x-2">
                    <SettingsIcon className="h-6 w-6 text-primary"/>
                    <CardTitle>Settings Panel</CardTitle>
                </div>
                <CardDescription>This page is currently under construction. Settings management will be available soon.</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-10">
                <SettingsIcon className="h-24 w-24 text-muted-foreground/50 mx-auto animate-spin-slow" />
                <p className="mt-6 text-lg text-muted-foreground">Coming Soon!</p>
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

// Add slow spin animation to globals.css if it doesn't exist
// @keyframes spin-slow { to { transform: rotate(360deg); } }
// .animate-spin-slow { animation: spin-slow 5s linear infinite; }
// It's better to add this animation in globals.css
// For now, inline style will be overridden by Tailwind JIT, so use animate-spin (faster) or define in globals

