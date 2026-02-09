"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MoodQuiz } from "./mood-quiz"
import { RefreshCcw } from "lucide-react"

const moods = [
  { name: "happy", emoji: "😊", color: "bg-yellow-100 hover:bg-yellow-200" },
  { name: "sad", emoji: "😢", color: "bg-blue-100 hover:bg-blue-200" },
  { name: "anxious", emoji: "😰", color: "bg-red-100 hover:bg-red-200" },
  { name: "calm", emoji: "😌", color: "bg-green-100 hover:bg-green-200" },
  { name: "stressed", emoji: "😤", color: "bg-orange-100 hover:bg-orange-200" },
  { name: "energetic", emoji: "⚡", color: "bg-purple-100 hover:bg-purple-200" },
]

const activities = ["Exercise", "Meditation", "Work", "Social", "Sleep", "Eating", "Hobby", "Rest"]

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

  const handleActivityToggle = (activity: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activity) ? prev.filter((a) => a !== activity) : [...prev, activity],
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
      if (data.activities && Array.isArray(data.activities)) {
        const measuredActivities = activities.filter(a =>
          data.activities.some((da: string) => da.toLowerCase().includes(a.toLowerCase()))
        )
        setSelectedActivities(prev => Array.from(new Set([...prev, ...measuredActivities])))
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
          activities: selectedActivities,
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
          <h2 className="text-xl font-bold text-[#3d3d3d]">Daily Check-In</h2>
          <Button variant="ghost" size="sm" onClick={() => setIsQuizMode(false)} className="text-xs text-[#6b6b6b]">
            Skip to Manual Entry
          </Button>
        </div>
        <MoodQuiz onComplete={handleQuizComplete} isLoading={isLoading} />
      </div>
    )
  }

  return (
    <Card className="border-[#e0d9d3] bg-white animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Review & Save</CardTitle>
          <CardDescription>AI has pre-filled this based on your answers.</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsQuizMode(true)} title="Retake Quiz">
          <RefreshCcw className="w-4 h-4 text-[#6b6b6b]" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-[#3d3d3d] font-semibold mb-4 block">Current Mood</Label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {moods.map((mood) => (
              <button
                key={mood.name}
                onClick={() => setSelectedMood(mood.name)}
                disabled={isLoading}
                className={`p-4 rounded-lg text-center transition-all ${selectedMood === mood.name ? "ring-2 ring-[#8b7355] scale-105 bg-[#faf8f5]" : "opacity-60 hover:opacity-100"
                  } ${mood.color}`}
              >
                <div className="text-3xl mb-1">{mood.emoji}</div>
                <div className="text-xs text-[#3d3d3d] font-medium">{mood.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-[#3d3d3d] font-semibold mb-4 block">Intensity: {intensity}/10</Label>
          <input
            type="range"
            min="1"
            max="10"
            value={intensity}
            onChange={(e) => setIntensity(Number.parseInt(e.target.value))}
            disabled={isLoading}
            className="w-full accent-[#8b7355]"
          />
        </div>

        <div>
          <Label className="text-[#3d3d3d] font-semibold mb-3 block">What are you doing?</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {activities.map((activity) => (
              <button
                key={activity}
                onClick={() => handleActivityToggle(activity)}
                disabled={isLoading}
                className={`py-2 px-3 rounded-md text-sm transition-all border ${selectedActivities.includes(activity)
                    ? "bg-[#8b7355] text-white border-[#8b7355]"
                    : "bg-white text-[#3d3d3d] border-[#e0d9d3] hover:bg-[#faf8f5]"
                  }`}
              >
                {activity}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="notes" className="text-[#3d3d3d] font-semibold mb-2 block">
            Generated Narrative
          </Label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isLoading}
            className="w-full p-3 border border-[#e0d9d3] rounded-md bg-[#faf8f5] text-[#3d3d3d] text-sm resize-none h-24 focus:outline-none focus:ring-1 focus:ring-[#8b7355]"
          />
        </div>

        {message && (
          <div
            className={`p-4 rounded-md text-sm ${message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
              }`}
          >
            {message.text}
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={isLoading || !selectedMood}
          className="w-full bg-[#8b7355] hover:bg-[#6b5344] text-white h-12 text-lg font-medium"
        >
          {isLoading ? "Saving..." : "Confirm & Save Log"}
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
