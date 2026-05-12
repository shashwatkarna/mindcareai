"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, PlayCircle, Users } from "lucide-react"
import { toast } from "sonner"
import { enrollInChallenge, checkInChallenge } from "@/actions/community"
// Import the ParticipantList component
import { ParticipantList } from "./participant-list"

interface ChallengeProps {
  challenge: any
  enrollment?: any
}

export function ChallengeCard({ challenge, enrollment }: ChallengeProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)

  const handleEnroll = async () => {
    setIsLoading(true)
    const res = await enrollInChallenge(challenge.id)
    if (res.success) {
      toast.success(`Joined ${challenge.title}!`)
    } else {
      toast.error(res.error || "Failed to join")
    }
    setIsLoading(false)
  }

  const handleCheckIn = async () => {
    setIsLoading(true)
    const res = await checkInChallenge(enrollment.id)
    if (res.success) {
      if (res.completed) {
        toast.success(`🎉 Challenge Completed! +${challenge.reward_points} pts`)
      } else {
        toast.success("Checked in for today! Great job.")
      }
    } else {
      toast.error(res.error || "Failed to check in")
    }
    setIsLoading(false)
  }

  const isEnrolled = !!enrollment
  const progressPercent = isEnrolled ? (enrollment.progress_days / challenge.duration_days) * 100 : 0
  const isCompleted = isEnrolled && enrollment.is_completed

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-lg transition-all`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${challenge.color_gradient} opacity-20 pointer-events-none`} />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center text-2xl shadow-sm border border-border/30">
            {challenge.icon}
          </div>
          <div className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <span>✨</span> {challenge.reward_points} pts
          </div>
        </div>

        <h3 className="text-xl font-bold text-foreground mb-2">{challenge.title}</h3>
        <p className="text-sm text-muted-foreground mb-6 line-clamp-2 h-10">
          {challenge.description}
        </p>

        {isEnrolled ? (
          <div className="space-y-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Day {enrollment.progress_days} of {challenge.duration_days}</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
            
            <div className="flex gap-2 mt-4">
              <Button 
                onClick={handleCheckIn} 
                disabled={isLoading || isCompleted} 
                className="w-full gap-2"
                variant={isCompleted ? "secondary" : "default"}
              >
                {isCompleted ? (
                  <><CheckCircle2 className="w-4 h-4" /> Completed</>
                ) : (
                  <><PlayCircle className="w-4 h-4" /> Check In Today</>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setShowParticipants(!showParticipants)}
                title="Community"
              >
                <Users className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            onClick={handleEnroll} 
            disabled={isLoading} 
            className="w-full mt-4 bg-primary hover:bg-primary/90"
          >
            Join Challenge
          </Button>
        )}
      </div>

      {showParticipants && isEnrolled && (
        <div className="relative z-10 mt-6 pt-6 border-t border-border/50">
          <ParticipantList challengeId={challenge.id} />
        </div>
      )}
    </motion.div>
  )
}
