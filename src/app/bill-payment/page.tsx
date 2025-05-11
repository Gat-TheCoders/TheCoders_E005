
'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Receipt, Construction, Lightbulb, Droplets, Wifi, Flame, Tv2 } from "lucide-react";
import { ScrollReveal } from '@/components/utils/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Metadata removed from client component.
// If metadata is needed, it should be defined in a Server Component or layout file.

const billCategories = [
  { name: "Electricity Bill", icon: Lightbulb, amount: "1,250.00", dueDate: "15th Jul 2024", status: "Pending", provider: "Adani Electricity" },
  { name: "Water Bill", icon: Droplets, amount: "480.50", dueDate: "18th Jul 2024", status: "Pending", provider: "MCGM" },
  { name: "Internet Bill", icon: Wifi, amount: "999.00", dueDate: "20th Jul 2024", status: "Paid", provider: "JioFiber" },
  { name: "Gas Bill", icon: Flame, amount: "870.00", dueDate: "22nd Jul 2024", status: "Pending", provider: "Mahanagar Gas" },
  { name: "DTH/Cable TV", icon: Tv2, amount: "350.00", dueDate: "25th Jul 2024", status: "Paid", provider: "Tata Play" },
];

export default function BillPaymentPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <ScrollReveal delay={0}>
         <header className="mb-10 text-center">
          <Receipt className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-primary">
            Bill Payment Center
          </h1>
          <p className="mt-4 text-lg leading-8 text-foreground/80 max-w-2xl mx-auto">
            Easily manage and pay your utility bills, subscriptions, and more.
          </p>
        </header>
      </ScrollReveal>
      
      <ScrollReveal delay={200}>
        <Card className="max-w-2xl mx-auto shadow-xl">
            <CardHeader>
                <CardTitle className="text-2xl text-primary">Your Bills</CardTitle>
                <CardDescription>Review your outstanding and paid bills. Mock data is shown for demonstration.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {billCategories.map((bill, index) => (
                    <div key={index}>
                        <Card className="bg-secondary/20 hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-base font-medium flex items-center">
                                    <bill.icon className="h-5 w-5 mr-2 text-accent" />
                                    {bill.name}
                                </CardTitle>
                                <span className={`text-sm font-semibold ${bill.status === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>
                                    {bill.status}
                                </span>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">Provider: {bill.provider}</p>
                                <p className="text-2xl font-bold text-primary">₹{bill.amount}</p>
                                {bill.status === 'Pending' && (
                                    <p className="text-xs text-muted-foreground">
                                        Due by: {bill.dueDate}
                                    </p>
                                )}
                                 {bill.status === 'Paid' && (
                                    <p className="text-xs text-green-500">
                                        Paid on: {new Date(new Date(bill.dueDate).getTime() - (3 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                )}
                            </CardContent>
                            <CardFooter>
                                {bill.status === 'Pending' ? (
                                    <Button className="w-full animated-bg-gradient" onClick={() => alert(`Simulating payment for ${bill.name}`)}>
                                        Pay Now ₹{bill.amount}
                                    </Button>
                                ) : (
                                    <Button variant="outline" className="w-full" disabled>
                                        View Receipt (Mock)
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                        {index < billCategories.length - 1 && <Separator className="my-6" />}
                    </div>
                ))}

                <div className="mt-8 text-center">
                     <Construction className="h-12 w-12 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                        Automatic bill fetching and full payment gateway integration are under development.
                    </p>
                </div>
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

