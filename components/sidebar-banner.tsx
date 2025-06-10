"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Button } from "./ui/button"

type SidebarAdContent = {
  id: string
  title: string
  description: string
  imageUrl: string
  linkUrl: string
  ctaText: string
}

// Sample sidebar ads - in a real app, these would come from an API
const sidebarAds: SidebarAdContent[] = [
  {
    id: "side-ad1",
    title: "Puja Photography Workshop",
    description: "Learn to capture the essence of Durga Puja with our expert photographers",
    imageUrl: "/placeholder.jpg",
    linkUrl: "https://example.com/workshop",
    ctaText: "Register Now"
  },
  {
    id: "side-ad2",
    title: "Bengali Cultural Event",
    description: "Celebrate the rich cultural heritage of Bengal",
    imageUrl: "/placeholder.jpg",
    linkUrl: "https://example.com/cultural-event",
    ctaText: "Get Tickets"
  }
]

export function SidebarBanner() {
  const [currentAd, setCurrentAd] = useState<SidebarAdContent>(sidebarAds[0])
  
  // Rotate ads every 45 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd(prevAd => {
        const currentIndex = sidebarAds.findIndex(ad => ad.id === prevAd.id)
        const nextIndex = (currentIndex + 1) % sidebarAds.length
        return sidebarAds[nextIndex]
      })
    }, 45000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="overflow-hidden mb-4 w-full border border-gray-200 shadow-sm">
      <div className="relative w-full h-48">
        <Image 
          src={currentAd.imageUrl} 
          alt={currentAd.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3">
          <h3 className="text-white font-medium text-sm">{currentAd.title}</h3>
        </div>
      </div>
      <CardContent className="p-4">
        <p className="text-sm text-gray-600 mb-3">{currentAd.description}</p>
        <Button 
          size="sm"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          {currentAd.ctaText}
        </Button>
      </CardContent>
    </Card>
  )
}