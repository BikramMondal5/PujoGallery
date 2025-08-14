'use client';

import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ClientSearchInput({ placeholder }: { placeholder: string }) {
  // Use client-side only rendering
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Only render the input on the client
  if (!mounted) return null;
  
  return (
    <div className="relative">
      <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
      <Input 
        className="pl-8" 
        placeholder={placeholder}
        suppressHydrationWarning
      />
    </div>
  );
}
