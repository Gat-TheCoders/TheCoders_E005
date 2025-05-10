'use client';

import { useState, useEffect, useCallback } from 'react';

export function useScrollY() {
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    setScrollY(window.pageYOffset);
  }, []);

  useEffect(() => {
    // Ensure this code runs only on the client
    if (typeof window === 'undefined') {
      return;
    }

    window.addEventListener('scroll', handleScroll);
    // Call handler once to set initial scroll position
    handleScroll(); 

    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return scrollY;
}
