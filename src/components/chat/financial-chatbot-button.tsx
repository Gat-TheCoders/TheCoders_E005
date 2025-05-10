'use client';

import type { ComponentProps } from 'react';
import { Bot, MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FinancialChatbotButtonProps extends ComponentProps<'button'> {
  isOpen: boolean;
  onClick: () => void;
}

export function FinancialChatbotButton({ isOpen, onClick, className, ...props }: FinancialChatbotButtonProps) {
  return (
    <Button
      variant="default"
      size="icon"
      className={cn(
        "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 animated-bg-gradient text-primary-foreground",
        "transition-all duration-300 ease-in-out transform hover:scale-110",
        className
      )}
      onClick={onClick}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
      {...props}
    >
      {isOpen ? <X className="h-7 w-7" /> : <Bot className="h-7 w-7" />}
    </Button>
  );
}
