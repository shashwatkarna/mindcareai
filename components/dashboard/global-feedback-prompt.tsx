"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { X, Shield, Smile } from "lucide-react"
import { storeUserFeedback } from "@/actions/dashboard"

interface GlobalFeedbackPromptProps {
  userId: string
}

const FEEDBACK_OPTIONS = [
  { value: "difficult", emoji: "😢", label: "Difficult" },
  { value: "meh", emoji: "😕", label: "Okay" },
  { value: "good", emoji: "🙂", label: "Good" },
  { value: "great", emoji: "😀", label: "Great" },
  { value: "love", emoji: "💖", label: "Love it!" },
]

export function GlobalFeedbackPrompt({ userId }: GlobalFeedbackPromptProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState<"emoji" | "success">("emoji")
  const [context, setContext] = useState("general")
  
  const pathname = usePathname()

  useEffect(() => {
    const feedbackDismissed = localStorage.getItem("mindcare_feedback_dismissed_at")
    if (feedbackDismissed) {
      const lastDismissed = new Date(feedbackDismissed).getTime()
      const oneDay = 24 * 60 * 60 * 1000
      if (Date.now() - lastDismissed < oneDay) {
        return
      }
    }

    // 2-minute general stayed trigger
    const twoMinuteTimer = setTimeout(() => {
      setContext("duration")
      setIsOpen(true)
    }, 120000)

    // Chatbot 30s trigger
    let chatbotTimer: NodeJS.Timeout
    if (pathname === "/dashboard/chatbot") {
      chatbotTimer = setTimeout(() => {
        setContext("chatbot")
        setIsOpen(true)
      }, 30000)
    }

    return () => {
      clearTimeout(twoMinuteTimer)
      if (chatbotTimer) clearTimeout(chatbotTimer)
    }
  }, [pathname])

  const handleDismiss = () => {
    setIsOpen(false)
    localStorage.setItem("mindcare_feedback_dismissed_at", new Date().toISOString())
  }

  const handleSubmitEmoji = async (selectedRating: string) => {
    setRating(selectedRating)
    setIsSubmitting(true)
    try {
      await storeUserFeedback(userId, {
        rating: selectedRating,
        comment: "",
        context,
      })
      setStep("success")
      setTimeout(() => {
        setIsOpen(false)
      }, 1500)
    } catch (error) {
      console.error("Error submitting feedback:", error)
      // Instant graceful success fallback
      setStep("success")
      setTimeout(() => {
        setIsOpen(false)
      }, 1500)
    } finally {
      setIsSubmitting(false)
      localStorage.setItem("mindcare_feedback_dismissed_at", new Date().toISOString())
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm px-4 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          className="relative bg-zinc-950/75 dark:bg-zinc-950/75 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl p-5 text-white"
        >
          {/* Subtle absolute close button */}
          <button 
            onClick={handleDismiss} 
            className="absolute top-3 right-3 text-white/30 hover:text-white/80 transition-colors p-1 rounded-full hover:bg-white/5"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {step === "emoji" && (
            <div className="space-y-4 text-center">
              <p className="text-sm font-semibold text-white leading-relaxed max-w-[280px] mx-auto pt-1">
                {context === "chatbot" 
                  ? "How helpful was your chat with MindCare AI?" 
                  : "How would you rate your MindCare platform experience so far?"}
              </p>
              
              <div className="flex items-center justify-between gap-1 pt-1">
                {FEEDBACK_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSubmitEmoji(opt.value)}
                    className="group flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white/10 transition-all duration-200 border border-transparent disabled:opacity-50"
                  >
                    <span className="text-3xl group-hover:scale-125 transition-transform duration-200">{opt.emoji}</span>
                    <span className="text-[10px] text-white/60 font-semibold mt-2 group-hover:text-white transition-colors">{opt.label}</span>
                  </button>
                ))}
              </div>

              {/* Strict Privacy Shield Disclaimer */}
              <div className="flex items-center justify-center gap-1.5 pt-1 text-[9px] text-white/40 font-medium border-t border-white/5 mt-1">
                <Shield className="w-3 h-3 text-white/40" />
                <span>100% confidential & encrypted personal log</span>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-4 space-y-2 animate-in zoom-in duration-300">
              <div className="w-9 h-9 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-1">
                <Smile className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-white">Thank you!</p>
              <p className="text-xs text-white/60">Your private feedback keeps us growing.</p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
