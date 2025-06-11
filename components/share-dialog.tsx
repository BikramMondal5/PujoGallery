"use client"

import { useState } from "react"
import { Facebook, Link, Mail, MessageCircle, Twitter, Copy, CheckCircle2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { usePosts, Post } from "@/context/PostContext"

interface ShareDialogProps {
  post: Post
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShareDialog({ post, open, onOpenChange }: ShareDialogProps) {
  const { sharePost } = usePosts()
  const [copied, setCopied] = useState(false)
  
  // Generate a unique shareable link for the post
  const postLink = `https://pujogallery.com/posts/${post.id}`
  
  // Handle copy link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(postLink).then(() => {
      setCopied(true)
      sharePost(post.id) // Increment share count
      
      toast({
        title: "Link copied!",
        description: "Share link has been copied to your clipboard",
        duration: 3000,
      })
      
      // Reset copied state after a while
      setTimeout(() => setCopied(false), 3000)
    })
  }
  
  // Handle direct shares to social media
  const handleSocialShare = (platform: string) => {
    let shareUrl = ""
    const postTitle = `Check out ${post.user.name}'s post on Pujo Gallery!`
    const encodedLink = encodeURIComponent(postLink)
    const encodedTitle = encodeURIComponent(postTitle)
    
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedLink}`
        break
      case "email":
        shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedLink}`
        break
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodedTitle} ${encodedLink}`
        break
    }
    
    // Open share URL in a new window
    if (shareUrl) {
      window.open(shareUrl, "_blank")
      sharePost(post.id) // Increment share count
      onOpenChange(false) // Close dialog after sharing
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Post</DialogTitle>
          <DialogDescription>
            Share this post with your friends and family through various platforms
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="social" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="link">Copy Link</TabsTrigger>
          </TabsList>
          
          <TabsContent value="social" className="mt-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center gap-2 h-20"
                onClick={() => handleSocialShare("facebook")}
              >
                <Facebook className="h-6 w-6 text-blue-600" />
                Facebook
              </Button>
              
              <Button 
                variant="outline"
                className="flex flex-col items-center justify-center gap-2 h-20"
                onClick={() => handleSocialShare("twitter")}
              >
                <Twitter className="h-6 w-6 text-blue-400" />
                Twitter
              </Button>
              
              <Button 
                variant="outline"
                className="flex flex-col items-center justify-center gap-2 h-20"
                onClick={() => handleSocialShare("email")}
              >
                <Mail className="h-6 w-6 text-gray-500" />
                Email
              </Button>
              
              <Button 
                variant="outline"
                className="flex flex-col items-center justify-center gap-2 h-20"
                onClick={() => handleSocialShare("whatsapp")}
              >
                <MessageCircle className="h-6 w-6 text-green-500" />
                WhatsApp
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="link" className="mt-4">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <Input 
                  value={postLink}
                  readOnly
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleCopyLink}
                  className="h-10 w-10"
                >
                  {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              
              {post.image && (
                <div className="rounded-md border overflow-hidden">
                  <img src={post.image} alt="Post preview" className="aspect-video object-cover w-full" />
                </div>
              )}
              
              <div className="rounded-md border p-4 text-sm">
                <p className="font-semibold">{post.user.name}</p>
                <p className="text-gray-500 line-clamp-2">{post.content}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}