
'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LayoutDashboard, ListChecks, LineChart, Settings, Home, Info } from 'lucide-react'; // Added Home and Info
import { usePathname } from 'next/navigation';

export function SecondaryNavbar() {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Home', href: '/', icon: <Home className="h-4 w-4" /> },
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { name: 'My Goals', href: '/personalized-savings-plan', icon: <ListChecks className="h-4 w-4" /> },
    { name: 'Insights', href: '/dashboard', icon: <LineChart className="h-4 w-4" /> }, // Changed href to /dashboard
    { name: 'About Us', href: '/about-us', icon: <Info className="h-4 w-4" /> }, 
    { name: 'Settings', href: '/settings', icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <nav className="bg-card/80 backdrop-blur-md border-b border-border/60 shadow-sm sticky top-16 z-40"> {/* Adjusted sticky top */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 h-12 flex items-center justify-center">
        <ul className="flex items-center space-x-2 sm:space-x-4 text-sm font-medium overflow-x-auto whitespace-nowrap">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 px-2 py-1.5 rounded-md text-foreground/70 hover:text-primary hover:bg-primary/10 transition-colors duration-200",
                  pathname === item.href && "text-primary bg-primary/10 font-semibold"
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


