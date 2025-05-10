
'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LayoutDashboard, ListChecks, LineChart, Settings } from 'lucide-react';

export function SecondaryNavbar() {
  // Placeholder links, adjust as needed based on actual app features
  const navItems = [
    { name: 'Dashboard', href: '/', icon: <LayoutDashboard className="h-4 w-4" /> },
    { name: 'My Goals', href: '/personalized-savings-plan', icon: <ListChecks className="h-4 w-4" /> },
    { name: 'Insights', href: '/expense-optimizer', icon: <LineChart className="h-4 w-4" /> },
    { name: 'Settings', href: '/settings', icon: <Settings className="h-4 w-4" /> }, // Assuming a settings page might exist
  ];

  return (
    <nav className="bg-card/80 backdrop-blur-md border-b border-border/60 shadow-sm"> {/* Removed sticky top-16 z-40 */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 h-12 flex items-center justify-center sm:justify-start">
        <ul className="flex items-center space-x-3 sm:space-x-5 text-sm font-medium">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 px-2 py-1.5 rounded-md text-foreground/70 hover:text-primary hover:bg-primary/10 transition-colors duration-200",
                  // Add active state based on pathname if you have access to it here
                  // e.g., pathname === item.href && "text-primary bg-primary/10"
                )}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

