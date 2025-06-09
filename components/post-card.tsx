"use client"

import { useState, useEffect } from "react"
import { BadgeCheck, MoreHorizontal, MessageCircle, Share2, ThumbsUp } from "lucide-react"
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

export function PostCard({ post }: { post: Post }) {
  const { likePost, addComment, sharePost } = usePosts()
  const [liked, setLiked] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")

  // Check if post is liked on mount
  useEffect(() => {
    const isLiked = localStorage.getItem(`post-${post.id}-liked`) === "true"
    setLiked(isLiked)
  }, [post.id])

  const handleLike = () => {
    likePost(post.id)
    setLiked(!liked)
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return

    addComment(post.id, {
      user: { name: "Current User", image: "/placeholder.svg" },
      text: commentText,
    })
    setCommentText("")
  }

  const handleShare = () => {
    sharePost(post.id)
  }

  return (
    <Card className="overflow-hidden rounded-xl border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={post.user.image} alt={post.user.name} />
            <AvatarFallback>{post.user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center">
              <span className="font-semibold">{post.user.name}</span>
              {post.user.verified && <BadgeCheck className="ml-1 h-4 w-4 text-[#c62828]" />}
            </div>
            <p className="text-xs text-gray-500">{post.timestamp}</p>
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
            <DropdownMenuItem className="text-red-600">Report post</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="whitespace-pre-wrap text-sm">{post.content}</p>
        {post.image && (
          <div className="mt-3 overflow-hidden rounded-lg">
            <img src={post.image} alt="Post image" className="h-auto w-full object-cover" />
          </div>
        )}
        {post.video && (
          <div className="mt-3 overflow-hidden rounded-lg">
            <video src={post.video} controls className="h-auto w-full" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col p-0">
        <div className="flex items-center justify-between border-t border-b p-2">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <ThumbsUp className="h-3 w-3 fill-[#c62828] text-[#c62828]" />
            <span>{post.likes}</span>
          </div>
          <div className="flex gap-3 text-xs text-gray-500">
            <button onClick={() => setShowComments(!showComments)} className="hover:underline">
              {post.comments} comments
            </button>
            <span>{post.shares} shares</span>
          </div>
        </div>
        <div className="flex items-center justify-between p-1">
          <Button
            variant="ghost"
            size="sm"
            className={`flex-1 ${liked ? "text-[#c62828]" : "text-gray-600"}`}
            onClick={handleLike}
          >
            <ThumbsUp className={`mr-1 h-4 w-4 ${liked ? "fill-[#c62828]" : ""}`} />
            Like
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-gray-600"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="mr-1 h-4 w-4" />
            Comment
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-gray-600"
            onClick={handleShare}
          >
            <Share2 className="mr-1 h-4 w-4" />
            Share
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
  )
}
