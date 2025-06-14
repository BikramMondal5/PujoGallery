"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"

// Define the Post type
export interface Post {
  id: string
  user: {
    name: string
    image: string
    verified?: boolean
    badgeType?: 'standard' | 'bronze' | 'silver' | 'gold' | 'diamond' | 'platinum'
  }
  timestamp: string
  content: string
  image?: string
  video?: string
  type?: "blog" | "regular" // New field to differentiate post types
  likes: number
  comments: number
  shares: number
  isOwnPost?: boolean // Add this to track if post belongs to current user
  commentsList?: {
    id: string
    user: {
      name: string
      image: string
    }
    text: string
  }[]
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

  // Load posts from localStorage on mount
  useEffect(() => {
    const savedPosts = localStorage.getItem("pujoGalleryPosts")
    if (savedPosts) {
      // Just parse the posts without special sorting
      const parsedPosts = JSON.parse(savedPosts);
      setPosts(parsedPosts);
    } else {
      // Set initial posts if none exist
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
      ])
    }
  }, [])

  // Save posts to localStorage whenever they change
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem("pujoGalleryPosts", JSON.stringify(posts))
    }
  }, [posts])

  // Add a new post
  const addPost = (post: Omit<Post, "id" | "timestamp" | "likes" | "comments" | "shares">) => {
    const newPost: Post = {
      ...post,
      id: `post-${Date.now()}`,
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      shares: 0,
      commentsList: []
    }
    
    setPosts(prevPosts => {
      // Add new post at the beginning (most recent first)
      return [newPost, ...prevPosts];
    })
  }

  // Like or unlike a post
  const likePost = (id: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === id) {
          // Check if user already liked this post
          const isLiked = localStorage.getItem(`post-${id}-liked`) === "true"
          
          if (isLiked) {
            // If already liked, remove like (-1)
            return { ...post, likes: Math.max(0, post.likes - 1) }
          } else {
            // If not liked yet, add like (+1)
            return { ...post, likes: post.likes + 1 }
          }
        }
        return post
      })
    )
  }

  // Add a comment to a post
  const addComment = (postId: string, comment: { user: { name: string; image: string }; text: string }) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const newComment = {
            id: `comment-${Date.now()}`,
            ...comment
          }
          
          const newCommentsList = post.commentsList 
            ? [...post.commentsList, newComment] 
            : [newComment]
            
          return { 
            ...post, 
            comments: post.comments + 1,
            commentsList: newCommentsList
          }
        }
        return post
      })
    )
  }

  // Share a post
  const sharePost = (id: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === id) {
          return { ...post, shares: post.shares + 1 }
        }
        return post
      })
    )
  }

  // Delete a post
  const deletePost = (id: string) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== id))
  }

  // Verify current user (add verification badge to their posts)
  const verifyCurrentUser = (amount: number) => {
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
    )
    
    // Store verification status and badge type in localStorage
    localStorage.setItem("userVerified", "true");
    localStorage.setItem("userBadgeType", badgeType);
  }

  // Upload image (simulated)
  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true)
    
    // In a real app, we'd upload to a server. Here we're just creating a data URL
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setTimeout(() => {
          setIsUploading(false)
          resolve(e.target?.result as string)
        }, 1500) // Simulate upload delay
      }
      reader.readAsDataURL(file)
    })
  }

  // Upload video (simulated)
  const uploadVideo = async (file: File): Promise<string> => {
    setIsUploading(true)
    
    // In a real app, we'd upload to a server. Here we're just creating a data URL
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setTimeout(() => {
          setIsUploading(false)
          resolve(e.target?.result as string)
        }, 2000) // Simulate upload delay
      }
      reader.readAsDataURL(file)
    })
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