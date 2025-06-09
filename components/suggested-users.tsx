"use client"

import { useState } from "react"
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

  const handleFollow = (userId: string) => {
    setSuggestedUsers(prev => 
      prev.map(user => {
        if (user.id === userId) {
          // Toggle follow status
          const newFollowStatus = !user.followed
          
          // Show toast
          toast({
            title: newFollowStatus ? "User followed" : "User unfollowed",
            description: newFollowStatus 
              ? `You are now following ${user.name}` 
              : `You have unfollowed ${user.name}`,
            duration: 3000,
          })
          
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
                {user.verified && <BadgeCheck className="ml-1 h-3 w-3 text-[#c62828]" />}
              </div>
            </div>
            <Button 
              variant={user.followed ? "default" : "outline"} 
              size="sm" 
              className={`h-7 w-16 text-xs ${user.followed ? "bg-[#c62828] hover:bg-[#b71c1c]" : "border-[#c62828] text-[#c62828] hover:bg-[#c62828]/10"}`}
              onClick={() => handleFollow(user.id)}
            >
              {user.followed ? "Following" : "Follow"}
            </Button>
          </div>
        ))}
        <Button variant="ghost" size="sm" className="w-full text-xs text-[#c62828] hover:bg-[#c62828]/10">
          See More
        </Button>
      </CardContent>
    </Card>
  )
}
