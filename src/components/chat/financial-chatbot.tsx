'use client';

import { useState, useEffect } from 'react';
import { FinancialChatbotButton } from './financial-chatbot-button';
import { FinancialChatbotWindow } from './financial-chatbot-window';

export function FinancialChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure this runs only on client after hydration
  }, []);


  const toggleChatbot = () => {
    setIsOpen(prev => !prev);
  };

  if (!isClient) {
    // Render nothing or a placeholder on the server to avoid hydration mismatch for FAB fixed positioning
    return null; 
  }

  return (
    <>
      <FinancialChatbotButton isOpen={isOpen} onClick={toggleChatbot} />
      <FinancialChatbotWindow isOpen={isOpen} onClose={toggleChatbot} />
    </>
  );
}
