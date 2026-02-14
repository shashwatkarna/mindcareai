"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Video, Phone, User, CheckCircle2, XCircle, Plus } from "lucide-react"
import { format } from "date-fns"

interface Appointment {
  id: string
  title: string
  description: string | null
  appointment_type: string
  status: string
  scheduled_at: string
  duration_minutes: number
  notes: string | null
}

export function AppointmentsList({ appointments }: { appointments: Appointment[] }) {
  const [cancelingId, setCancelingId] = useState<string | null>(null)

  const handleCancel = async (appointmentId: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return

    setCancelingId(appointmentId)
    try {
      const supabase = createClient()
      await supabase.from("appointments").update({ status: "cancelled" }).eq("id", appointmentId)
      window.location.reload()
    } catch (error) {
      console.error("Error canceling appointment:", error)
      alert("Failed to cancel appointment")
    } finally {
      setCancelingId(null)
    }
  }

  const getStatusBadge = (status: string, isPast: boolean) => {
    if (status === 'cancelled') {
      return <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20">Cancelled</Badge>
    }
    if (status === 'completed' || isPast) {
      return <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 hover:bg-green-500/20">Completed</Badge>
    }
    if (status === 'rescheduled') {
      return <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 hover:bg-orange-500/20">Rescheduled</Badge>
    }
    return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/20">Scheduled</Badge>
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="w-4 h-4" />
      case "phone": return <Phone className="w-4 h-4" />
      case "in-person": return <User className="w-4 h-4" />
      default: return <Calendar className="w-4 h-4" />
    }
  }

  const isUpcoming = (scheduledAt: string) => {
    return new Date(scheduledAt) > new Date()
  }

  // Filter logic: Upcoming = Future AND Not Cancelled
  const upcomingAppointments = appointments.filter((a) => isUpcoming(a.scheduled_at) && a.status !== 'cancelled')
  // Past = Past OR Cancelled
  const pastAppointments = appointments.filter((a) => !isUpcoming(a.scheduled_at) || a.status === 'cancelled')

  if (appointments.length === 0) {
    return (
      <div className="text-center py-16 px-4 border border-dashed border-border rounded-xl bg-card/50">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
          <Calendar className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-foreground">No appointments yet</h3>
        <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
          Book your first session with one of our specialists to start your journey.
        </p>
        <Link href="/dashboard/appointments/new">
          <Button className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" /> Book Appointment
          </Button>
        </Link>
      </div>
    )
  }

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    const isPast = !isUpcoming(appointment.scheduled_at)
    const showCancel = appointment.status === 'scheduled' && !isPast

    return (
      <Card className="group overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-300 bg-card">
        <CardHeader className="p-4 sm:p-6 bg-muted/40 border-b border-border flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-full ring-1 ring-inset shadow-sm
                  ${appointment.appointment_type === 'video' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-indigo-500/20' :
                appointment.appointment_type === 'phone' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20'}
              `}>
              {getTypeIcon(appointment.appointment_type)}
            </div>
            <div>
              <h4 className="font-bold text-foreground text-lg">{appointment.title}</h4>
              <div className="flex items-center text-sm text-muted-foreground font-medium">
                {appointment.appointment_type.charAt(0).toUpperCase() + appointment.appointment_type.slice(1)} Session
              </div>
            </div>
          </div>
          {getStatusBadge(appointment.status, isPast)}
        </CardHeader>

        <CardContent className="p-5 grid gap-y-3 gap-x-6 sm:grid-cols-2">
          <div className="flex items-center gap-2.5 text-sm text-foreground/80">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="font-semibold">{format(new Date(appointment.scheduled_at), "EEEE, MMMM do, yyyy")}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-foreground/80">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-semibold">{format(new Date(appointment.scheduled_at), "h:mm a")} ({appointment.duration_minutes}m)</span>
          </div>

          {appointment.notes && appointment.notes.includes("Assigned Specialist:") && (
            <div className="flex items-center gap-2.5 text-sm text-foreground sm:col-span-2 bg-primary/5 p-2 rounded-md border border-primary/10">
              <User className="w-4 h-4 text-primary" />
              <span className="font-medium">
                {appointment.notes.split("Assigned Specialist:")[1].split("]")[0].trim()}
              </span>
            </div>
          )}
        </CardContent>

        {(showCancel || appointment.status === 'completed' || isPast) && (
          <CardFooter className="p-4 bg-muted/20 flex justify-end gap-3 border-t border-border">
            {showCancel && (
              <>
                <Button variant="outline" size="sm" className="text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => handleCancel(appointment.id)}
                  disabled={cancelingId === appointment.id}
                >
                  {cancelingId === appointment.id ? "Canceling..." : "Cancel Appointment"}
                </Button>
                {appointment.appointment_type === 'video' && (
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                    <Video className="w-3.5 h-3.5" /> Join Call
                  </Button>
                )}
              </>
            )}

            {/* Show "View Summary" for past/completed/cancelled events if pertinent (optional) */}
            {(appointment.status === 'completed' || isPast) && appointment.status !== 'cancelled' && (
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-medium">Session Completed</span>
              </div>
            )}

            {appointment.status === 'cancelled' && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-1.5 rounded-full border border-destructive/20">
                <XCircle className="w-4 h-4" />
                <span className="font-medium">Cancelled</span>
              </div>
            )}
          </CardFooter>
        )}
      </Card>
    )
  }

  return (
    <Tabs defaultValue="upcoming" className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <TabsList className="bg-muted p-1 border border-border">
          <TabsTrigger value="upcoming" className="px-6 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground font-medium">Upcoming</TabsTrigger>
          <TabsTrigger value="past" className="px-6 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground font-medium">Past & History</TabsTrigger>
        </TabsList>
        <Link href="/dashboard/appointments/new">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
            <Plus className="w-4 h-4 mr-2" /> Book New Session
          </Button>
        </Link>
      </div>

      <TabsContent value="upcoming" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2">
        {upcomingAppointments.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-border rounded-xl bg-card/50">
            <p className="text-muted-foreground text-lg">No upcoming sessions scheduled.</p>
            <p className="text-sm text-muted-foreground/80">Time to take care of yourself.</p>
          </div>
        ) : (
          upcomingAppointments.map(app => <AppointmentCard key={app.id} appointment={app} />)
        )}
      </TabsContent>

      <TabsContent value="past" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2">
        {pastAppointments.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-border rounded-xl bg-card/50">
            <p className="text-muted-foreground text-lg">No past appointment history.</p>
          </div>
        ) : (
          pastAppointments.map(app => <AppointmentCard key={app.id} appointment={app} />)
        )}
      </TabsContent>
    </Tabs>
  )
}
