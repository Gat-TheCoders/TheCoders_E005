'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Loader2, Send, User, X } from 'lucide-react';
import { handleFinancialChat } from '@/app/actions';
import type { FinancialChatInput } from '@/ai/flows/financial-chat-flow';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  isLoading?: boolean;
}

interface FinancialChatbotWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const predefinedQueries = [
  "What can you do?",
  "Explain credit scores.",
  "How do I save money?",
  "Tell me about loan eligibility.",
];

export function FinancialChatbotWindow({ isOpen, onClose }: FinancialChatbotWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'initial-ai-greeting', sender: 'ai', text: "Hello! I'm Finley, your AI financial assistant. How can I help you today with Own Finance?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (query?: string) => {
    const textToSend = query || inputValue.trim();
    if (!textToSend) return;

    const userMessageId = `${Date.now()}-user`;
    const aiMessageId = `${Date.now()}-ai`;

    setMessages(prev => [
      ...prev,
      { id: userMessageId, sender: 'user', text: textToSend },
      { id: aiMessageId, sender: 'ai', text: '', isLoading: true }
    ]);

    if (!query) {
      setInputValue('');
    }
    setIsAiLoading(true);

    try {
      const result = await handleFinancialChat({ userQuery: textToSend } as FinancialChatInput);
      if ('error' in result) {
        setMessages(prev => prev.map(msg => msg.id === aiMessageId ? { ...msg, text: `Error: ${result.error}`, isLoading: false } : msg));
        toast({ variant: 'destructive', title: 'Chatbot Error', description: result.error });
      } else {
        setMessages(prev => prev.map(msg => msg.id === aiMessageId ? { ...msg, text: result.aiResponse, isLoading: false } : msg));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
      setMessages(prev => prev.map(msg => msg.id === aiMessageId ? { ...msg, text: `Error: ${errorMessage}`, isLoading: false } : msg));
      toast({ variant: 'destructive', title: 'Chatbot Error', description: errorMessage });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage();
  };
  
  const handlePredefinedQueryClick = (query: string) => {
    setInputValue(query); // Optionally set input value
    handleSendMessage(query);
  };

  if (!isOpen) return null;

  return (
    <Card className="fixed bottom-20 right-6 w-full max-w-sm h-[70vh] max-h-[600px] z-40 shadow-xl flex flex-col rounded-lg border bg-card text-card-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-5 w-5" /></AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base font-semibold">Finley</CardTitle>
            <CardDescription className="text-xs">Your Financial Assistant</CardDescription>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-5 w-5" />
          <span className="sr-only">Close chat</span>
        </Button>
      </CardHeader>
      <CardContent className="flex-grow p-0 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-end space-x-2 max-w-[85%]",
                  message.sender === 'user' ? "ml-auto justify-end" : "mr-auto justify-start"
                )}
              >
                {message.sender === 'ai' && (
                  <Avatar className="h-7 w-7 self-start">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs"><Bot className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "p-2.5 rounded-lg text-sm break-words",
                    message.sender === 'user'
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted text-muted-foreground rounded-bl-none"
                  )}
                >
                  {message.isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    message.text.split('\n').map((line, index) => (
                        <p key={index} className={index > 0 ? "mt-1" : ""}>{line}</p>
                    ))
                  )}
                </div>
                {message.sender === 'user' && (
                  <Avatar className="h-7 w-7 self-start">
                     <AvatarFallback className="bg-accent text-accent-foreground text-xs"><User className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-2 border-t">
        <div className="w-full space-y-2">
            <div className="flex flex-wrap gap-1.5 px-2">
                {predefinedQueries.map(query => (
                    <Button 
                        key={query} 
                        variant="outline" 
                        size="sm" 
                        className="text-xs h-auto py-1 px-2"
                        onClick={() => handlePredefinedQueryClick(query)}
                        disabled={isAiLoading}
                    >
                        {query}
                    </Button>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="flex items-center space-x-2 w-full">
                <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Finley..."
                className="flex-grow h-10"
                disabled={isAiLoading}
                />
                <Button type="submit" size="icon" className="h-10 w-10" disabled={isAiLoading || !inputValue.trim()}>
                {isAiLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                <span className="sr-only">Send message</span>
                </Button>
            </form>
        </div>
      </CardFooter>
    </Card>
  );
}
