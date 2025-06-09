"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift, X } from "lucide-react"
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
import { toast } from "@/hooks/use-toast"

export function SponsoredBanner() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [donationAmount, setDonationAmount] = useState("500")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [totalRaised, setTotalRaised] = useState(65000)
  const goalAmount = 100000
  const percentRaised = Math.min((totalRaised / goalAmount) * 100, 100)

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call for donation processing
    setTimeout(() => {
      const amount = parseFloat(donationAmount)
      if (!isNaN(amount)) {
        setTotalRaised(prev => prev + amount)
      }
      
      setIsSubmitting(false)
      setIsDialogOpen(false)
      
      toast({
        title: "Thank you for your donation!",
        description: `You have donated ₹${donationAmount} to support local pandals.`,
        duration: 5000,
      })
      
      setDonationAmount("500")
    }, 1500)
  }

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#1976d2] to-[#42a5f5] pb-2 text-white">
          <CardTitle className="text-sm font-medium">Support Pujo Celebrations</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="mb-3 space-y-2">
            <p className="text-xs">Help fund local pandals and cultural events.</p>
            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div 
                className="h-full bg-gradient-to-r from-[#1976d2] to-[#42a5f5]"
                style={{ width: `${percentRaised}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>₹{totalRaised.toLocaleString()} raised</span>
              <span>₹{goalAmount.toLocaleString()} goal</span>
            </div>
          </div>
          <Button 
            className="w-full bg-[#1976d2] text-xs hover:bg-[#1565c0]"
            onClick={() => setIsDialogOpen(true)}
          >
            <Gift className="mr-1 h-4 w-4" />
            Donate Now
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Make a Donation</DialogTitle>
            <DialogDescription>
              Your contribution helps local pandals and cultural programs during the Durga Pujo festival.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleDonate} className="space-y-4">
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
            </div>
            
            <div className="flex gap-2">
              {[100, 500, 1000, 5000].map((amount) => (
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
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-[#1976d2] hover:bg-[#1565c0]" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Donate"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
