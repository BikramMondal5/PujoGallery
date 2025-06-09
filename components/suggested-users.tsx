"use client"

import { useState, useEffect, useRef } from "react"
import { BadgeCheck } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

interface SuggestedUser {
  id: string
  name: string
  image: string
  verified: boolean
  followed: boolean
}

export function SuggestedUsers() {
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>(
    [
      { id: "1", name: "Aditya Ghosh", image: "meera.jpg", verified: true, followed: false },
      { id: "2", name: "Meera Chatterjee", image: "profile-pic.jpg", verified: false, followed: false },
      { id: "3", name: "Vikram Sen", image: "hacker.jfif", verified: false, followed: false },
    ]
  )
  
  // Track toast notifications to display after state updates
  const toastRef = useRef<{
    userId: string;
    followed: boolean;
    userName: string;
  } | null>(null)
  
  // Show toast after state update
  useEffect(() => {
    if (toastRef.current) {
      const { followed, userName } = toastRef.current
      
      toast({
        title: followed ? "User followed" : "User unfollowed",
        description: followed 
          ? `You are now following ${userName}` 
          : `You have unfollowed ${userName}`,
        duration: 3000,
      })
      
      toastRef.current = null
    }
  }, [suggestedUsers])

  const handleFollow = (userId: string) => {
    setSuggestedUsers(prev => 
      prev.map(user => {
        if (user.id === userId) {
          // Toggle follow status
          const newFollowStatus = !user.followed
          
          // Store toast info for the useEffect to display
          toastRef.current = {
            userId,
            followed: newFollowStatus,
            userName: user.name
          }
          
          return { ...user, followed: newFollowStatus }
        }
        return user
      })
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Suggested Users</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestedUsers.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex items-center">
                <span className="text-xs font-medium">{user.name}</span>
                {user.verified && <BadgeCheck className="ml-1 h-3 w-3 text-[#1976d2]" />}
              </div>
            </div>
            <Button 
              variant={user.followed ? "default" : "outline"} 
              size="sm" 
              className={`h-7 w-16 text-xs ${user.followed ? "bg-[#1976d2] hover:bg-[#1565c0]" : "border-[#1976d2] text-[#1976d2] hover:bg-[#1976d2]/10"}`}
              onClick={() => handleFollow(user.id)}
            >
              {user.followed ? "Following" : "Follow"}
            </Button>
          </div>
        ))}
        <Button variant="ghost" size="sm" className="w-full text-xs text-[#1976d2] hover:bg-[#1976d2]/10">
          See More
        </Button>
      </CardContent>
    </Card>
  )
}
