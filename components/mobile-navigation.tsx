"use client"

import React, { useState, useRef } from "react"
import { Home, ImageIcon, MessageCircle, Search, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { usePosts } from "@/context/PostContext"
import { toast } from "@/hooks/use-toast"

export function MobileNavigation() {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  const [postText, setPostText] = useState("")
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null)
  const { addPost, uploadImage, uploadVideo, isUploading } = usePosts()
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  
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
        name: "Bikram Mondal",
        image: "my-image.jfif",
        verified: true,
      },
      content: postText,
      ...(mediaType === "image" && mediaPreview ? { image: mediaPreview } : {}),
      ...(mediaType === "video" && mediaPreview ? { video: mediaPreview } : {}),
    })
    
    // Reset form and close drawer
    setPostText("")
    setMediaPreview(null)
    setMediaType(null)
    setIsCreatePostOpen(false)
    
    toast({
      title: "Post created!",
      description: "Your post has been published successfully",
    })
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-white md:hidden">
        <Button variant="ghost" size="icon" className="flex flex-col items-center justify-center">
          <Home className="h-5 w-5" />
          <span className="mt-1 text-[10px]">Home</span>
        </Button>
        <Button variant="ghost" size="icon" className="flex flex-col items-center justify-center">
          <Search className="h-5 w-5" />
          <span className="mt-1 text-[10px]">Search</span>
        </Button>
        <Button
          size="icon"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#1976d2] to-[#42a5f5] text-white shadow-lg"
          onClick={() => setIsCreatePostOpen(true)}
        >
          <ImageIcon className="h-6 w-6" />
          <span className="sr-only">Create Post</span>
        </Button>
        <Button variant="ghost" size="icon" className="flex flex-col items-center justify-center">
          <MessageCircle className="h-5 w-5" />
          <span className="mt-1 text-[10px]">Messages</span>
        </Button>
        <Button variant="ghost" size="icon" className="flex flex-col items-center justify-center">
          <User className="h-5 w-5" />
          <span className="mt-1 text-[10px]">Profile</span>
        </Button>
      </div>

      {/* Mobile Create Post Drawer */}
      <Drawer open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Create Post</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            <div className="flex gap-3">
              <Avatar>
                <AvatarImage src="hacker.jfif" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Share your Puja moment..."
                  className="min-h-[100px] resize-none border-none p-0 focus-visible:ring-0"
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
                        className="max-h-[250px] rounded-lg object-cover" 
                      />
                    ) : (
                      <video 
                        src={mediaPreview} 
                        controls
                        className="max-h-[250px] rounded-lg" 
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
          </div>
          <Separator />
          <div className="flex items-center justify-between p-4">
            <div className="flex gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-col items-center text-gray-500"
                onClick={handleImageClick}
              >
                <ImageIcon className="h-5 w-5" />
                <span className="mt-1 text-[10px]">Image</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-col items-center text-gray-500"
                onClick={handleVideoClick}
              >
                <MessageCircle className="h-5 w-5" />
                <span className="mt-1 text-[10px]">Video</span>
              </Button>
            </div>
          </div>
          <DrawerFooter>
            <Button 
              className="bg-[#1976d2] hover:bg-[#1565c0]"
              disabled={(!postText.trim() && !mediaPreview) || isUploading}
              onClick={handleCreatePost}
            >
              {isUploading ? "Uploading..." : "Post"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
