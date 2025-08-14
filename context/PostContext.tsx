"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { 
  supabase,
  fetchPosts, 
  createPost as supabaseCreatePost, 
  updatePostLikes, 
  updatePostShares, 
  deletePostById, 
  addCommentToPost as supabaseAddComment,
  fetchCommentsForPost,
  uploadMedia,
  PostType
} from "@/src/supabase-client"

// Extend the PostType for our use with required fields
export interface Post extends PostType {
  id: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
}

interface PostContextType {
  posts: Post[]
  addPost: (post: Omit<Post, "id" | "timestamp" | "likes" | "comments" | "shares">) => void
  likePost: (id: string) => void
  addComment: (postId: string, comment: { user: { name: string; image: string }; text: string }) => void
  sharePost: (id: string) => void
  deletePost: (id: string) => void
  uploadImage: (file: File) => Promise<string>
  uploadVideo: (file: File) => Promise<string>
  isUploading: boolean
  verifyCurrentUser: (amount: number) => void // Updated to accept donation amount
}

const PostContext = createContext<PostContextType | undefined>(undefined)

export function PostProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load posts from Supabase on mount
  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      try {
        const data = await fetchPosts();
        
        if (data) {
          // Transform the data from Supabase format to our Post format
          const formattedPosts: Post[] = data.map(item => ({
            id: item.id,
            user: {
              name: item.user_name,
              image: item.user_image,
              verified: item.user_verified,
              badgeType: item.user_badge_type
            },
            timestamp: new Date(item.created_at).toLocaleString(),
            content: item.content,
            image: item.image,
            video: item.video,
            type: item.type,
            likes: item.likes,
            comments: item.comments,
            shares: item.shares,
            isOwnPost: item.is_own_post,
          }));
          
          setPosts(formattedPosts);
          
          // Load comments for each post
          formattedPosts.forEach(async (post) => {
            const comments = await fetchCommentsForPost(post.id);
            
            if (comments && comments.length > 0) {
              // Transform comments to our format
              const formattedComments = comments.map(comment => ({
                id: comment.id,
                user: {
                  name: comment.user_name,
                  image: comment.user_image
                },
                text: comment.text
              }));
              
              setPosts(prev => 
                prev.map(p => 
                  p.id === post.id 
                    ? { ...p, commentsList: formattedComments }
                    : p
                )
              );
            }
          });
        } else {
          // If no posts in database, use fallback data
          setPosts([
            {
              id: "2",
              user: {
                name: "Priyanka Mukherjee",
                image: "cat.jpeg",
                verified: false,
                badgeType: 'silver'
              },
              timestamp: "5 hours ago",
              content: "Traditional saree day! Ready for pandal hopping with friends. Durga Maa's blessings to everyone!",
              likes: 87,
              comments: 32,
              shares: 3,
            },
            {
              id: "1",
              user: {
                name: "Bikram Mondal",
                image: "my-image.jfif",
                verified: true,
                badgeType: 'gold'
              },
              timestamp: "2 hours ago",
              content: "Celebrating the first day of Durga Puja with my family! The pandal decorations this year are absolutely stunning. #DurgaPuja2025 #PujoVibes",
              image: "ekdaliya.jpeg",
              likes: 124,
              comments: 18,
              shares: 5,
              commentsList: [
                {
                  id: "c1",
                  user: { name: "Riya Das", image: "/placeholder.svg" },
                  text: "Looking beautiful! Which pandal is this?"
                },
                {
                  id: "c2", 
                  user: { name: "Amit Roy", image: "/placeholder.svg" },
                  text: "The decorations look amazing! 🙏"
                }
              ]
            },
            {
              id: "3",
              user: {
                name: "Rakesh Adak",
                image: "rakesh-bhai.jpg",
                verified: true,
                badgeType: 'diamond'
              },
              timestamp: "Yesterday",
              content: "The dhak beats are in the air! Can't wait for the evening aarti. Who else is visiting Ballygunge Puja today?",
              image: "Maa.jpeg",
              likes: 215,
              comments: 42,
              shares: 12,
            }
          ]);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPosts();
  }, [])

  // Add a new post
  const addPost = async (post: Omit<Post, "id" | "timestamp" | "likes" | "comments" | "shares">) => {
    try {
      const postWithCounts = {
        ...post,
        likes: 0,
        comments: 0,
        shares: 0
      };
      
      const newPostData = await supabaseCreatePost(postWithCounts);
      
      if (newPostData) {
        const newPost: Post = {
          id: newPostData.id,
          user: {
            name: newPostData.user_name,
            image: newPostData.user_image,
            verified: newPostData.user_verified,
            badgeType: newPostData.user_badge_type,
          },
          timestamp: "Just now",
          content: newPostData.content,
          image: newPostData.image,
          video: newPostData.video,
          type: newPostData.type,
          likes: 0,
          comments: 0,
          shares: 0,
          isOwnPost: newPostData.is_own_post,
          commentsList: []
        };
        
        setPosts(prevPosts => {
          // Add new post at the beginning (most recent first)
          return [newPost, ...prevPosts];
        });
      }
    } catch (error) {
      console.error("Error adding post:", error);
    }
  }

  // Like or unlike a post
  const likePost = async (id: string) => {
    // Find the current post
    const currentPost = posts.find(post => post.id === id);
    if (!currentPost) return;
    
    // Check if user already liked this post
    const isLiked = localStorage.getItem(`post-${id}-liked`) === "true";
    
    // Calculate new likes count
    const newLikesCount = isLiked
      ? Math.max(0, currentPost.likes - 1)
      : currentPost.likes + 1;
    
    // Update UI first for better responsiveness
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === id) {
          return { ...post, likes: newLikesCount };
        }
        return post;
      })
    );
    
    // Then update the database
    try {
      await updatePostLikes(id, newLikesCount);
    } catch (error) {
      console.error("Error updating post likes:", error);
      
      // Revert UI change on error
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === id) {
            return { ...post, likes: currentPost.likes };
          }
          return post;
        })
      );
    }
  }

  // Add a comment to a post
  const addComment = async (postId: string, comment: { user: { name: string; image: string }; text: string }) => {
    // Find the current post
    const currentPost = posts.find(post => post.id === postId);
    if (!currentPost) return;
    
    try {
      // Add comment to database
      const commentData = await supabaseAddComment(
        postId, 
        comment, 
        currentPost.comments
      );
      
      if (commentData) {
        const newComment = {
          id: commentData.id,
          user: {
            name: commentData.user_name,
            image: commentData.user_image
          },
          text: commentData.text
        };
        
        // Update UI
        setPosts(prevPosts => 
          prevPosts.map(post => {
            if (post.id === postId) {
              const newCommentsList = post.commentsList 
                ? [...post.commentsList, newComment] 
                : [newComment];
                
              return { 
                ...post, 
                comments: post.comments + 1,
                commentsList: newCommentsList
              };
            }
            return post;
          })
        );
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  }

  // Share a post
  const sharePost = async (id: string) => {
    // Find the current post
    const currentPost = posts.find(post => post.id === id);
    if (!currentPost) return;
    
    const newSharesCount = currentPost.shares + 1;
    
    // Update UI first for better responsiveness
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === id) {
          return { ...post, shares: newSharesCount };
        }
        return post;
      })
    );
    
    // Then update the database
    try {
      await updatePostShares(id, newSharesCount);
    } catch (error) {
      console.error("Error updating post shares:", error);
      
      // Revert UI change on error
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === id) {
            return { ...post, shares: currentPost.shares };
          }
          return post;
        })
      );
    }
  }

  // Delete a post
  const deletePost = async (id: string) => {
    // Update UI first for better responsiveness
    setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
    
    // Then delete from database
    try {
      await deletePostById(id);
    } catch (error) {
      console.error("Error deleting post:", error);
      // Note: We could reload posts from database here on error
    }
  }

  // Verify current user (add verification badge to their posts)
  const verifyCurrentUser = async (amount: number) => {
    let badgeType: 'standard' | 'bronze' | 'silver' | 'gold' | 'diamond' | 'platinum' = 'standard';
    
    // Determine badge type based on donation amount
    if (amount >= 1000) {
      badgeType = 'platinum';  // Platinum - #A0AEC0 - Cool Gray
    } else if (amount >= 700) {
      badgeType = 'diamond';   // Diamond - #00BFFF - Sparkling Sky Blue
    } else if (amount >= 500) {
      badgeType = 'gold';      // Gold - #FFD700 - Royal Gold
    } else if (amount >= 300) {
      badgeType = 'silver';    // Silver - #C0C0C0 - Elegant Silver
    } else if (amount >= 200) {
      badgeType = 'bronze';    // Bronze - #CD7F32 - Classic Bronze
    } else {
      badgeType = 'standard';  // Standard - #E5E4E2 - Soft Silver
    }
    
    // Update posts in the UI
    setPosts(prevPosts => 
      prevPosts.map(post => {
        // Check if this is the current user's post
        if (post.isOwnPost || post.user.name === "Bikram Mondal") {
          return { 
            ...post, 
            user: {
              ...post.user,
              verified: true,
              badgeType
            }
          }
        }
        return post
      })
    );
    
    try {
      // Update all user's posts in the database
      const { error } = await supabase
        .from('posts')
        .update({ 
          user_verified: true,
          user_badge_type: badgeType 
        })
        .or(`is_own_post.eq.true,user_name.eq.Bikram Mondal`);
        
      if (error) {
        console.error('Error updating user verification:', error);
      }
      
      // Store verification status and badge type in localStorage as a fallback
      localStorage.setItem("userVerified", "true");
      localStorage.setItem("userBadgeType", badgeType);
    } catch (error) {
      console.error('Error verifying user:', error);
    }
  }

  // Upload image using Supabase storage
  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    
    try {
      const imageUrl = await uploadMedia(file, 'images');
      return imageUrl || '';
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  }

  // Upload video using Supabase storage
  const uploadVideo = async (file: File): Promise<string> => {
    setIsUploading(true);
    
    try {
      const videoUrl = await uploadMedia(file, 'videos');
      return videoUrl || '';
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  }

  const value = {
    posts,
    addPost,
    likePost,
    addComment,
    sharePost,
    deletePost,
    uploadImage,
    uploadVideo,
    isUploading,
    verifyCurrentUser
  }

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>
}

// Custom hook to use the post context
export function usePosts() {
  const context = useContext(PostContext)
  if (context === undefined) {
    throw new Error("usePosts must be used within a PostProvider")
  }
  return context
}