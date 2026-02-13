"use server"

import { createClient } from "@/lib/supabase/server"

export interface NotificationData {
    hasLoggedMood: boolean
    hasJournaled: boolean
    upcomingAppointment?: {
        id: string
        date: string
        doctorName: string
        daysUntil: number
    } | null
    lastAssessmentDate?: string | null
    streak: number
}

export async function getNotificationData(userId: string): Promise<NotificationData> {
    const supabase = await createClient()
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]

    // Check Mood Log
    const { count: moodCount } = await supabase
        .from("mood_logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", `${todayStr}T00:00:00`)
        .lte("created_at", `${todayStr}T23:59:59`)

    // Check Journal
    const { count: journalCount } = await supabase
        .from("journal_entries")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", `${todayStr}T00:00:00`)
        .lte("created_at", `${todayStr}T23:59:59`)

    // Check Upcoming Appointment
    const { data: upcomingAppointment } = await supabase
        .from("appointments")
        .select("*")
        .eq("user_id", userId)
        .gte("scheduled_at", today.toISOString())
        .order("scheduled_at", { ascending: true })
        .limit(1)
        .single()

    let appointmentData = null
    if (upcomingAppointment) {
        const apptDate = new Date(upcomingAppointment.scheduled_at)
        const diffTime = apptDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        appointmentData = {
            id: upcomingAppointment.id,
            date: upcomingAppointment.scheduled_at,
            doctorName: upcomingAppointment.provider_name || upcomingAppointment.doctor_name || "Specialist",
            daysUntil: diffDays
        }
    }

    // Check Last Assessment
    const { data: lastAssessment } = await supabase
        .from("assessments")
        .select("created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

    return {
        hasLoggedMood: (moodCount || 0) > 0,
        hasJournaled: (journalCount || 0) > 0,
        upcomingAppointment: appointmentData,
        lastAssessmentDate: lastAssessment?.created_at || null,
        streak: 0 // Placeholder, layout puts real streak here
    }
}
