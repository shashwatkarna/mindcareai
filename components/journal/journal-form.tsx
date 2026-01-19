"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface JournalFormProps {
  userId: string
}

const moods = ["happy", "sad", "anxious", "calm", "stressed", "hopeful", "confused", "grateful"]

export function JournalForm({ userId }: JournalFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [moodScore, setMoodScore] = useState(5)
  const [isPrivate, setIsPrivate] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      alert("Please write something in your journal entry")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title || `Entry from ${new Date().toLocaleDateString()}`,
          content,
          mood: selectedMood,
          mood_score: moodScore,
          is_private: isPrivate,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save journal entry")
      }

      router.push("/dashboard/journal")
    } catch (error) {
      console.error("Error saving entry:", error)
      alert("Failed to save journal entry")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-[#e0d9d3] bg-white max-w-4xl">
      <CardHeader>
        <CardTitle>Create Journal Entry</CardTitle>
        <CardDescription>Write freely about your thoughts, feelings, and experiences</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-[#3d3d3d]">
              Title (Optional)
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Give your entry a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              className="border-[#e0d9d3] bg-white"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="content" className="text-[#3d3d3d]">
              Your Thoughts
            </Label>
            <Textarea
              id="content"
              placeholder="Write whatever is on your mind..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isLoading}
              className="border-[#e0d9d3] bg-white min-h-48 resize-none"
            />
          </div>

          <div className="grid gap-4">
            <Label className="text-[#3d3d3d]">How are you feeling?</Label>
            <div className="grid grid-cols-4 gap-2">
              {moods.map((mood) => (
                <button
                  key={mood}
                  type="button"
                  onClick={() => setSelectedMood(mood)}
                  disabled={isLoading}
                  className={`py-3 px-2 rounded-lg text-sm font-medium transition-all ${selectedMood === mood ? "bg-[#8b7355] text-white" : "bg-[#f5f3f0] text-[#3d3d3d] hover:bg-[#e0d9d3]"
                    }`}
                >
                  {mood.charAt(0).toUpperCase() + mood.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="moodScore" className="text-[#3d3d3d]">
              Mood Intensity: {moodScore}/10
            </Label>
            <input
              id="moodScore"
              type="range"
              min="1"
              max="10"
              value={moodScore}
              onChange={(e) => setMoodScore(Number.parseInt(e.target.value))}
              disabled={isLoading}
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="isPrivate"
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              disabled={isLoading}
              className="rounded border-[#e0d9d3]"
            />
            <Label htmlFor="isPrivate" className="text-[#6b6b6b] font-normal cursor-pointer">
              Keep this entry private (only you can view it)
            </Label>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full bg-[#8b7355] hover:bg-[#6b5344] text-white">
            {isLoading ? "Saving..." : "Save Entry"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
