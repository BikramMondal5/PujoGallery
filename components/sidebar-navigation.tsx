"use client"

import React, { useState, useRef } from "react"
import { Home, ImageIcon, MessageCircle, Search, Settings, ThumbsUp, TrendingUp, User, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { usePosts } from "@/context/PostContext"
import { toast } from "@/hooks/use-toast"
import { useMediaQuery } from "@/hooks/use-mobile"

interface NavItem {
  icon: React.ReactNode
  label: string
  active?: boolean
}

export function SidebarNavigation() {
  const [activeItem, setActiveItem] = useState("Home")
  const [isCreatePostDialogOpen, setIsCreatePostDialogOpen] = useState(false)
  const [postText, setPostText] = useState("")
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null)
  const { addPost, uploadImage, uploadVideo, isUploading } = usePosts()
  const isTablet = useMediaQuery("(max-width: 1024px)")
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  
  const navItems: NavItem[] = [
    { icon: <Home className="h-5 w-5" />, label: "Home" },
    { icon: <Search className="h-5 w-5" />, label: "Explore" },
    { icon: <ImageIcon className="h-5 w-5" />, label: "Create Post" },
    { icon: <TrendingUp className="h-5 w-5" />, label: "Trending" },
    { icon: <User className="h-5 w-5" />, label: "My Posts" },
    { icon: <ThumbsUp className="h-5 w-5" />, label: "Saved" },
    { icon: <Settings className="h-5 w-5" />, label: "Settings" },
  ]
  
  const handleNavItemClick = (label: string) => {
    setActiveItem(label)
    
    if (label === "Create Post") {
      setIsCreatePostDialogOpen(true)
    } else {
      toast({
        title: `${label} view activated`,
        description: `You are now viewing the ${label} section`,
        duration: 2000,
      })
    }
  }
  
  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    try {
      const imageUrl = await uploadImage(file)
      setMediaPreview(imageUrl)
      setMediaType("image")
    } catch (error) {
      toast({
        title: "Error uploading image",
        description: "Please try again",
        variant: "destructive"
      })
    }
  }
  
  const handleVideoClick = () => {
    videoInputRef.current?.click()
  }

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    try {
      const videoUrl = await uploadVideo(file)
      setMediaPreview(videoUrl)
      setMediaType("video")
    } catch (error) {
      toast({
        title: "Error uploading video",
        description: "Please try again",
        variant: "destructive"
      })
    }
  }

  const handleRemoveMedia = () => {
    setMediaPreview(null)
    setMediaType(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (videoInputRef.current) videoInputRef.current.value = ""
  }
  
  const handleCreatePost = () => {
    if (!postText.trim() && !mediaPreview) return
    
    addPost({
      user: {
        name: "Current User",
        image: "hacker.jfif",
        verified: true,
      },
      content: postText,
      ...(mediaType === "image" && mediaPreview ? { image: mediaPreview } : {}),
      ...(mediaType === "video" && mediaPreview ? { video: mediaPreview } : {}),
    })
    
    // Reset form and close dialog
    setPostText("")
    setMediaPreview(null)
    setMediaType(null)
    setIsCreatePostDialogOpen(false)
    setActiveItem("Home") // Navigate back to home after posting
    
    toast({
      title: "Post created!",
      description: "Your post has been published successfully",
    })
  }

  return (
    <>
      <aside
        className={cn(
          "sticky top-20 hidden h-[calc(100vh-5rem)] w-56 flex-col gap-1 self-start md:flex",
          isTablet && "w-14",
        )}
      >
        {navItems.map((item) => (
          <Button 
            key={item.label}
            variant={activeItem === item.label ? "default" : "ghost"} 
            className={cn(
              "justify-start gap-3",
              activeItem === item.label && "bg-[#1976d2] hover:bg-[#1565c0]"
            )}
            onClick={() => handleNavItemClick(item.label)}
          >
            {item.icon}
            {!isTablet && <span>{item.label}</span>}
          </Button>
        ))}
      </aside>
      
      {/* Create Post Dialog */}
      <Dialog open={isCreatePostDialogOpen} onOpenChange={setIsCreatePostDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="flex gap-3">
              <Avatar>
                <AvatarImage src="hacker.jfif" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Share your Puja moment..."
                  className="min-h-[120px] resize-none border-none p-0 focus-visible:ring-0"
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                />
                
                {/* Media preview */}
                {mediaPreview && (
                  <div className="relative mt-3">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-2 top-2 h-6 w-6 rounded-full bg-black/50 text-white hover:bg-black/70"
                      onClick={handleRemoveMedia}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    {mediaType === "image" ? (
                      <img 
                        src={mediaPreview} 
                        alt="Selected media" 
                        className="max-h-[300px] rounded-lg object-cover" 
                      />
                    ) : (
                      <video 
                        src={mediaPreview} 
                        controls
                        className="max-h-[300px] rounded-lg" 
                      />
                    )}
                  </div>
                )}
                
                {/* Hidden file inputs */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <input
                  type="file"
                  ref={videoInputRef}
                  onChange={handleVideoChange}
                  accept="video/*"
                  className="hidden"
                />
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-500 hover:text-[#1976d2]"
                  onClick={handleImageClick}
                  disabled={isUploading}
                >
                  <ImageIcon className="mr-1 h-4 w-4" />
                  Image
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-500 hover:text-[#1976d2]"
                  onClick={handleVideoClick}
                  disabled={isUploading}
                >
                  <MessageCircle className="mr-1 h-4 w-4" />
                  Video
                </Button>
              </div>
              <Button 
                className="bg-[#1976d2] hover:bg-[#1565c0]" 
                disabled={(!postText.trim() && !mediaPreview) || isUploading}
                onClick={handleCreatePost}
                >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Post"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}