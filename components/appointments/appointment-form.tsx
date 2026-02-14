"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Doctor, DOCTORS } from "@/components/appointments/doctor-selection"
import { AppointmentTicket } from "@/components/appointments/appointment-ticket"
import { Calendar as CalendarIcon, Clock, Loader2, Sparkles, User, Video, Phone, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface AppointmentFormProps {
  userId: string
}

const appointmentTypes = [
  { id: "video", label: "Video Call", icon: Video, desc: "Face-to-face online session" },
  { id: "phone", label: "Phone Call", icon: Phone, desc: "Voice-only consultation" },
  { id: "in-person", label: "In-Person", icon: User, desc: "Visit our MindCare Center" }
]

export function AppointmentForm({ userId }: AppointmentFormProps) {
  const [step, setStep] = useState<1 | 2>(1) // 1: Details, 2: Success
  const [allocationStep, setAllocationStep] = useState<0 | 1 | 2>(0) // 0: None, 1: Searching, 2: Found

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [appointmentType, setAppointmentType] = useState("video")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [duration, setDuration] = useState(60)
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [appointmentId, setAppointmentId] = useState<string | null>(null)
  const [assignedDoctor, setAssignedDoctor] = useState<Doctor | null>(null)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim() || !date || !time) {
      setError("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    setAllocationStep(1) // Start visual allocation

    try {
      // PRO: Randomly assign a doctor from the pool
      const randomDoctor = DOCTORS[Math.floor(Math.random() * DOCTORS.length)]

      // Artificial delay for "Finding Specialist" effect
      await new Promise(resolve => setTimeout(resolve, 2000))

      setAssignedDoctor(randomDoctor)
      setAllocationStep(2)

      // Short delay to show "Found" state before creating
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Combine date and time into ISO string
      const scheduledAt = new Date(`${date}T${time}:00`).toISOString()

      const doctorInfo = `\n\n[Assigned Specialist: ${randomDoctor.name} (${randomDoctor.specialty})]`
      const finalNotes = (notes + doctorInfo).trim()

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
          notes: finalNotes || null,
          status: "scheduled",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to schedule appointment")
      }

      setAppointmentId(data.data[0].id)
      setStep(2)

    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to schedule appointment"
      setError(message)
      console.error("Error scheduling appointment:", error)
      setAllocationStep(0)
    } finally {
      setIsLoading(false)
    }
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0]

  // Step 2: Success Ticket
  if (step === 2 && appointmentId && assignedDoctor) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-green-500/20 text-green-600 dark:text-green-400 rounded-full mb-2 shadow-sm animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-foreground tracking-tight">Booking Confirmed</h2>
          <p className="text-muted-foreground text-lg">Your session has been secured.</p>
        </div>

        <AppointmentTicket
          appointmentId={appointmentId}
          doctorName={assignedDoctor.name}
          doctorRole={assignedDoctor.specialty}
          date={date}
          time={time}
          location={appointmentType === 'video' ? 'Google Meet Link' : 'MindCare Center'}
        />

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center max-w-md mx-auto shadow-sm">
          <p className="text-primary font-medium flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            This session is covered by our Free Plan.
          </p>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Button variant="outline" onClick={() => router.push('/dashboard/appointments')} className="w-32">
            View All
          </Button>
          <Button onClick={() => router.push('/dashboard')} className="w-32 bg-primary hover:bg-primary/90 text-primary-foreground">
            Dashboard
          </Button>
        </div>
      </div>
    )
  }

  // Step 1: Booking Form
  return (
    <Card className="border-border shadow-xl bg-card/95 backdrop-blur-sm max-w-3xl mx-auto overflow-hidden">
      {/* Loading Overlay for Allocation */}
      {allocationStep > 0 && (
        <div className="absolute inset-0 bg-background/95 z-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
          {allocationStep === 1 ? (
            <>
              <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-6"></div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Finding available specialist...</h3>
              <p className="text-muted-foreground">Matching based on your preferences</p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-green-500/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300">
                <Sparkles className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Specialist Found!</h3>
              <p className="text-muted-foreground">Confirming your slot with Dr. {assignedDoctor?.name}...</p>
            </>
          )}
        </div>
      )}

      <CardHeader className="bg-muted/30 border-b border-border">
        <CardTitle className="text-2xl text-foreground">Book Your Session</CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          Tell us when you're free, and we'll match you with a top specialist.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Title Section */}
          <div className="space-y-3">
            <Label htmlFor="title" className="text-base font-semibold text-foreground">What's this session for?</Label>
            <Input
              id="title"
              placeholder="e.g., Anxiety Check-in, Stress Management..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              className="h-12 text-lg bg-background border-input focus:bg-background transition-all"
              required
            />
          </div>

          {/* Date & Time Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="date" className="text-base font-semibold text-foreground">Date</Label>
              <div className="relative group">
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={isLoading}
                  min={today}
                  className="h-12 pl-12 bg-background border-input focus:bg-background transition-all"
                  required
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-background rounded-md shadow-sm border border-border group-hover:border-primary/50 transition-colors pointer-events-none">
                  <CalendarIcon className="w-4 h-4 text-primary" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="time" className="text-base font-semibold text-foreground">Time</Label>
              <div className="relative group">
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  disabled={isLoading}
                  className="h-12 pl-12 bg-background border-input focus:bg-background transition-all"
                  required
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-background rounded-md shadow-sm border border-border group-hover:border-primary/50 transition-colors pointer-events-none">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Type Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-foreground">How would you like to meet?</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {appointmentTypes.map((type) => {
                const Icon = type.icon
                const isSelected = appointmentType === type.id
                return (
                  <div
                    key={type.id}
                    onClick={() => setAppointmentType(type.id)}
                    className={cn(
                      "cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-md",
                      isSelected
                        ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary/20"
                        : "border-border bg-card hover:border-primary/30"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={cn("p-2 rounded-lg", isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={cn("font-bold text-sm", isSelected ? "text-primary" : "text-foreground")}>{type.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{type.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Duration Slider */}
          <div className="space-y-4 p-5 bg-muted/20 rounded-xl border border-dashed border-border">
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold text-foreground">Session Length</Label>
              <span className="text-sm font-bold text-primary bg-background px-3 py-1 rounded-full border border-border shadow-sm">
                {duration} minutes
              </span>
            </div>
            <input
              id="duration"
              type="range"
              min="30"
              max="180"
              step="15"
              value={duration}
              onChange={(e) => setDuration(Number.parseInt(e.target.value))}
              disabled={isLoading}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground font-medium px-1">
              <span>Quick (30m)</span>
              <span>Standard (60m)</span>
              <span>Deep Dive (3h)</span>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-3">
            <Label htmlFor="notes" className="text-base font-semibold text-foreground">
              Anything else we should know? <span className="text-muted-foreground font-normal text-sm">(Optional)</span>
            </Label>
            <Textarea
              id="notes"
              placeholder="I'd like to discuss..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isLoading}
              className="resize-none h-32 bg-background border-input focus:bg-background text-base"
            />
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg flex items-center gap-2 text-sm animate-in fade-in">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-14 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
            Confirm Booking (Free)
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
