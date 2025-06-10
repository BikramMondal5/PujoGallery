"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import Image from "next/image"
import { Button } from "./ui/button"

type AdContent = {
  id: string
  title: string
  description: string
  imageUrl: string
  linkUrl: string
}

// Sample ad content - in a real app, this would come from an API
const sampleAds: AdContent[] = [
  {
    id: "ad1",
    title: "Durga Puja Festival Special",
    description: "Exclusive discounts on traditional attire",
    imageUrl: "/placeholder.jpg",
    linkUrl: "https://example.com/festival-special"
  },
  {
    id: "ad2",
    title: "Pandal Photography Contest",
    description: "Win prizes for your best shots",
    imageUrl: "/placeholder.jpg", 
    linkUrl: "https://example.com/photo-contest"
  },
  {
    id: "ad3",
    title: "Bengali Cuisine Festival",
    description: "Explore the flavors of Bengal",
    imageUrl: "/placeholder.jpg",
    linkUrl: "https://example.com/cuisine-festival"
  }
]

export function TrendingHashtags() {
  // Keeping the same component name for backward compatibility
  const [currentAd, setCurrentAd] = useState<AdContent>(sampleAds[0])
  
  // Rotate ads every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd(prevAd => {
        const currentIndex = sampleAds.findIndex(ad => ad.id === prevAd.id)
        const nextIndex = (currentIndex + 1) % sampleAds.length
        return sampleAds[nextIndex]
      })
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const handleAdClick = () => {
    // In a real app, you would track ad clicks here
    console.log(`Ad clicked: ${currentAd.title}`)
    // Could open in a new tab with window.open(currentAd.linkUrl, '_blank')
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <CardTitle className="flex items-center gap-1 text-sm font-medium">
          <ExternalLink className="h-4 w-4" />
          Sponsored
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative w-full h-48">
          <Image 
            src={currentAd.imageUrl} 
            alt={currentAd.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-bold text-base">{currentAd.title}</h3>
          <p className="text-sm text-gray-500 mt-2">{currentAd.description}</p>
          <Button 
            variant="link" 
            className="text-blue-500 p-0 h-auto text-sm mt-3"
            onClick={handleAdClick}
          >
            Learn more
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
