
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { SecondaryNavbar } from '@/components/layout/secondary-navbar'; // Import SecondaryNavbar
import { FinancialChatbot } from '@/components/chat/financial-chatbot'; // Import the chatbot

export const metadata: Metadata = {
  title: 'Own Finance',
  description: 'Your partner in financial understanding and growth.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} antialiased flex flex-col min-h-screen`}>
        <Header />
        <SecondaryNavbar /> {/* Add SecondaryNavbar here */}
        <main className="flex-grow pt-[48px]"> {/* Add padding-top equal to SecondaryNavbar height */}
          {children}
        </main>
        <FinancialChatbot /> {/* Add chatbot here */}
        <Toaster />
      </body>
    </html>
  );
}

