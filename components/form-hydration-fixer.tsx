'use client';

import { useEffect } from 'react';

export default function FormHydrationFixer() {
  useEffect(() => {
    // This script runs only in the browser after hydration
    // It removes all fdprocessedid attributes from the DOM
    const removeAllFdProcessedIds = () => {
      const elementsWithFdProcessedId = document.querySelectorAll('[fdprocessedid]');
      elementsWithFdProcessedId.forEach(el => {
        el.removeAttribute('fdprocessedid');
      });
    };

    // Run once after hydration
    removeAllFdProcessedIds();

    // Set up a MutationObserver to watch for newly added fdprocessedid attributes
    const observer = new MutationObserver((mutations) => {
      let needsCleanup = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'fdprocessedid') {
          needsCleanup = true;
        }
      });
      
      if (needsCleanup) {
        removeAllFdProcessedIds();
      }
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, { 
      attributes: true, 
      childList: true, 
      subtree: true, 
      attributeFilter: ['fdprocessedid'] 
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything
}
