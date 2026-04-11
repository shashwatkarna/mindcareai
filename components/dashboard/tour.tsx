"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, X, Sparkles, Zap, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

interface TourStep {
  targetId: string
  title: string
  content: string
  icon: any
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: "", // Welcome step (centered)
    title: "Welcome to MindCare AI! 🌟",
    content: "Ready to take control of your mental wellness? Let's take a quick 1-minute tour of your new dashboard.",
    icon: Sparkles
  },
  {
    targetId: "tour-sidebar",
    title: "Quick Navigation 🧭",
    content: "Access all MindCare features—Assessments, Journaling, Mood Tracking, and AI Chat—from this menu.",
    icon: Zap
  },
  {
    targetId: "tour-notifications",
    title: "Stay Updated 🔔",
    content: "Keep track of your daily tasks, mood reminders, and important updates here.",
    icon: Lightbulb
  },
  {
    targetId: "tour-profile",
    title: "Your Identity 👤",
    content: "Customize your profile, upgrade to Premium, and access settings from this menu.",
    icon: Zap
  },
  {
    targetId: "tour-quick-actions",
    title: "Instant Care ⚡",
    content: "Log your mood, write a journal entry, or book an appointment in just one click.",
    icon: Zap
  },
  {
    targetId: "tour-stats-grid",
    title: "Track Your Progress 📊",
    content: "See exactly how many mood logs and journal entries you've completed at a glance.",
    icon: Sparkles
  },
  {
    targetId: "tour-mood-trend",
    title: "Analyze Your Mind 📈",
    content: "This interactive chart helps you visualize your emotional journey over the past 7 days.",
    icon: Lightbulb
  },
  {
    targetId: "tour-recent-activity",
    title: "Activity History 🕒",
    content: "Revisit your recent sessions and logs to see how far you've come.",
    icon: Zap
  },
  {
    targetId: "tour-wellness-champion",
    title: "Wellness Champion 🏆",
    content: "Earn points for your daily actions and read your personalized motivational insights here.",
    icon: Sparkles
  }
]

export function UserTour() {
  const [currentStep, setCurrentStep] = useState(-1) // -1 means checking status
  const [isVisible, setIsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    setMounted(true)
    const hasSeenTour = localStorage.getItem("mindcare_dashboard_tour_seen")
    if (!hasSeenTour) {
      setCurrentStep(0)
      setIsVisible(true)
      localStorage.setItem("mindcare_dashboard_tour_seen", "true")
    }
  }, [])

  const updateTargetRect = useCallback(() => {
    if (currentStep < 0 || currentStep >= TOUR_STEPS.length) return
    const step = TOUR_STEPS[currentStep]
    if (!step.targetId) {
      setTargetRect(null)
      return
    }
    const element = document.getElementById(step.targetId)
    if (element) {
      // Small delay to ensure any entrance animations are finished
      setTimeout(() => {
        setTargetRect(element.getBoundingClientRect())
        // Auto-scroll to centered view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    }
  }, [currentStep])

  useEffect(() => {
    updateTargetRect()
    window.addEventListener('resize', updateTargetRect)
    window.addEventListener('scroll', updateTargetRect)
    return () => {
      window.removeEventListener('resize', updateTargetRect)
      window.removeEventListener('scroll', updateTargetRect)
    }
  }, [updateTargetRect])

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleComplete = () => {
    setIsVisible(false)
    localStorage.setItem("mindcare_dashboard_tour_seen", "true")
  }

  if (!mounted || !isVisible) return null

  const step = TOUR_STEPS[currentStep]
  const Icon = step.icon

  // Calculate card position logic
  let cardStyles: React.CSSProperties = {
    position: 'absolute',
    zIndex: 50,
    width: '100%',
    maxWidth: '340px',
  }

  if (targetRect) {
    const spaceBelow = window.innerHeight - targetRect.bottom
    const spaceAbove = targetRect.top
    const spaceRight = window.innerWidth - targetRect.right
    const spaceLeft = targetRect.left

    // Special case: Full-height elements (like Sidebar)
    if (targetRect.height > window.innerHeight * 0.8 && spaceRight > 360) {
      cardStyles.left = `${targetRect.right + 24}px`
      cardStyles.top = '50%'
      cardStyles.transform = 'translateY(-50%)'
    } 
    // Default: Above or Below with horizontal clamping
    else {
      let left = targetRect.left + (targetRect.width / 2) - 170 
      left = Math.max(20, Math.min(left, window.innerWidth - 360))
      cardStyles.left = `${left}px`

      if (spaceBelow > 280) {
        cardStyles.top = `${targetRect.bottom + 16}px`
      } else if (spaceAbove > 280) {
        cardStyles.bottom = `${(window.innerHeight - targetRect.top) + 16}px`
      } else {
        // If neither above nor below has enough space, try right side or just center
        if (spaceRight > 360) {
          cardStyles.left = `${targetRect.right + 24}px`
          cardStyles.top = '50%'
          cardStyles.transform = 'translateY(-50%)'
        } else {
          cardStyles.top = '50%'
          cardStyles.left = '50%'
          cardStyles.transform = 'translate(-50%, -50%)'
        }
      }
    }
  } else {
    // Center for welcome step
    cardStyles.top = '50%'
    cardStyles.left = '50%'
    cardStyles.transform = 'translate(-50%, -50%)'
  }

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 pointer-events-auto"
      />

      {/* Spotlight - Simplified */}
      <AnimatePresence mode="wait">
        {targetRect && (
          <motion.div
            key={`spotlight-${currentStep}`}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1, 
              top: targetRect.top - 12, // Increased padding
              left: targetRect.left - 12,
              width: targetRect.width + 24,
              height: targetRect.height + 24
            }}
            className="absolute rounded-2xl border-4 border-primary z-10 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]"
          />
        )}
      </AnimatePresence>

      {/* Tour Card - Simple & Static */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
           key={`card-${currentStep}`}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           style={cardStyles}
           className="pointer-events-auto transition-all duration-300"
        >
          <Card className="border border-border bg-card shadow-2xl relative">
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-bold text-sm tracking-tight text-foreground">
                    {step.title}
                  </h3>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.content}
                </p>

                {/* Progress bar */}
                <div className="flex gap-1">
                  {TOUR_STEPS.map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "h-1 flex-1 rounded-full transition-all duration-300",
                        i <= currentStep ? "bg-primary" : "bg-muted"
                      )} 
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="text-muted-foreground text-[10px] p-0 h-auto"
                    onClick={handleComplete}
                  >
                    Skip
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    {currentStep > 0 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleBack}
                        className="h-8 px-3 text-xs"
                      >
                        Back
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      onClick={handleNext}
                      className="h-8 px-4 text-xs font-bold"
                    >
                      {currentStep === TOUR_STEPS.length - 1 ? "Got it!" : "Next"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
