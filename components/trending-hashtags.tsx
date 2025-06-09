"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import { usePosts, Post } from "@/context/PostContext"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { toast } from "@/hooks/use-toast"

// Helper function to extract hashtags from post content
const extractHashtags = (posts: Post[]): { tag: string; count: number }[] => {
  const hashtagMap = new Map<string, number>()
  
  posts.forEach(post => {
    const regex = /#[\w\u0590-\u05ff\u0621-\u064a\u0660-\u0669]+/g
    const hashtags = post.content.match(regex) || []
    hashtags.forEach(tag => {
      const count = hashtagMap.get(tag) || 0
      hashtagMap.set(tag, count + 1)
    })
  })
  
  // Convert map to array and sort by count
  return Array.from(hashtagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5) // Take top 5
    .map(item => ({
      tag: item.tag,
      count: item.count,
      posts: `${item.count} ${item.count === 1 ? 'post' : 'posts'}`
    }))
}

export function TrendingHashtags() {
  const { posts } = usePosts()
  const router = useRouter()
  const [activeTag, setActiveTag] = useState<string | null>(null)
  
  // Extract hashtags from posts or use defaults if no hashtags found
  const extractedTags = extractHashtags(posts)
  
  const hashtags = extractedTags.length > 0 
    ? extractedTags 
    : [
        { tag: "#Puja2025", count: 12500, posts: "12.5K posts" },
        { tag: "#DurgaVibes", count: 8300, posts: "8.3K posts" },
        { tag: "#PandalHopping", count: 5700, posts: "5.7K posts" },
        { tag: "#BengaliTradition", count: 4200, posts: "4.2K posts" },
        { tag: "#PujoFashion", count: 3900, posts: "3.9K posts" },
      ]

  const handleTagClick = (tag: string) => {
    setActiveTag(tag === activeTag ? null : tag)
    
    // In a real app, this would navigate to a filtered view of posts
    // For now we'll just show a toast
    toast({
      title: "Hashtag selected",
      description: `Viewing posts for ${tag}`,
      duration: 3000,
    })
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-1 text-sm font-medium">
          <TrendingUp className="h-4 w-4 text-[#1976d2]" />
          Trending Hashtags
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {hashtags.map((hashtag) => (
          <Button
            key={hashtag.tag}
            variant="ghost"
            className={`flex w-full items-center justify-between rounded-md px-2 py-1 text-xs hover:bg-gray-100 ${
              activeTag === hashtag.tag ? "bg-gray-100" : ""
            }`}
            onClick={() => handleTagClick(hashtag.tag)}
          >
            <span className={`font-medium ${activeTag === hashtag.tag ? "text-[#1976d2]" : "text-[#1976d2]"}`}>
              {hashtag.tag}
            </span>
            <span className="text-xs text-gray-500">{hashtag.posts}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
