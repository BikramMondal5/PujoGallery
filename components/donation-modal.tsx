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
  
  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const amount = parseFloat(donationAmount)
    
    // Simulate donation processing
    setTimeout(() => {
      if (amount >= 100) {
        // Verify the user if donation amount is sufficient
        verifyCurrentUser()
        
        toast({
          title: "Thank you for your donation!",
          description: "You've been verified with a badge on your profile.",
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
        
        <div className="mt-4 flex items-center justify-center">
          <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2">
            <BadgeCheck className="h-5 w-5 text-[#1976d2]" />
            <span className="text-sm font-medium text-[#1976d2]">Verification Badge</span>
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
          
          <div className="flex gap-2">
            {[100, 200, 500, 1000].map((amount) => (
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