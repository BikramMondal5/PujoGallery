"use client"

import { useState, useEffect } from "react"
import { BadgeCheck, MoreHorizontal, MessageCircle, Share2, ThumbsUp, Trash2, AlertTriangle, Pencil } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePosts, Post } from "@/context/PostContext"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"
import { ShareDialog } from "@/components/share-dialog"

export function PostCard({ post }: { post: Post }) {
  const { likePost, addComment, sharePost, deletePost } = usePosts()
  const [liked, setLiked] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  
  // Helper function to get badge style based on badgeType
  const getBadgeStyle = () => {
    if (!post.user.verified) return '';
    
    switch (post.user.badgeType) {
      case 'platinum':
        return 'text-[#A0AEC0] border-[#A0AEC0]';
      case 'diamond':
        return 'text-[#00BFFF] border-[#00BFFF]';
      case 'gold':
        return 'text-[#FFD700] border-[#FFD700]';
      case 'silver':
        return 'text-[#C0C0C0] border-[#C0C0C0]';
      case 'bronze':
        return 'text-[#CD7F32] border-[#CD7F32]';
      case 'standard':
      default:
        return 'text-[#E5E4E2] border-[#E5E4E2]';
    }
  };
  
  // Check if post is liked on mount
  useEffect(() => {
    const isLiked = localStorage.getItem(`post-${post.id}-liked`) === "true"
    setLiked(isLiked)
  }, [post.id])

  // Check if this is the current user's post (in a real app this would check against user ID)
  const isOwnPost = post.user.name === "Bikram Mondal" || post.isOwnPost
  
  // Check if this is a blog post
  const isBlog = post.type === "blog"

  const handleLike = () => {
    likePost(post.id)
    // Toggle the liked state
    setLiked(!liked)
    
    // Toggle the localStorage state
    if (liked) {
      localStorage.removeItem(`post-${post.id}-liked`)
    } else {
      localStorage.setItem(`post-${post.id}-liked`, "true")
    }
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return

    addComment(post.id, {
      user: { name: "Bikram Mondal", image: "/my-image.jfif" },
      text: commentText,
    })
    setCommentText("")
  }

  const handleShare = () => {
    setShowShareDialog(true)
  }

  const handleDeletePost = () => {
    deletePost(post.id)
    toast({
      title: "Post deleted",
      description: "Your post has been successfully deleted",
      duration: 3000,
    })
  }

  return (
    <>
      <Card className={`overflow-hidden rounded-xl border shadow-sm ${isBlog ? 'border-[#1976d2]/30' : ''}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={post.user.image} alt={post.user.name} />
              <AvatarFallback>{post.user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center">
                <span className="font-semibold">{post.user.name}</span>
                {post.user.verified && (
                  <div className={getBadgeStyle()}>
                    <BadgeCheck className="ml-1 h-4 w-4" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <p className="text-xs text-gray-500">{post.timestamp}</p>
                {isBlog && (
                  <>
                    <span className="text-xs text-gray-500">•</span>
                    <div className="flex items-center rounded-full bg-blue-100 px-2 py-0.5">
                      <Pencil className="mr-1 h-3 w-3 text-[#1976d2]" />
                      <span className="text-xs font-medium text-[#1976d2]">Blog</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Save post</DropdownMenuItem>
              <DropdownMenuItem>Follow {post.user.name}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {isBlog ? (
            <div className="space-y-3">
              <div className="whitespace-pre-wrap text-sm text-gray-700">
                {post.content}
              </div>
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-sm">{post.content}</p>
          )}

          {!isBlog && post.image && (
            <div className="mt-3 overflow-hidden rounded-lg">
              <img src={post.image} alt="Post image" className="h-auto w-full object-cover" />
            </div>
          )}
          {!isBlog && post.video && (
            <div className="mt-3 overflow-hidden rounded-lg">
              <video src={post.video} controls className="h-auto w-full" />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col p-0">
          <div className="flex items-center justify-between p-1">
            <Button
              variant="ghost"
              size="sm"
              className={`flex-1 ${liked ? "text-[#1976d2]" : "text-gray-600"}`}
              onClick={handleLike}
            >
              <ThumbsUp className={`mr-1 h-4 w-4 ${liked ? "fill-[#1976d2]" : ""}`} />
              {liked ? 'Unlike' : 'Like'}
              <span className="ml-1 text-xs">{post.likes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 text-gray-600"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="mr-1 h-4 w-4" />
              Comment
              <span className="ml-1 text-xs">{post.comments}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 text-gray-600"
              onClick={handleShare}
            >
              <Share2 className="mr-1 h-4 w-4" />
              Share
              <span className="ml-1 text-xs">{post.shares}</span>
            </Button>
          </div>

          {showComments && (
            <div className="border-t p-3">
              <div className="mb-3 space-y-3">
                {post.commentsList &&
                  post.commentsList.map((comment) => (
                    <div key={comment.id} className="flex gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={comment.user.image} alt={comment.user.name} />
                        <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="rounded-xl bg-gray-100 p-2">
                        <p className="text-xs font-semibold">{comment.user.name}</p>
                        <p className="text-xs">{comment.text}</p>
                      </div>
                    </div>
                  ))}
              </div>
              <form onSubmit={handleAddComment} className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <Input
                  placeholder="Write a comment..."
                  className="h-8 text-xs"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Button type="submit" size="sm" variant="ghost" className="h-8 px-2 py-0">
                  Post
                </Button>
              </form>
            </div>
          )}
        </CardFooter>
      </Card>
      
      {/* Delete Post Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This post will be permanently deleted from your account and the timeline.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Share Dialog */}
      <ShareDialog 
        post={post}
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
      />
    </>
  )
}
