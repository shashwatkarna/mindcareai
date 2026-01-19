"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mood: selectedMood,
          intensity,
          notes: notes || null,
          activities: selectedActivities,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to log mood")
      }

      setMessage({ type: "success", text: "Mood logged successfully!" })
      setSelectedMood(null)
      setSelectedActivities([])
      setIntensity(5)
      setNotes("")

      setTimeout(() => {
        setMessage(null)
        window.location.reload()
      }, 2000)
    } catch (error) {
      console.error("Error logging mood:", error)
      setMessage({ type: "error", text: "Failed to log mood" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-[#e0d9d3] bg-white">
      <CardHeader>
        <CardTitle>Quick Mood Check-In</CardTitle>
        <CardDescription>How are you feeling right now?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-[#3d3d3d] font-semibold mb-4 block">Select Your Current Mood</Label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {moods.map((mood) => (
              <button
                key={mood.name}
                onClick={() => setSelectedMood(mood.name)}
                disabled={isLoading}
                className={`p-4 rounded-lg text-center transition-all ${selectedMood === mood.name ? "ring-2 ring-[#8b7355] scale-105" : ""
                  } ${mood.color}`}
              >
                <div className="text-3xl mb-1">{mood.emoji}</div>
                <div className="text-xs text-[#3d3d3d]">{mood.name}</div>
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
            className="w-full"
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
                className={`py-2 px-3 rounded-md text-sm transition-all ${selectedActivities.includes(activity)
                    ? "bg-[#8b7355] text-white"
                    : "bg-[#f5f3f0] text-[#3d3d3d] hover:bg-[#e0d9d3]"
                  }`}
              >
                {activity}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="notes" className="text-[#3d3d3d] font-semibold mb-2 block">
            Additional Notes (Optional)
          </Label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isLoading}
            placeholder="Add any notes about your mood..."
            className="w-full p-3 border border-[#e0d9d3] rounded-md bg-white text-[#3d3d3d] placeholder-[#6b6b6b] text-sm resize-none h-20"
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
          className="w-full bg-[#8b7355] hover:bg-[#6b5344] text-white"
        >
          {isLoading ? "Logging..." : "Log Mood"}
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
