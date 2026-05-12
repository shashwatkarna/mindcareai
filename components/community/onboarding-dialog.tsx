"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Users, ShieldCheck, HeartPulse, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export function CommunityOnboarding() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const hasSeenOnboarding = localStorage.getItem("mindcare_community_onboarded")
    if (!hasSeenOnboarding) {
      // Small delay to let the page load before popping up
      const timer = setTimeout(() => setIsOpen(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem("mindcare_community_onboarded", "true")
  }

  if (!mounted) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Don't allow closing by clicking outside during onboarding, force them to read
      if (!open) handleClose()
    }}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl">
        <DialogHeader className="text-center sm:text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-2 animate-bounce-slow">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-primary">
            Welcome to the Community!
          </DialogTitle>
          <DialogDescription className="text-base text-foreground/80">
            A safe, supportive space to build healthy habits together.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-start gap-4"
          >
            <div className="mt-1 bg-blue-500/10 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Join Challenges</h4>
              <p className="text-sm text-muted-foreground mt-1">Enroll in shared goals like 7-Day Gratitude or Digital Detox. Check in daily to track progress!</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-start gap-4"
          >
            <div className="mt-1 bg-pink-500/10 p-2 rounded-lg">
              <HeartPulse className="w-5 h-5 text-pink-500" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Send Nudges</h4>
              <p className="text-sm text-muted-foreground mt-1">Send pre-set emojis (🔥 👏 💪) to cheer on your peers without the pressure of typing messages.</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-start gap-4"
          >
            <div className="mt-1 bg-emerald-500/10 p-2 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">100% Private & Safe</h4>
              <p className="text-sm text-muted-foreground mt-1">No DMs, no full names. Others only see your first name and your challenge progress. Zero toxicity.</p>
            </div>
          </motion.div>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button 
            type="button" 
            size="lg"
            className="w-full text-lg font-semibold bg-gradient-to-r from-pink-500 to-primary hover:opacity-90 hover:scale-[1.02] transition-all"
            onClick={handleClose}
          >
            Got it, let&apos;s go! 🚀
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
