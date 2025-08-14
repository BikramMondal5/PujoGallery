import { supabase } from './supabase-client';
import { checkRLSPolicies } from './rls-checker';
import { finalRLSTest } from './final-rls-test';

/**
 * Test function to check Supabase connection and posts table
 */
export async function testSupabaseConnection() {
  // First, verify environment variables
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Not set');
  console.log('Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Not set');
  
  try {
    // We can't directly access the protected properties of the Supabase client
    console.log('Using Supabase client instance:', supabase ? '✓ Created' : '✗ Not created');
    
    // Test general connection
    const { data: connectionTest, error: connectionError } = await supabase.from('posts').select('count', { count: 'exact', head: true });
    
    if (connectionError) {
      console.error('❌ Supabase connection error:', connectionError.message);
      return false;
    }
    
    console.log('✅ Successfully connected to Supabase!');
    
    // Check RLS policies with the comprehensive final test
    console.log('Checking Row-Level Security (RLS) policies...');
    await finalRLSTest();
    
    // Test creating a test post
    const testPost = {
      user_name: 'Test User',
      user_image: '/placeholder-user.jpg',
      content: 'This is a test post to verify the Supabase connection.',
      user_verified: false,
      user_badge_type: 'standard',
      type: 'regular',
      likes: 0,
      comments: 0,
      shares: 0,
      is_own_post: false
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('posts')
      .insert([testPost])
      .select();
    
    if (insertError) {
      console.error('❌ Failed to create test post:', insertError.message);
      if (insertError.message.includes('row-level security')) {
        console.error('   ⚠️ This is an RLS policy issue. Run the fix_posts_rls.sql script in Supabase SQL Editor.');
      }
      return false;
    }
    
    console.log('✅ Successfully created test post!', insertData);
    
    // Delete the test post we just created
    if (insertData && insertData[0]?.id) {
      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', insertData[0].id);
      
      if (deleteError) {
        console.error('❌ Failed to clean up test post:', deleteError.message);
      } else {
        console.log('✅ Successfully cleaned up test post!');
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Unexpected error during Supabase test:', error);
    return false;
  }
}
