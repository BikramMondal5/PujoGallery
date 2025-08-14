'use client';

import { useState } from 'react';
import { testSupabaseConnection } from '@/src/supabase-test';
import { finalRLSTest } from '@/src/final-rls-test';
import { Button } from '@/components/ui/button';

export default function SupabaseTestPage() {
  const [testOutput, setTestOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Capture console logs to display on page
  const runTest = async (testFunction: () => Promise<any>) => {
    setIsRunning(true);
    setTestOutput([]);
    const logs: string[] = [];
    
    // Override console methods to capture output
    const originalLog = console.log;
    const originalError = console.error;
    
    console.log = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      logs.push(message);
      setTestOutput(prev => [...prev, message]);
      originalLog.apply(console, args);
    };
    
    console.error = (...args) => {
      const message = `ERROR: ${args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ')}`;
      logs.push(message);
      setTestOutput(prev => [...prev, message]);
      originalError.apply(console, args);
    };
    
    try {
      await testFunction();
    } catch (error) {
      console.error('Unexpected error:', error);
    }
    
    // Restore console methods
    console.log = originalLog;
    console.error = originalError;
    setIsRunning(false);
  };
  
  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Supabase Connection Tester</h1>
      
      <div className="flex flex-col gap-4 mb-8">
        <div>
          <Button 
            onClick={() => runTest(testSupabaseConnection)} 
            disabled={isRunning}
            className="mr-4"
          >
            {isRunning ? 'Running Test...' : 'Run Full Supabase Test'}
          </Button>
          
          <Button 
            onClick={() => runTest(finalRLSTest)} 
            disabled={isRunning}
            variant="outline"
          >
            {isRunning ? 'Running...' : 'Run RLS Policies Test Only'}
          </Button>
        </div>
        
        <div className="text-sm text-gray-500">
          This will test your Supabase connection and RLS policies to verify everything is working correctly.
        </div>
      </div>
      
      <div className="bg-black text-white p-4 rounded-lg overflow-auto h-[500px]">
        <pre className="whitespace-pre-wrap break-words">
          {testOutput.length > 0 
            ? testOutput.join('\n') 
            : 'Click one of the buttons above to run a test...'}
        </pre>
      </div>
      
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h2 className="font-bold text-lg mb-2">If tests fail with RLS errors:</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Go to your Supabase dashboard SQL Editor</li>
          <li>Run the <code className="bg-gray-100 px-1 rounded">complete_rls_fix.sql</code> script provided in the project folder</li>
          <li>Return here and run the tests again</li>
        </ol>
      </div>
    </div>
  );
}
