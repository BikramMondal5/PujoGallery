// components/suppress-hydration-warnings.tsx
'use client';

import { useEffect, useState } from 'react';

export function SuppressHydrationWarnings({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    
    // Remove all fdprocessedid attributes after hydration
    const removeProcessedIds = () => {
      const elements = document.querySelectorAll('[fdprocessedid]');
      elements.forEach(el => {
        el.removeAttribute('fdprocessedid');
      });
    };
    
    // Run immediately and also set an interval to catch any newly added elements
    removeProcessedIds();
    const interval = setInterval(removeProcessedIds, 100);
    
    // Override console.error to suppress hydration warnings
    const originalConsoleError = console.error;
    console.error = (...args) => {
      if (
        args[0] && 
        typeof args[0] === 'string' && 
        (args[0].includes('Hydration failed') || 
         args[0].includes('did not match') || 
         args[0].includes('hydrated but some attributes') ||
         args[0].includes('fdprocessedid'))
      ) {
        return;
      }
      originalConsoleError.apply(console, args);
    };
    
    return () => {
      clearInterval(interval);
      console.error = originalConsoleError;
    };
  }, []);
  
  return (
    <>
      <style jsx global>{`
        [fdprocessedid] {
          fdprocessedid: none !important;
        }
        
        /* Additional styles to help with hydration issues */
        input, button, textarea, select {
          fdprocessedid: none !important;
        }
      `}</style>
      {children}
    </>
  );
}
