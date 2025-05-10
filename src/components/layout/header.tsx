
'use client'; // Make header a client component to use hooks

import Link from 'next/link';
import { FinanceForwardLogo } from '@/components/icons/logo';
import { useScrollY } from '@/hooks/use-scroll-y';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function Header() {
  const scrollY = useScrollY();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-shadow duration-300 ease-out",
        scrollY > 10 ? "shadow-md" : "shadow-none"
      )}
    >
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <FinanceForwardLogo />
        </Link>
        <div className="flex items-center space-x-3">
          <Button variant="outline" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button variant="default" className="font-semibold animated-text-gradient" asChild>
            <Link href="/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

