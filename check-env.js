// check-env.js - Run this script to check if your environment variables are loaded correctly
console.log('Checking environment variables for Supabase...');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Not set');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Not set');

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.log('\n⚠️ Environment variables are missing or incorrect!');
  console.log('Make sure:');
  console.log('1. You have a .env.local file in your project root');
  console.log('2. The file contains NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY without quotes');
  console.log('3. Your Next.js server has been restarted after updating the .env.local file');
} else {
  console.log('\n✅ Environment variables are correctly set!');
}
