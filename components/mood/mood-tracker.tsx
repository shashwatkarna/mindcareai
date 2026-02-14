"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MoodQuiz } from "./mood-quiz"
import { RefreshCcw, Briefcase, Home, Moon, Heart, Users, Book, Dumbbell, Sun, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const moods = [
  { name: "happy", emoji: "😊", color: "bg-yellow-100 hover:bg-yellow-200" },
  { name: "sad", emoji: "😢", color: "bg-blue-100 hover:bg-blue-200" },
  { name: "anxious", emoji: "😰", color: "bg-red-100 hover:bg-red-200" },
  { name: "calm", emoji: "😌", color: "bg-green-100 hover:bg-green-200" },
  { name: "stressed", emoji: "😤", color: "bg-orange-100 hover:bg-orange-200" },
  { name: "energetic", emoji: "⚡", color: "bg-purple-100 hover:bg-purple-200" },
]

const ACTIVITIES = [
  { id: "work", label: "Work", icon: Briefcase },
  { id: "family", label: "Family", icon: Home },
  { id: "sleep", label: "Sleep", icon: Moon },
  { id: "health", label: "Health", icon: Heart },
  { id: "social", label: "Social", icon: Users },
  { id: "learning", label: "Learning", icon: Book },
  { id: "exercise", label: "Fitness", icon: Dumbbell },
  { id: "hobby", label: "Hobby", icon: Sun },
]

interface MoodTrackerProps {
  userId: string
}

export function MoodTracker({ userId }: MoodTrackerProps) {
  const [isQuizMode, setIsQuizMode] = useState(true)
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])
  const [intensity, setIntensity] = useState(5)
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleActivityToggle = (activityId: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activityId) ? prev.filter((a) => a !== activityId) : [...prev, activityId],
    )
  }

  const handleQuizComplete = async (narrative: string) => {
    setIsLoading(true)
    setNotes(narrative) // Save the quiz narrative as notes

    try {
      // Analyze the quiz narrative to get mood params
      const response = await fetch("/api/mood/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: narrative }),
      })

      const data = await response.json()

      if (data.error) throw new Error(data.error)

      // Auto-populate based on analysis
      const moodMatch = moods.find(m => m.name.toLowerCase() === data.mood?.toLowerCase())
      if (moodMatch) setSelectedMood(moodMatch.name)
      if (data.intensity) setIntensity(data.intensity)

      // Basic activity matching from text analysis if returned
      // This part depends on the API's return format for 'activities'
      // Assuming API returns string array
      if (data.activities && Array.isArray(data.activities)) {
        // Simple string matching to our IDs
        // ... existing code ...
        // Logic to match API activities to our icon IDs would go here
        // For now, we rely on manual selection or advanced matching if API improved
      }

      setIsQuizMode(false) // Switch to review mode
      setMessage({ type: "success", text: "AI Analysis Complete! Review and submit." })

    } catch (error) {
      console.error("Analysis failed:", error)
      setMessage({ type: "error", text: "Analysis failed. Please select mood manually." })
      setIsQuizMode(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!selectedMood) {
      alert("Please select a mood")
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood: selectedMood,
          intensity,
          notes: notes || null,
          activities: selectedActivities, // Saving IDs (e.g. "work", "sleep")
        }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "Failed to log mood")

      setMessage({ type: "success", text: "Mood logged successfully!" })

      // Reset after success
      setTimeout(() => {
        window.location.reload()
      }, 1500)

    } catch (error) {
      console.error("Error logging mood:", error)
      setMessage({ type: "error", text: "Failed to log mood" })
    } finally {
      setIsLoading(false)
    }
  }

  if (isQuizMode) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-xl font-bold text-foreground">Daily Check-In</h2>
          <Button variant="ghost" size="sm" onClick={() => setIsQuizMode(false)} className="text-xs text-muted-foreground hover:text-foreground">
            Skip to Manual Entry
          </Button>
        </div>
        <MoodQuiz onComplete={handleQuizComplete} isLoading={isLoading} />
      </div>
    )
  }

  return (
    <Card className="border-border shadow-sm bg-card animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">Review & Save</CardTitle>
          <CardDescription>AI has pre-filled this based on your answers.</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsQuizMode(true)} title="Retake Quiz">
          <RefreshCcw className="w-4 h-4 text-muted-foreground" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Mood Selection */}
        <div>
          <Label className="text-sm font-medium text-foreground mb-3 block">Current Mood</Label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {moods.map((mood) => (
              <button
                key={mood.name}
                onClick={() => setSelectedMood(mood.name)}
                disabled={isLoading}
                className={`p-3 rounded-xl flex flex-col items-center justify-center transition-all ${selectedMood === mood.name
                    ? `ring-2 ring-primary scale-105 ${mood.color}`
                    : "bg-secondary/50 hover:bg-secondary opacity-70 hover:opacity-100"
                  }`}
              >
                <span className="text-2xl mb-1 filter drop-shadow-sm">{mood.emoji}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-foreground/80">{mood.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Intensity Selection */}
        <div>
          <Label className="text-sm font-medium text-foreground mb-3 block">Intensity</Label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Mild", value: 3 },
              { label: "Moderate", value: 6 },
              { label: "Intense", value: 9 },
            ].map((level) => (
              <button
                key={level.label}
                type="button"
                onClick={() => setIntensity(level.value)}
                className={`py-2 px-4 rounded-lg text-sm font-medium transition-all border ${intensity === level.value
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background text-foreground border-border hover:bg-secondary"
                  }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        {/* Activity Selection */}
        <div>
          <Label className="text-sm font-medium text-foreground mb-3 block">What are you doing?</Label>
          <div className="flex flex-wrap gap-2">
            {ACTIVITIES.map((act) => {
              const Icon = act.icon
              const isSelected = selectedActivities.includes(act.id)
              return (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => handleActivityToggle(act.id)}
                  disabled={isLoading}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-background text-foreground border-border hover:bg-secondary"
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {act.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Notes */}
        <div>
          <Label htmlFor="notes" className="text-sm font-medium text-foreground mb-2 block">
            Generated Narrative / Notes
          </Label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isLoading}
            className="w-full p-3 border border-input rounded-lg bg-background text-sm resize-none h-24 focus:outline-none focus:ring-1 focus:ring-ring transition-shadow"
            placeholder="Add any additional notes..."
          />
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-lg text-sm flex items-center justify-center font-medium ${message.type === "success"
              ? "bg-green-500/15 text-green-700 dark:text-green-400 border border-green-500/20"
              : "bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/20"
              }`}
          >
            {message.text}
          </motion.div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={isLoading || !selectedMood}
          className="w-full h-12 text-base font-semibold shadow-md active:scale-[0.98] transition-transform"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : "Confirm & Save Log"}
        </Button>
      </CardContent>
    </Card>
  )
}

function Label({ children, className = "", ...props }: any) {
  return (
    <label className={className} {...props}>
      {children}
    </label>
  )
}
