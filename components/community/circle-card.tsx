"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { HapticButton } from "@/components/ui/haptic-button"
import { Users, LogIn } from "lucide-react"
import { toast } from "sonner"
import { joinCircle, leaveCircle } from "@/actions/community"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface CircleProps {
  circle: any
  isJoined?: boolean
  pseudonym?: string
}

export function CircleCard({ circle, isJoined, pseudonym }: CircleProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const router = useRouter()

  const handleJoin = async () => {
    setIsLoading(true)
    const res = await joinCircle(circle.id)
    if (res.success) {
      toast.success(
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-base">You've joined the group! 🎉</span>
          <span className="text-sm opacity-90">Your anonymous name is: <strong className="bg-primary/20 px-1.5 py-0.5 rounded text-primary">"{res.pseudonym}"</strong></span>
        </div>,
        { duration: 5000 }
      )
      router.push(`/dashboard/community/${circle.id}`)
    } else {
      toast.error(res.error || "Failed to join group")
    }
    setIsLoading(false)
  }

  const handleLeave = async () => {
    setIsLeaving(true)
    const res = await leaveCircle(circle.id)
    if (res.success) {
      toast.success("Successfully left the group")
    } else {
      toast.error(res.error || "Failed to leave group")
    }
    setIsLeaving(false)
  }

  const handleEnter = () => {
    router.push(`/dashboard/community/${circle.id}`)
  }

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="relative p-5 rounded-2xl bg-card/60 backdrop-blur-md border border-border/50 shadow-lg overflow-hidden group transition-all"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${circle.color_gradient || 'from-primary/20 to-secondary/20'} rounded-full blur-3xl opacity-40 group-hover:opacity-70 transition-opacity`} />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-background/50 flex items-center justify-center text-2xl shadow-sm border border-border/30">
              {circle.icon || '👥'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {circle.name}
              </h3>
              {circle.is_official && (
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
                  Official
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center text-muted-foreground text-sm font-medium bg-muted/40 px-2 py-1 rounded-md">
            <Users className="w-4 h-4 mr-1.5" />
            {circle.circle_members?.[0]?.count || 0}
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-6 flex-grow leading-relaxed">
          {circle.description}
        </p>

        {isJoined ? (
          <div className="flex flex-col gap-3">
            <div className="text-xs text-center text-muted-foreground bg-muted/30 py-1.5 rounded-md">
              Posting as <span className="font-semibold text-foreground">"{pseudonym}"</span>
            </div>
            <div className="flex gap-2">
              <HapticButton 
                onClick={handleEnter}
                className="flex-[3] bg-secondary/80 hover:bg-secondary text-secondary-foreground"
              >
                Enter Group
              </HapticButton>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isLeaving}
                    className="flex-1 rounded-xl border border-border/50 hover:bg-destructive/10 hover:text-destructive transition-colors"
                    title="Leave Circle"
                  >
                    <LogOut className={`w-4 h-4 ${isLeaving ? 'animate-pulse' : ''}`} />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove you from <span className="font-semibold">"{circle.name}"</span>. 
                      Your pseudonym and history in this group will be removed from your profile.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleLeave}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Leave Group
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ) : (
          <HapticButton 
            onClick={handleJoin} 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary/80 to-primary hover:from-primary hover:to-primary text-primary-foreground font-semibold"
          >
            {isLoading ? (
              <span className="animate-pulse">Joining...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Join Group
              </>
            )}
          </HapticButton>
        )}
      </div>
    </motion.div>
  )
}
