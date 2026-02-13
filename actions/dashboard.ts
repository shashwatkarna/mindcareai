"use server"

import { createClient } from "@/lib/supabase/server"

export async function getUserStreak(userId: string) {
    const supabase = await createClient()

    // Fetch dates from mood_logs
    const { data: moodLogs } = await supabase
        .from("mood_logs")
        .select("created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

    // Fetch dates from journal_entries
    const { data: journalEntries } = await supabase
        .from("journal_entries")
        .select("created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

    // Fetch dates from assessments
    const { data: assessments } = await supabase
        .from("assessments")
        .select("created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

    // Fetch dates from appointments
    const { data: appointments } = await supabase
        .from("appointments")
        .select("created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

    const dates = new Set<string>()

    moodLogs?.forEach((log) => {
        dates.add(new Date(log.created_at).toISOString().split("T")[0])
    })

    journalEntries?.forEach((entry) => {
        dates.add(new Date(entry.created_at).toISOString().split("T")[0])
    })

    assessments?.forEach((assessment) => {
        dates.add(new Date(assessment.created_at).toISOString().split("T")[0])
    })

    appointments?.forEach((appointment) => {
        dates.add(new Date(appointment.created_at).toISOString().split("T")[0])
    })

    const sortedDates = Array.from(dates).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    const history = sortedDates.slice(0, 30)

    if (sortedDates.length === 0) return { streak: 0, history: [] }

    const today = new Date().toISOString().split("T")[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]

    // If the last activity wasn't today or yesterday, streak is 0
    if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
        return { streak: 0, history }
    }

    let streak = 0
    let currentDate = new Date(sortedDates[0])

    for (let i = 0; i < sortedDates.length; i++) {
        const dateToCheck = new Date(sortedDates[i])

        if (i === 0) {
            streak = 1
            continue
        }

        const diffTime = Math.abs(currentDate.getTime() - dateToCheck.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 1) {
            streak++
            currentDate = dateToCheck
        } else {
            break
        }
    }

    return { streak, history }
}

export async function getDailyAffirmation() {
    const affirmations = [
        "I am capable of handling whatever comes my way.",
        "My mind is calm, and my body is relaxed.",
        "I choose to focus on the positive.",
        "I am worthy of love and respect.",
        "I am growing and learning every day.",
        "My potential is limitless.",
        "I am in charge of my own happiness.",
        "I appreciate the small moments of joy.",
        "I am strong, resilient, and brave.",
        "I trust the journey of my life.",
    ]

    // Simple daily rotation based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    return affirmations[dayOfYear % affirmations.length]
}

export async function getUserProfile(userId: string) {
    const supabase = await createClient()

    // First try to get from profiles table
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

    if (profile) return profile

    // Fallback to auth.users metadata if needed, but usually we just return what we found
    return null
}
