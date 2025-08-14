import { supabase } from './supabase-client';

/**
 * FINAL RLS TESTER - Run this to verify all RLS issues are fixed
 */
export async function finalRLSTest() {
  console.log('========== COMPREHENSIVE RLS TEST ==========');
  console.log('Testing if RLS is properly configured...');
  
  try {
    // STEP 1: Check SELECT access
    console.log('\n📋 TESTING READ ACCESS:');
    const { data: readData, error: readError } = await supabase
      .from('posts')
      .select('id, user_name, content')
      .limit(1);
    
    if (readError) {
      console.error('❌ READ test failed:', readError.message);
    } else {
      console.log('✅ READ test passed. Example data:', readData);
    }
    
    // STEP 2: Test INSERT access
    console.log('\n📝 TESTING INSERT ACCESS:');
    const testPost = {
      user_name: 'RLS Test User',
      user_image: '/placeholder-user.jpg',
      content: 'This post tests if INSERT works with current RLS policies',
      user_verified: false,
      user_badge_type: 'standard',
      type: 'regular',
      likes: 0,
      comments: 0,
      shares: 0,
      is_own_post: true
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('posts')
      .insert([testPost])
      .select();
    
    if (insertError) {
      console.error('❌ INSERT test failed:', insertError.message);
      console.log('   Error details:', JSON.stringify(insertError));
      
      if (insertError.message.includes('row-level security')) {
        console.error('   ⚠️ RLS POLICY ISSUE DETECTED. Please run the complete_rls_fix.sql script.');
        console.log('   🔧 This script will completely reset and configure proper RLS policies.');
      }
    } else {
      console.log('✅ INSERT test passed. Created post with ID:', insertData[0].id);
      
      // STEP 3: Test UPDATE access if insert succeeded
      if (insertData && insertData[0]?.id) {
        console.log('\n✏️ TESTING UPDATE ACCESS:');
        const { data: updateData, error: updateError } = await supabase
          .from('posts')
          .update({ content: 'This post was updated to test RLS UPDATE permissions' })
          .eq('id', insertData[0].id)
          .select();
        
        if (updateError) {
          console.error('❌ UPDATE test failed:', updateError.message);
        } else {
          console.log('✅ UPDATE test passed. Updated content:', updateData[0].content);
        }
        
        // STEP 4: Test DELETE access
        console.log('\n🗑️ TESTING DELETE ACCESS:');
        const { error: deleteError } = await supabase
          .from('posts')
          .delete()
          .eq('id', insertData[0].id);
        
        if (deleteError) {
          console.error('❌ DELETE test failed:', deleteError.message);
        } else {
          console.log('✅ DELETE test passed. Test post was removed.');
        }
      }
    }
    
    // STEP 5: Test storage bucket
    console.log('\n📂 CHECKING STORAGE BUCKET:');
    const { data: bucketData, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.error('❌ Storage bucket check failed:', bucketError.message);
    } else {
      const bucket = bucketData.find(b => b.name === 'pujo_gallery_media');
      if (bucket) {
        console.log('✅ Storage bucket "pujo_gallery_media" exists and is', bucket.public ? 'public' : 'private');
      } else {
        console.error('❌ Storage bucket "pujo_gallery_media" not found! Please create it.');
      }
    }
    
    console.log('\n========== RLS TEST COMPLETE ==========');
    
    // Final verdict
    if (readError || insertError) {
      console.error('\n❌ RLS CONFIGURATION NEEDS FIXING');
      console.log('Please run the complete_rls_fix.sql script in your Supabase SQL Editor');
    } else {
      console.log('\n✅ RLS APPEARS TO BE CORRECTLY CONFIGURED');
      console.log('Your application should now be able to create posts and upload images.');
    }
    
  } catch (error) {
    console.error('Unexpected error during RLS test:', error);
    console.log('Please run the complete_rls_fix.sql script to reset and fix all RLS policies.');
  }
}
