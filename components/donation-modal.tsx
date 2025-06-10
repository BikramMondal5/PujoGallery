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
      return { type: 'platinum', color: 'bg-gradient-to-r from-slate-300 to-slate-500', text: 'text-slate-700', name: 'Platinum' };
    } else if (amount >= 700) {
      return { type: 'diamond', color: 'bg-gradient-to-r from-blue-200 to-indigo-300', text: 'text-blue-700', name: 'Diamond' };
    } else if (amount >= 500) {
      return { type: 'gold', color: 'bg-gradient-to-r from-yellow-200 to-yellow-400', text: 'text-yellow-800', name: 'Gold' };
    } else if (amount >= 300) {
      return { type: 'silver', color: 'bg-gradient-to-r from-gray-200 to-gray-400', text: 'text-gray-700', name: 'Silver' };
    } else if (amount >= 200) {
      return { type: 'bronze', color: 'bg-gradient-to-r from-amber-600 to-amber-800', text: 'text-white', name: 'Bronze' };
    } else {
      return { type: 'standard', color: 'bg-blue-50', text: 'text-[#1976d2]', name: 'Standard' };
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
          <div className={`flex items-center gap-2 rounded-full ${currentBadge.color} px-4 py-2`}>
            <BadgeCheck className={`h-5 w-5 ${currentBadge.text}`} />
            <span className={`text-sm font-medium ${currentBadge.text}`}>{currentBadge.name} Badge</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Your current selection will earn you a {currentBadge.name} badge
          </p>
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Badge Tiers</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-blue-50 p-2 rounded-md">
              <div className="flex items-center gap-1">
                <BadgeCheck className="h-3 w-3 text-[#1976d2]" />
                <span className="font-medium text-[#1976d2]">Standard</span>
              </div>
              <p className="text-gray-600">₹100+</p>
            </div>
            <div className="bg-gradient-to-r from-amber-600 to-amber-800 p-2 rounded-md">
              <div className="flex items-center gap-1">
                <BadgeCheck className="h-3 w-3 text-white" />
                <span className="font-medium text-white">Bronze</span>
              </div>
              <p className="text-gray-200">₹200+</p>
            </div>
            <div className="bg-gradient-to-r from-gray-200 to-gray-400 p-2 rounded-md">
              <div className="flex items-center gap-1">
                <BadgeCheck className="h-3 w-3 text-gray-700" />
                <span className="font-medium text-gray-700">Silver</span>
              </div>
              <p className="text-gray-600">₹300+</p>
            </div>
            <div className="bg-gradient-to-r from-yellow-200 to-yellow-400 p-2 rounded-md">
              <div className="flex items-center gap-1">
                <BadgeCheck className="h-3 w-3 text-yellow-800" />
                <span className="font-medium text-yellow-800">Gold</span>
              </div>
              <p className="text-yellow-800">₹500+</p>
            </div>
            <div className="bg-gradient-to-r from-blue-200 to-indigo-300 p-2 rounded-md">
              <div className="flex items-center gap-1">
                <BadgeCheck className="h-3 w-3 text-blue-700" />
                <span className="font-medium text-blue-700">Diamond</span>
              </div>
              <p className="text-blue-700">₹700+</p>
            </div>
            <div className="bg-gradient-to-r from-slate-300 to-slate-500 p-2 rounded-md">
              <div className="flex items-center gap-1">
                <BadgeCheck className="h-3 w-3 text-slate-700" />
                <span className="font-medium text-slate-700">Platinum</span>
              </div>
              <p className="text-slate-700">₹1000+</p>
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