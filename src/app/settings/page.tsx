
'use client';

import type { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Settings as SettingsIcon, UserCircle, Bell, Languages, Moon, Sun, Trash2, ShieldAlert, ChevronDown } from "lucide-react";
import { ScrollReveal } from '@/components/utils/scroll-reveal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

// export const metadata: Metadata = { // Metadata should be handled by a server component or layout
//   title: 'Settings | Own Finance',
//   description: 'Manage your Own Finance account settings.',
// };

export default function SettingsPage() {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState('light'); // Default theme

  // Ensure component is mounted before using theme from localStorage or system preference
  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(storedTheme);
    document.documentElement.classList.toggle('dark', storedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    toast({
      title: `Theme Changed to ${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} Mode`,
    });
  };

  const handleAccountDeletion = () => {
    // Simulate account deletion
    toast({
      title: 'Account Deletion Initiated (Mock)',
      description: 'Your account deletion request has been processed. This is a simulation.',
      variant: 'destructive',
    });
  };

  if (!mounted) {
    // Avoid rendering UI that depends on theme before hydration
    return <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-10rem)]"><SettingsIcon className="h-16 w-16 text-primary animate-spin-slow" /></div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <ScrollReveal delay={0}>
         <header className="mb-10 text-center">
          <SettingsIcon className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-primary">
            Account Settings
          </h1>
          <p className="mt-4 text-lg leading-8 text-foreground/80 max-w-2xl mx-auto">
            Manage your profile, preferences, and security settings.
          </p>
        </header>
      </ScrollReveal>
      
      <ScrollReveal delay={200}>
        <Card className="max-w-2xl mx-auto shadow-xl">
            <CardHeader>
                <div className="flex items-center space-x-3">
                    <UserCircle className="h-8 w-8 text-primary"/>
                    <CardTitle className="text-2xl text-primary">Profile Details</CardTitle>
                </div>
                <CardDescription>Manage your personal information. (Mock data shown)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col space-y-1">
                    <Label htmlFor="name">Full Name</Label>
                    <p id="name" className="text-sm text-muted-foreground">John Doe (Placeholder)</p>
                </div>
                <div className="flex flex-col space-y-1">
                    <Label htmlFor="email">Email Address</Label>
                    <p id="email" className="text-sm text-muted-foreground">john.doe@example.com (Placeholder)</p>
                </div>
                 <Button variant="outline" size="sm">Edit Profile (Coming Soon)</Button>
            </CardContent>
        </Card>
      </ScrollReveal>

      <ScrollReveal delay={300}>
        <Card className="max-w-2xl mx-auto shadow-xl mt-8">
            <CardHeader>
                <div className="flex items-center space-x-3">
                    <Bell className="h-8 w-8 text-primary"/>
                    <CardTitle className="text-2xl text-primary">Notifications</CardTitle>
                </div>
                <CardDescription>Control how you receive notifications from Own Finance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                        <span>Email Notifications</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                        Receive updates and alerts via email.
                        </span>
                    </Label>
                    <Switch id="email-notifications" defaultChecked onCheckedChange={(checked) => toast({ title: `Email notifications ${checked ? 'enabled' : 'disabled'}`}) } />
                </div>
                <div className="flex items-center justify-between">
                     <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
                        <span>Push Notifications</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                        Get real-time alerts on your device. (Feature coming soon)
                        </span>
                    </Label>
                    <Switch id="push-notifications" disabled />
                </div>
            </CardContent>
        </Card>
      </ScrollReveal>

      <ScrollReveal delay={400}>
        <Card className="max-w-2xl mx-auto shadow-xl mt-8">
            <CardHeader>
                <div className="flex items-center space-x-3">
                    <Languages className="h-8 w-8 text-primary"/>
                    <CardTitle className="text-2xl text-primary">Preferences</CardTitle>
                </div>
                <CardDescription>Customize your experience on Own Finance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    <Label htmlFor="language" className="flex-shrink-0 mr-4">Language</Label>
                    <Select defaultValue="en" onValueChange={(value) => toast({ title: `Language set to ${value === 'en' ? 'English' : 'Spanish (Mock)'}`})}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es" disabled>Español (Coming Soon)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="flex items-center justify-between">
                    <Label htmlFor="theme-toggle" className="flex items-center">
                        {theme === 'light' ? <Sun className="mr-2 h-5 w-5 text-yellow-500" /> : <Moon className="mr-2 h-5 w-5 text-blue-500" />}
                        Appearance
                    </Label>
                    <Switch
                        id="theme-toggle"
                        checked={theme === 'dark'}
                        onCheckedChange={toggleTheme}
                        aria-label="Toggle dark mode"
                    />
                </div>
            </CardContent>
        </Card>
      </ScrollReveal>

      <ScrollReveal delay={500}>
        <Card className="max-w-2xl mx-auto shadow-xl mt-8 border-destructive">
            <CardHeader>
                <div className="flex items-center space-x-3">
                    <Trash2 className="h-8 w-8 text-destructive"/>
                    <CardTitle className="text-2xl text-destructive">Account Management</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                 <p className="text-sm text-muted-foreground mb-4">
                    Deleting your account is permanent and cannot be undone. All your data associated with Own Finance will be removed.
                </p>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full sm:w-auto">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center"><ShieldAlert className="h-5 w-5 mr-2 text-destructive"/>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleAccountDeletion} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                                Yes, delete account
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
      </ScrollReveal>

      <ScrollReveal delay={600}>
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
