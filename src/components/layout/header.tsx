
'use client'; // Make header a client component to use hooks

import Link from 'next/link';
import { FinanceForwardLogo } from '@/components/icons/logo';
import { useScrollY } from '@/hooks/use-scroll-y';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, LifeBuoy, Phone, X } from 'lucide-react'; 
import { useState } from 'react';

export function Header() {
  const scrollY = useScrollY();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-shadow duration-300 ease-out",
        scrollY > 10 ? "shadow-md" : "shadow-none"
      )}
    >
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 shrink-0" aria-label="Home">
          <FinanceForwardLogo />
        </Link>
        
        <div className="flex flex-1 items-center justify-end space-x-1 sm:space-x-2">
          {isSearchOpen ? (
            <div className="flex flex-1 items-center space-x-2 sm:max-w-xs md:max-w-sm lg:max-w-md"> {/* Search input and close button */}
              <Input 
                type="search" 
                placeholder="Search Own Finance..." 
                className="h-9 flex-1"
                autoFocus 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    // Placeholder for actual search submission
                    // For now, could close search or navigate to a search page with query
                    // console.log('Search submitted:', (e.target as HTMLInputElement).value); // Removed console.log
                    setIsSearchOpen(false); // Example: close on enter
                  } else if (e.key === 'Escape') {
                    setIsSearchOpen(false);
                  }
                }}
              />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSearchOpen(false)} 
                aria-label="Close search"
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <>
              {/* Default Nav Icons */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSearchOpen(true)} 
                aria-label="Open search" 
                className="animated-bg-gradient text-primary-foreground hover:text-accent-foreground"
              >
                <Search className="h-5 w-5" />
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
            </>
          )}

          {/* Auth Buttons */}
          {/* Conditionally hide auth buttons on extra-small screens when search is open to give more space */}
          <div className={cn(
            "flex items-center space-x-1 sm:space-x-2",
            isSearchOpen && "hidden xs:flex sm:flex" // Hidden on very small screens (custom 'xs' effectively)
          )}>
            <Button variant="default" className="font-semibold animated-bg-gradient" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button variant="default" className="font-semibold animated-bg-gradient" asChild>
              <Link href="/signin">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

