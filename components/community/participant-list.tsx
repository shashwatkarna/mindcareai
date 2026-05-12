"use client"

import { useEffect, useState } from "react"
import { getChallengeParticipants, sendNudge } from "@/actions/community"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Heart, Sparkles, Flame, ThumbsUp } from "lucide-react"

export function ParticipantList({ challengeId }: { challengeId: string }) {
  const [participants, setParticipants] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchParticipants = async () => {
      const data = await getChallengeParticipants(challengeId)
      setParticipants(data)
      setIsLoading(false)
    }
    fetchParticipants()
  }, [challengeId])

  const handleNudge = async (receiverId: string, emoji: string) => {
    const res = await sendNudge(receiverId, challengeId, emoji)
    if (res.success) {
      toast.success(`Nudge ${emoji} sent!`)
    } else {
      toast.error("Failed to send nudge")
    }
  }

  if (isLoading) return <div className="text-sm text-muted-foreground text-center py-4">Loading peers...</div>
  if (participants.length === 0) return <div className="text-sm text-muted-foreground text-center py-4">Be the first to check in!</div>

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Users className="w-4 h-4 text-primary" /> Active Peers
      </h4>
      <div className="space-y-2">
        {participants.map((p, i) => (
          <div key={i} className="flex items-center justify-between bg-muted/30 p-2 rounded-lg text-sm">
            <span className="font-medium text-foreground">
              {p.profiles?.full_name?.split(' ')[0] || "Anonymous"} 
              <span className="text-muted-foreground ml-2 text-xs font-normal">Day {p.progress_days}</span>
            </span>
            <div className="flex gap-1">
              <button onClick={() => handleNudge(p.user_id, '🔥')} className="hover:scale-125 transition-transform" title="Send Fire">🔥</button>
              <button onClick={() => handleNudge(p.user_id, '👏')} className="hover:scale-125 transition-transform" title="Send Clap">👏</button>
              <button onClick={() => handleNudge(p.user_id, '💪')} className="hover:scale-125 transition-transform" title="Send Strength">💪</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Users(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
