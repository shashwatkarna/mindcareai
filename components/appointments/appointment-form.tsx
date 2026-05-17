"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Doctor, DOCTORS } from "@/components/appointments/doctor-selection"
import { AppointmentTicket } from "@/components/appointments/appointment-ticket"
import { Calendar as CalendarIcon, Clock, Sparkles, User, Video, Phone, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"

interface AppointmentFormProps {
  userId: string
}

const appointmentTypes = [
  { id: "video", label: "Video Call", icon: Video, desc: "Face-to-face online session" },
  { id: "phone", label: "Phone Call", icon: Phone, desc: "Voice-only consultation" },
  { id: "in-person", label: "In-Person", icon: User, desc: "Visit our MindCare Center" }
]

const sessionOptions = [
  "Anxiety Check-in",
  "Stress & Burnout Support",
  "Mindfulness & Meditation Coaching",
  "Depression & Mood Therapy",
  "Cognitive Behavioral Therapy (CBT)",
  "Self-Esteem & Personal Growth",
  "Relationship & Family Counseling",
  "Grief & Loss Support",
  "Career or Academic Stress Counseling",
  "General Mental Health Support"
]

const timeSlots = [
  { value: "09:00", label: "09:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "13:00", label: "01:00 PM" },
  { value: "14:00", label: "02:00 PM" },
  { value: "15:00", label: "03:00 PM" },
  { value: "16:00", label: "04:00 PM" },
  { value: "17:00", label: "05:00 PM" },
]

export function AppointmentForm({ userId }: AppointmentFormProps) {
  const [step, setStep] = useState<1 | 2>(1) // 1: Details, 2: Success
  const [allocationStep, setAllocationStep] = useState<0 | 1 | 2>(0) // 0: None, 1: Searching, 2: Found

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [appointmentType, setAppointmentType] = useState("video")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [duration] = useState(60) // Removed session length option, default to 60 minutes
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [appointmentId, setAppointmentId] = useState<string | null>(null)
  const [assignedDoctor, setAssignedDoctor] = useState<Doctor | null>(null)

  const router = useRouter()

  useEffect(() => {
    if (selectedDate) {
      setDate(format(selectedDate, "yyyy-MM-dd"))
    } else {
      setDate("")
    }
  }, [selectedDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim() || !date || !time) {
      setError("Please fill in all required fields (Topic, Date, and Time Slot)")
      return
    }

    setIsLoading(true)
    setAllocationStep(1) // Start visual allocation

    try {
      // Randomly assign a doctor from the pool
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

          {/* Title Section (Dropdown / Dropbox Selection) */}
          <div className="space-y-3">
            <Label htmlFor="title" className="text-base font-semibold text-foreground">What's this session for?</Label>
            <Select value={title} onValueChange={setTitle} disabled={isLoading}>
              <SelectTrigger className="h-12 w-full text-base bg-background border-input focus:bg-background rounded-xl">
                <SelectValue placeholder="Select what this session is for" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border rounded-xl">
                {sessionOptions.map((option) => (
                  <SelectItem key={option} value={option} className="py-2.5">
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date & Time Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Calendar-only Date Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-foreground">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant={"outline"}
                    className={cn(
                      "w-full h-12 justify-start text-left font-normal pl-4 text-base bg-background border-input hover:bg-muted/50 rounded-xl",
                      !selectedDate && "text-muted-foreground"
                    )}
                    disabled={isLoading}
                  >
                    <CalendarIcon className="mr-3 h-5 w-5 text-primary" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-xl border border-border shadow-xl bg-card" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => {
                      const todayDate = new Date()
                      todayDate.setHours(0, 0, 0, 0)
                      return date < todayDate
                    }}
                    initialFocus
                    className="rounded-xl"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Slot-only Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-foreground">Available Time Slot</Label>
              <div className="grid grid-cols-2 gap-2.5">
                {timeSlots.map((slot) => {
                  const isSelected = time === slot.value
                  return (
                    <button
                      key={slot.value}
                      type="button"
                      disabled={isLoading}
                      onClick={() => setTime(slot.value)}
                      className={cn(
                        "h-12 flex items-center justify-center rounded-xl border-2 transition-all font-medium text-sm hover:shadow-sm",
                        isSelected
                          ? "border-primary bg-primary/10 text-primary font-bold ring-1 ring-primary/20"
                          : "border-border bg-background text-foreground hover:border-primary/45"
                      )}
                    >
                      <Clock className={cn("w-4 h-4 mr-2", isSelected ? "text-primary" : "text-muted-foreground")} />
                      {slot.label}
                    </button>
                  )
                })}
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

          {/* Notes (Kept "Anything else we should know?" text area exactly as requested) */}
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

