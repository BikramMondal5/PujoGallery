// scripts/suppress-hydration-errors.js

if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  // Store the original console.error
  const originalConsoleError = console.error;
  
  // Override console.error to filter out hydration warnings
  console.error = (...args) => {
    // Check if this is a hydration warning about fdprocessedid
    if (
      args.length > 0 && 
      typeof args[0] === 'string' && 
      (args[0].includes('Hydration failed') || 
       args[0].includes('hydrated but some attributes') ||
       args[0].includes('fdprocessedid'))
    ) {
      // Skip the warning
      return;
    }
    
    // Call the original console.error for other errors
    originalConsoleError.apply(console, args);
  };
}

export {};
