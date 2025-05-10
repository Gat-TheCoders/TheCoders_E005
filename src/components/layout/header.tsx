
'use client'; // Make header a client component to use hooks

import Link from 'next/link';
import { FinanceForwardLogo } from '@/components/icons/logo';
import { useScrollY } from '@/hooks/use-scroll-y';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Home, Search, LifeBuoy, Phone } from 'lucide-react'; // Added Phone for Contact Us

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
        <Link href="/" className="flex items-center space-x-2" aria-label="Home">
          <FinanceForwardLogo />
        </Link>
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Home button - can be part of logo link or a separate explicit button */}
          {/* For now, logo serves as home link. If explicit needed:
          <Button variant="ghost" size="icon" asChild>
            <Link href="/" aria-label="Home">
              <Home className="h-5 w-5" />
            </Link>
          </Button>
          */}
          <Button variant="ghost" size="icon" asChild className="animated-bg-gradient text-primary-foreground hover:text-accent-foreground">
            <Link href="/search" aria-label="Search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="animated-bg-gradient text-primary-foreground hover:text-accent-foreground">
            <Link href="/support" aria-label="Support">
              <LifeBuoy className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="animated-bg-gradient text-primary-foreground hover:text-accent-foreground">
            <Link href="/contact-us" aria-label="Contact Us">
              <Phone className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="default" className="font-semibold animated-bg-gradient" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button variant="default" className="font-semibold animated-bg-gradient" asChild>
            <Link href="/signin">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

