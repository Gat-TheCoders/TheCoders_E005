'use client';

import React, { useEffect, useRef, useState, type ReactNode, type ElementType } from 'react';
import { cn } from '@/lib/utils';

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number; // in ms
  threshold?: number; // IntersectionObserver threshold
  initialClass?: string; // Classes for initial (hidden) state
  finalClass?: string;   // Classes for final (visible) state
  as?: ElementType; // To render as a different HTML element, e.g., 'section', 'article'
};

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className,
  delay = 0,
  threshold = 0.1,
  initialClass = 'opacity-0 translate-y-4', // Default initial: slightly down and invisible
  finalClass = 'opacity-100 translate-y-0',   // Default final: fully visible and at original position
  as: Component = 'div', // Default to rendering as a div
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null); // More generic HTMLElement for ref

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Apply delay using setTimeout
          const timer = setTimeout(() => {
            setIsVisible(true);
            observer.unobserve(currentRef); // Important to unobserve after animation
          }, delay);
          // Cleanup function for the timeout in case component unmounts
          return () => clearTimeout(timer);
        }
      },
      { threshold }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [delay, threshold]); // Dependencies for the useEffect

  return (
    <Component
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out', // Base transition applied to the element
        isVisible ? finalClass : initialClass, // Dynamically apply initial or final classes
        className // Allow additional classes to be passed
      )}
    >
      {children}
    </Component>
  );
};
