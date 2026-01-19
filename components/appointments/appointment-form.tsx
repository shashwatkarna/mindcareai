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

interface AppointmentFormProps {
  userId: string
}

const appointmentTypes = ["video", "phone", "in-person"]

export function AppointmentForm({ userId }: AppointmentFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [appointmentType, setAppointmentType] = useState("video")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [duration, setDuration] = useState(60)
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim() || !date || !time) {
      setError("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    try {
      // Combine date and time into ISO string
      const scheduledAt = new Date(`${date}T${time}:00`).toISOString()

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description: description || null,
          appointment_type: appointmentType,
          scheduled_at: scheduledAt,
          duration_minutes: duration,
          notes: notes || null,
          status: "scheduled",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to schedule appointment")
      }

      router.push("/dashboard/appointments")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to schedule appointment"
      setError(message)
      console.error("Error scheduling appointment:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0]

  return (
    <Card className="border-[#e0d9d3] bg-white max-w-2xl">
      <CardHeader>
        <CardTitle>Book Your Appointment</CardTitle>
        <CardDescription>Schedule a session with a mental health professional</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-[#3d3d3d]">
              Appointment Title *
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="e.g., Weekly Therapy Session"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              className="border-[#e0d9d3] bg-white"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className="text-[#3d3d3d]">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="What would you like to discuss?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              className="border-[#e0d9d3] bg-white min-h-20"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type" className="text-[#3d3d3d]">
              Appointment Type
            </Label>
            <select
              id="type"
              value={appointmentType}
              onChange={(e) => setAppointmentType(e.target.value)}
              disabled={isLoading}
              className="flex h-10 rounded-md border border-[#e0d9d3] bg-white px-3 py-2 text-sm"
            >
              {appointmentTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date" className="text-[#3d3d3d]">
                Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={isLoading}
                min={today}
                className="border-[#e0d9d3] bg-white"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="time" className="text-[#3d3d3d]">
                Time *
              </Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                disabled={isLoading}
                className="border-[#e0d9d3] bg-white"
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="duration" className="text-[#3d3d3d]">
              Duration (minutes): {duration}
            </Label>
            <input
              id="duration"
              type="range"
              min="30"
              max="180"
              step="15"
              value={duration}
              onChange={(e) => setDuration(Number.parseInt(e.target.value))}
              disabled={isLoading}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-[#6b6b6b]">
              <span>30 min</span>
              <span>180 min</span>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes" className="text-[#3d3d3d]">
              Additional Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Any specific topics or concerns to discuss..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isLoading}
              className="border-[#e0d9d3] bg-white min-h-20"
            />
          </div>

          {error && <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">{error}</div>}

          <Button type="submit" disabled={isLoading} className="w-full bg-[#8b7355] hover:bg-[#6b5344] text-white">
            {isLoading ? "Scheduling..." : "Schedule Appointment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
