import { supabase } from './supabase-client';

/**
 * Utility function to check if RLS policies are properly configured
 */
export async function checkRLSPolicies() {
  try {
    console.log('Checking RLS policies...');
    
    // Check if we can read from the posts table
    const { data: readData, error: readError } = await supabase
      .from('posts')
      .select('id')
      .limit(1);
    
    if (readError) {
      console.error('❌ READ access to posts table failed:', readError.message);
    } else {
      console.log('✅ READ access to posts table is working');
    }
    
    // Try creating a test post
    const testPost = {
      user_name: 'RLS Test User',
      user_image: '/placeholder-user.jpg',
      content: 'This is a test post to verify RLS policies.',
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
      console.error('❌ INSERT access to posts table failed:', insertError.message);
      if (insertError.message.includes('row-level security')) {
        console.error('   This is an RLS policy issue. Please run the fix_posts_rls.sql script.');
      }
    } else {
      console.log('✅ INSERT access to posts table is working');
      
      // If we successfully inserted, clean up by deleting the test post
      if (insertData && insertData[0]?.id) {
        const { error: deleteError } = await supabase
          .from('posts')
          .delete()
          .eq('id', insertData[0].id);
        
        if (deleteError) {
          console.error('❌ DELETE access to posts table failed:', deleteError.message);
        } else {
          console.log('✅ DELETE access to posts table is working');
        }
      }
    }
    
    console.log('RLS policy check complete.');
    
  } catch (error: any) {
    console.error('Error checking RLS policies:', error.message || error);
  }
}
