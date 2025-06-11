"use client"

import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge, BadgeCheck, Gift, Loader2 } from "lucide-react"
import { usePosts } from "@/context/PostContext"
import { toast } from "@/hooks/use-toast"

interface DonationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DonationModal({ open, onOpenChange }: DonationModalProps) {
  const [donationAmount, setDonationAmount] = useState("100")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { verifyCurrentUser } = usePosts()
  
  // Helper function to get badge info based on donation amount
  const getBadgeInfo = (amount: number) => {
    if (amount >= 1000) {
      return { type: 'platinum', iconColor: 'text-[#A0AEC0]', name: 'Platinum' };
    } else if (amount >= 700) {
      return { type: 'diamond', iconColor: 'text-[#00BFFF]', name: 'Diamond' };
    } else if (amount >= 500) {
      return { type: 'gold', iconColor: 'text-[#FFD700]', name: 'Gold' };
    } else if (amount >= 300) {
      return { type: 'silver', iconColor: 'text-[#C0C0C0]', name: 'Silver' };
    } else if (amount >= 200) {
      return { type: 'bronze', iconColor: 'text-[#CD7F32]', name: 'Bronze' };
    } else {
      return { type: 'standard', iconColor: 'text-[#E5E4E2]', name: 'Standard' };
    }
  };
  
  const currentBadge = getBadgeInfo(parseFloat(donationAmount) || 0);
  
  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const amount = parseFloat(donationAmount)
    
    // Simulate donation processing
    setTimeout(() => {
      if (amount >= 100) {
        // Verify the user if donation amount is sufficient
        verifyCurrentUser(amount)
        
        const badgeInfo = getBadgeInfo(amount);
        
        toast({
          title: "Thank you for your donation!",
          description: `You've been verified with a ${badgeInfo.name} badge on your profile.`,
          duration: 5000,
        })
        
        onOpenChange(false)
      } else {
        toast({
          title: "Minimum donation required",
          description: "Please donate a minimum of ₹100 to get verified.",
          variant: "destructive",
          duration: 3000,
        })
      }
      
      setIsSubmitting(false)
    }, 1500)
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] border border-gray-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-[#1976d2]" />
            Donate & Get Verified
          </DialogTitle>
          <DialogDescription>
            Support Puja celebrations and get a verification badge on your profile.
          </DialogDescription>
        </DialogHeader>
        
        {/* Badge preview section */}
        <div className="mt-4 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 rounded-full border px-4 py-2">
            <BadgeCheck className={`h-5 w-5 ${currentBadge.iconColor}`} />
            <span className="text-sm font-medium text-gray-700">{currentBadge.name} Badge</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Your current selection will earn you a {currentBadge.name} badge
          </p>
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Badge Tiers</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-[#E5E4E2] p-2 rounded-md">
              <div className="flex items-center gap-1">
                <BadgeCheck className="h-3 w-3 text-gray-700" />
                <span className="font-medium text-gray-700">Standard</span>
              </div>
              <p className="text-gray-700">₹100+</p>
            </div>
            <div className="bg-[#CD7F32] p-2 rounded-md">
              <div className="flex items-center gap-1">
                <BadgeCheck className="h-3 w-3 text-white" />
                <span className="font-medium text-white">Bronze</span>
              </div>
              <p className="text-white">₹200+</p>
            </div>
            <div className="bg-[#C0C0C0] p-2 rounded-md">
              <div className="flex items-center gap-1">
                <BadgeCheck className="h-3 w-3 text-gray-700" />
                <span className="font-medium text-gray-700">Silver</span>
              </div>
              <p className="text-gray-600">₹300+</p>
            </div>
            <div className="bg-[#FFD700] p-2 rounded-md">
              <div className="flex items-center gap-1">
                <BadgeCheck className="h-3 w-3 text-yellow-800" />
                <span className="font-medium text-yellow-800">Gold</span>
              </div>
              <p className="text-yellow-800">₹500+</p>
            </div>
            <div className="bg-[#00BFFF] p-2 rounded-md">
              <div className="flex items-center gap-1">
                <BadgeCheck className="h-3 w-3 text-white" />
                <span className="font-medium text-white">Diamond</span>
              </div>
              <p className="text-white">₹700+</p>
            </div>
            <div className="bg-[#A0AEC0] p-2 rounded-md">
              <div className="flex items-center gap-1">
                <BadgeCheck className="h-3 w-3 text-gray-700" />
                <span className="font-medium text-gray-700">Platinum</span>
              </div>
              <p className="text-gray-700">₹1000+</p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleDonate} className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Donation Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              min="100"
              required
            />
            <p className="text-xs text-gray-500">Minimum donation of ₹100 required for verification.</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {[100, 200, 300, 500, 700, 1000].map((amount) => (
              <Button
                key={amount}
                type="button"
                variant={donationAmount === String(amount) ? "default" : "outline"}
                size="sm"
                onClick={() => setDonationAmount(String(amount))}
                className={donationAmount === String(amount) ? "bg-[#1976d2] hover:bg-[#1565c0]" : ""}
              >
                ₹{amount}
              </Button>
            ))}
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-[#1976d2] hover:bg-[#1565c0]" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Donate & Get Verified"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}