"use client"

import { useState, useRef } from "react"
import { Bell, ImageIcon, MessageCircle, Search, Video, X, Loader2, Pencil, Gift } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useMediaQuery } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { MobileNavigation } from "@/components/mobile-navigation"
import { PostCard } from "@/components/post-card"
import { SuggestedUsers } from "@/components/suggested-users"
import { TrendingHashtags } from "@/components/trending-hashtags"
import { UserDropdown } from "@/components/user-dropdown"
import { usePosts } from "@/context/PostContext"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { RichTextEditor } from "@/components/rich-text-editor"
import { DonationModal } from "@/components/donation-modal"

export default function PujoGallery() {
  const { posts, addPost, isUploading, uploadImage, uploadVideo } = usePosts()
  const [postText, setPostText] = useState("")
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null)
  const [blogMode, setBlogMode] = useState(false) // New state for blog post mode
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")

  // Handle Image Selection
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
  
  // Handle Video Selection
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

  // Remove Media Preview
  const handleRemoveMedia = () => {
    setMediaPreview(null)
    setMediaType(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (videoInputRef.current) videoInputRef.current.value = ""
  }

  // Toggle blog post mode
  const toggleBlogMode = () => {
    setBlogMode(!blogMode)
    // If transitioning to blog mode, clear any media
    if (!blogMode) {
      setMediaPreview(null)
      setMediaType(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
      if (videoInputRef.current) videoInputRef.current.value = ""
    }
    
    // Focus on the textarea after toggling blog mode
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }, 0)
  }
  
  // Format text functions
  const formatText = (formatType: string) => {
    if (!textareaRef.current) return
    
    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = postText.substring(start, end)
    
    let formattedText = ""
    let cursorPos = 0
    
    switch (formatType) {
      case 'bold':
        formattedText = postText.substring(0, start) + `**${selectedText}**` + postText.substring(end)
        cursorPos = end + 4
        break
      case 'italic':
        formattedText = postText.substring(0, start) + `*${selectedText}*` + postText.substring(end)
        cursorPos = end + 2
        break
      case 'unorderedList':
        formattedText = postText.substring(0, start) + `- ${selectedText}` + postText.substring(end)
        cursorPos = end + 2
        break
      case 'orderedList':
        formattedText = postText.substring(0, start) + `1. ${selectedText}` + postText.substring(end)
        cursorPos = end + 3
        break
      case 'link':
        formattedText = postText.substring(0, start) + `[${selectedText}](url)` + postText.substring(end)
        cursorPos = end + 7
        break
      case 'mention':
        formattedText = postText.substring(0, start) + `@${selectedText}` + postText.substring(end)
        cursorPos = end + 1
        break
      case 'quote':
        formattedText = postText.substring(0, start) + `> ${selectedText}` + postText.substring(end)
        cursorPos = end + 2
        break
      case 'code':
        formattedText = postText.substring(0, start) + `\`${selectedText}\`` + postText.substring(end)
        cursorPos = end + 2
        break
      case 'formula':
        formattedText = postText.substring(0, start) + `$${selectedText}$` + postText.substring(end)
        cursorPos = end + 2
        break
      case 'heading1':
        formattedText = postText.substring(0, start) + `# ${selectedText}` + postText.substring(end)
        cursorPos = end + 2
        break
      case 'heading2':
        formattedText = postText.substring(0, start) + `## ${selectedText}` + postText.substring(end)
        cursorPos = end + 3
        break
      case 'heading3':
        formattedText = postText.substring(0, start) + `### ${selectedText}` + postText.substring(end)
        cursorPos = end + 4
        break
    }
    
    setPostText(formattedText)
    
    // Set cursor position after formatting
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        if (selectedText) {
          textareaRef.current.setSelectionRange(start, cursorPos)
        } else {
          textareaRef.current.setSelectionRange(cursorPos, cursorPos)
        }
      }
    }, 0)
  }
  
  // Handle Post Creation
  const handleCreatePost = () => {
    if (!postText.trim() && !mediaPreview) return
    
    // If in blog mode, add post as a blog
    addPost({
      user: {
        name: "Bikram Mondal",
        image: "/my-image.jfif", // Using the user's profile image
        verified: true,
      },
      content: postText,
      ...(mediaType === "image" && mediaPreview ? { image: mediaPreview } : {}),
      ...(mediaType === "video" && mediaPreview ? { video: mediaPreview } : {}),
      ...(blogMode ? { type: "blog" } : {}), // Add type: blog if in blog mode
    })
    
    // Reset form
    setPostText("")
    setMediaPreview(null)
    setMediaType(null)
    setBlogMode(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (videoInputRef.current) videoInputRef.current.value = ""
    
    toast({
      title: blogMode ? "Blog post created!" : "Post created!",
      description: blogMode ? "Your blog post has been published successfully" : "Your post has been published successfully",
    })
  }

  return (
    <div className="min-h-screen bg-[#f7fafd]">
      <Toaster />
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm md:px-6">
        <div className="flex items-center">
          <div className="flex items-center">
            <img 
              src="/Logo.jpeg" 
              alt="Pujo Gallery Logo" 
              className="mr-2 h-10 w-auto rounded-full object-cover"
            />
            <h1 className="hidden text-xl font-bold text-[#1976d2] md:block">Pujo Gallery</h1>
          </div>
        </div>

        <div className="relative mx-4 hidden flex-1 max-w-md md:block">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input className="pl-8" placeholder="Search moments, users, hashtags..." />
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size={isMobile ? "icon" : "sm"}
            className="border-[#1976d2] text-[#1976d2] hover:bg-[#1976d2] hover:text-white"
            onClick={() => setIsDonationModalOpen(true)}
          >
            <Gift className={`${!isMobile && "mr-2"} h-4 w-4`} />
            {!isMobile && "Donate & Get Verified"}
          </Button>
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#1976d2]"></span>
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="ghost" size="icon">
            <MessageCircle className="h-5 w-5" />
            <span className="sr-only">Messages</span>
          </Button>
          <UserDropdown />
        </div>
      </header>

      <div className="container mx-auto flex max-w-7xl gap-4 px-4 py-4 md:px-6">
        {/* Left Sidebar - Desktop Only */}
        {!isMobile && <SidebarNavigation />}

        {/* Main Feed */}
        <main className="flex-1 space-y-4">
          {/* Post Composer */}
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex gap-3">
              <Avatar>
                <AvatarImage src="/my-image.jfif" alt="Bikram Mondal" />
                <AvatarFallback>BM</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                {blogMode ? (
                  <RichTextEditor 
                    value={postText}
                    onChange={(value) => setPostText(value)}
                    placeholder="Write your blog post here..."
                    minHeight="200px"
                  />
                ) : (
                  <Textarea
                    ref={textareaRef}
                    placeholder="Share your Puja moment..."
                    className="resize-none border-none p-0 focus-visible:ring-0 min-h-[80px]"
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                  />
                )}
                
                {/* Media preview section - only show if not in blog mode */}
                {!blogMode && mediaPreview && (
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
                
                <Separator className="my-3" />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button 
                      variant={blogMode ? "default" : "ghost"}
                      size="sm" 
                      className={`${blogMode ? 'bg-[#1976d2] text-white' : 'text-gray-500 hover:text-[#1976d2]'}`}
                      onClick={toggleBlogMode}
                    >
                      <Pencil className="mr-1 h-4 w-4" />
                      Blog
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-500 hover:text-[#1976d2]"
                      onClick={handleImageClick}
                      disabled={blogMode || isUploading}
                    >
                      <ImageIcon className="mr-1 h-4 w-4" />
                      Image
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-500 hover:text-[#1976d2]"
                      onClick={handleVideoClick}
                      disabled={blogMode || isUploading}
                    >
                      <Video className="mr-1 h-4 w-4" />
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
                      blogMode ? "Publish Blog" : "Post"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Feed Posts */}
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </main>

        {/* Right Sidebar - Desktop Only */}
        {!isMobile && !isTablet && (
          <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] w-72 flex-col gap-4 self-start overflow-auto lg:flex">
            <SuggestedUsers />
            <TrendingHashtags />
          </aside>
        )}
      </div>

      {/* Mobile Navigation */}
      {isMobile && <MobileNavigation />}
      
      {/* Donation Modal */}
      <DonationModal 
        open={isDonationModalOpen} 
        onOpenChange={setIsDonationModalOpen} 
      />
    </div>
  )
}
