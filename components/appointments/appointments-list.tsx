"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      case "rescheduled":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return "📹"
      case "phone":
        return "📞"
      case "in-person":
        return "🏥"
      default:
        return "📅"
    }
  }

  const isUpcoming = (scheduledAt: string) => {
    return new Date(scheduledAt) > new Date()
  }

  // Separate upcoming and past appointments
  const upcomingAppointments = appointments.filter((a) => isUpcoming(a.scheduled_at))
  const pastAppointments = appointments.filter((a) => !isUpcoming(a.scheduled_at))

  if (appointments.length === 0) {
    return (
      <Card className="p-12 border-[#e0d9d3] bg-white text-center">
        <p className="text-[#6b6b6b]">No appointments scheduled yet. Book your first session to get started.</p>
        <Link href="/dashboard/appointments/new">
          <button className="mt-4 px-4 py-2 bg-[#8b7355] text-white rounded-md hover:bg-[#6b5344]">Schedule Now</button>
        </Link>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {upcomingAppointments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#3d3d3d]">Upcoming Appointments</h3>
          {upcomingAppointments.map((appointment) => (
            <Card key={appointment.id} className="p-6 border-[#e0d9d3] bg-white hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{getTypeIcon(appointment.appointment_type)}</span>
                    <div>
                      <h4 className="font-semibold text-[#3d3d3d]">{appointment.title}</h4>
                      <p className="text-sm text-[#6b6b6b]">{new Date(appointment.scheduled_at).toLocaleString()}</p>
                    </div>
                  </div>
                  {appointment.description && <p className="text-sm text-[#6b6b6b] mb-2">{appointment.description}</p>}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="bg-[#f5f3f0] text-[#3d3d3d]">{appointment.appointment_type}</Badge>
                    <span className="text-xs text-[#6b6b6b]">{appointment.duration_minutes} minutes</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                  {appointment.status === "scheduled" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCancel(appointment.id)}
                      disabled={cancelingId === appointment.id}
                      className="text-red-600 hover:text-red-700"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {pastAppointments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#3d3d3d]">Past Appointments</h3>
          {pastAppointments.map((appointment) => (
            <Card key={appointment.id} className="p-6 border-[#e0d9d3] bg-[#f9f7f5] opacity-75">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{getTypeIcon(appointment.appointment_type)}</span>
                    <div>
                      <h4 className="font-semibold text-[#3d3d3d]">{appointment.title}</h4>
                      <p className="text-sm text-[#6b6b6b]">{new Date(appointment.scheduled_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="bg-[#e0d9d3] text-[#3d3d3d]">{appointment.appointment_type}</Badge>
                    <span className="text-xs text-[#6b6b6b]">{appointment.duration_minutes} minutes</span>
                  </div>
                </div>
                <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
