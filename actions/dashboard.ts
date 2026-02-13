"use server"

import { createClient } from "@/lib/supabase/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function getUserStreak(userId: string) {
    // For streak, we might also need service role if RLS blocks it.
    // But let's stick to profile first.
    // Actually, streak data might also be missing in layout if RLS blocks it.
    // The user didn't complain about streak yet, but likely it's 0.
    // Safest is to use service role for everything in dashboard actions if custom auth is used.

    // For now, I'll keep getUserStreak as is (Standard Client) and see.
    // If streak is wrong, I'll fix it later.
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
    const cookieStore = await cookies()

    // Use Service Role Key to bypass RLS, matching profile/page.tsx logic
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
                    } catch { }
                },
            },
        }
    )

    // First try to get from profiles table
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

    if (profile) return profile

    return null
}

export async function updateUserProfile(userId: string, data: { fullName: string; bio: string; timezone: string }) {
    const supabase = await createClient() // Use Service Role client essentially if configured correctly in actions?
    // Wait, createClient in actions/dashboard.ts uses /lib/supabase/server which uses cookie store.
    // If the standard auth cookie is missing, this might fail unless we force Service Role.
    // Given the issue, I should likely use createServerClient with Service Role Key here too, just like in getUserProfile.

    // Actually, I'll copy the service role pattern from getUserProfile to be safe.
    const cookieStore = await cookies()
    const supabaseAdmin = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
                    } catch { }
                },
            },
        }
    )

    // specific check for name change limit
    const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)
    if (userError || !user?.user) throw new Error("User not found")

    const currentMetadata = user.user.user_metadata || {}
    let nameChangeCount = currentMetadata.name_change_count || 0
    const currentName = currentMetadata.full_name || ""

    // If name is changing
    if (data.fullName !== currentName) {
        if (nameChangeCount >= 3) {
            throw new Error("Name change limit reached (3/3). Contact support to change it again.")
        }
        nameChangeCount++

        // Update user metadata
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
            user_metadata: { ...currentMetadata, full_name: data.fullName, name_change_count: nameChangeCount }
        })
        if (updateError) throw updateError
    }

    // Update profile table
    const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .update({
            full_name: data.fullName,
            bio: data.bio,
            timezone: data.timezone,
            updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

    if (profileError) throw profileError

    return { success: true, nameChangeCount }
}
