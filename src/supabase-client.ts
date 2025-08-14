import { createClient } from '@supabase/supabase-js';
import clientConfig from './client-config';

// Define a generic PostType to avoid circular dependencies
export interface PostType {
  id?: string;
  user: {
    name: string;
    image: string;
    verified?: boolean;
    badgeType?: 'standard' | 'bronze' | 'silver' | 'gold' | 'diamond' | 'platinum';
  };
  timestamp?: string;
  content: string;
  image?: string;
  video?: string;
  type?: "blog" | "regular";
  likes?: number;
  comments?: number;
  shares?: number;
  isOwnPost?: boolean;
  commentsList?: {
    id: string;
    user: {
      name: string;
      image: string;
    };
    text: string;
  }[];
}

// Try to use environment variables first, fallback to client config
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || clientConfig.supabaseUrl;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || clientConfig.supabaseAnonKey;

// Create Supabase client
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

// Posts related functions
export async function fetchPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching posts:', error);
    return null;
  }
  
  return data;
}

export async function createPost(post: Omit<PostType, 'id' | 'timestamp'>) {
  try {
    console.log('Creating post with data:', JSON.stringify({
      user_name: post.user.name,
      content: post.content,
      type: post.type || 'regular'
    }));

    // First check if RLS is enabled
    const { data: rlsCheck, error: rlsError } = await supabase
      .from('posts')
      .select('count(*)', { count: 'exact', head: true });
    
    if (rlsError) {
      console.error('RLS check error:', rlsError);
      if (rlsError.message.includes('permission denied')) {
        console.error('RLS is preventing read access. Please check RLS policies.');
      }
    } else {
      console.log('RLS check passed for read access');
    }
    
    // Attempt to insert the post with detailed error logging
    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          user_name: post.user.name,
          user_image: post.user.image,
          user_verified: post.user.verified || false,
          user_badge_type: post.user.badgeType || 'standard',
          content: post.content,
          image: post.image || null,
          video: post.video || null,
          type: post.type || 'regular',
          likes: post.likes || 0,
          comments: post.comments || 0,
          shares: post.shares || 0,
          is_own_post: post.isOwnPost || false,
        }
      ])
      .select();
    
    if (error) {
      console.error('Error creating post:', error);
      if (error.message.includes('row-level security')) {
        console.error('RLS policy is preventing INSERT. Please update your RLS policies.');
      }
      throw new Error(`Error creating post: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      throw new Error('No data returned after creating post');
    }
    
    console.log('Post created successfully:', data[0]);
    return data[0];
  } catch (error: any) {
    console.error('Exception creating post:', error);
    // Make sure we have a proper error object with message
    if (typeof error === 'object' && error !== null) {
      throw new Error(`Error creating post: ${error.message || JSON.stringify(error)}`);
    } else {
      throw new Error(`Error creating post: ${error}`);
    }
  }
}

export async function updatePostLikes(postId: string, likesCount: number) {
  const { error } = await supabase
    .from('posts')
    .update({ likes: likesCount })
    .eq('id', postId);
    
  if (error) {
    console.error('Error updating post likes:', error);
    return false;
  }
  
  return true;
}

export async function updatePostShares(postId: string, sharesCount: number) {
  const { error } = await supabase
    .from('posts')
    .update({ shares: sharesCount })
    .eq('id', postId);
    
  if (error) {
    console.error('Error updating post shares:', error);
    return false;
  }
  
  return true;
}

export async function deletePostById(postId: string) {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId);
    
  if (error) {
    console.error('Error deleting post:', error);
    return false;
  }
  
  return true;
}

export async function addCommentToPost(
  postId: string, 
  comment: { 
    user: { name: string; image: string }; 
    text: string 
  },
  currentCommentCount: number
) {
  // First, add the comment to the comments table
  const { data: commentData, error: commentError } = await supabase
    .from('comments')
    .insert([
      {
        post_id: postId,
        user_name: comment.user.name,
        user_image: comment.user.image,
        text: comment.text
      }
    ])
    .select();
  
  if (commentError) {
    console.error('Error adding comment:', commentError);
    return null;
  }
  
  // Then update the comments count in the post
  const { error: updateError } = await supabase
    .from('posts')
    .update({ comments: currentCommentCount + 1 })
    .eq('id', postId);
  
  if (updateError) {
    console.error('Error updating comment count:', updateError);
    return null;
  }
  
  return commentData[0];
}

export async function fetchCommentsForPost(postId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching comments:', error);
    return null;
  }
  
  return data;
}

export async function uploadMedia(file: File, folder: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  // First, check if the bucket exists
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  
  if (bucketsError) {
    console.error('Error checking buckets:', bucketsError);
    throw new Error('Could not check storage buckets');
  }
  
  const bucketExists = buckets?.some(b => b.name === 'pujo_gallery_media');
  
  if (!bucketExists) {
    // Try to create the bucket if it doesn't exist
    try {
      const { data: createBucketData, error: createBucketError } = await supabase.storage.createBucket(
        'pujo_gallery_media', 
        { public: true }
      );
      
      if (createBucketError) {
        console.error('Error creating bucket:', createBucketError);
        throw new Error('Could not create storage bucket');
      }
      
      console.log('Created bucket:', createBucketData);
    } catch (e) {
      console.error('Exception creating bucket:', e);
      throw new Error('Failed to create storage bucket');
    }
  }

  // Now try to upload the file
  const { data, error } = await supabase.storage
    .from('pujo_gallery_media')
    .upload(filePath, file);

  if (error) {
    console.error('Error uploading file:', error);
    throw new Error(`Error uploading file: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('pujo_gallery_media')
    .getPublicUrl(filePath);

  return publicUrl;
}
