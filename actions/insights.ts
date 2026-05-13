"use server"

import { createClient } from "@/lib/supabase/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

const API_KEY = process.env.GEMINI_API_KEY || ""

export async function generateWeeklyInsights(userId: string) {
    if (!API_KEY) throw new Error("AI API Key not configured")

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

    // 1. Fetch data from last 7 days
    const lastWeek = new Date()
    lastWeek.setDate(lastWeek.getDate() - 7)
    const lastWeekIso = lastWeek.toISOString()

    let { data: moodLogs } = await supabaseAdmin
        .from("mood_logs")
        .select("mood, intensity, notes, created_at")
        .eq("user_id", userId)
        .gte("created_at", lastWeekIso)

    let { data: journalEntries } = await supabaseAdmin
        .from("journal_entries")
        .select("content, mood, mood_score, created_at")
        .eq("user_id", userId)
        .gte("created_at", lastWeekIso)

    // Fallback: If no data in last 7 days, fetch the most recent 10 entries regardless of date
    if ((!moodLogs || moodLogs.length === 0) && (!journalEntries || journalEntries.length === 0)) {
        const { data: recentMoods } = await supabaseAdmin
            .from("mood_logs")
            .select("mood, intensity, notes, created_at")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(10)
        
        const { data: recentJournals } = await supabaseAdmin
            .from("journal_entries")
            .select("content, mood, mood_score, created_at")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(5)

        moodLogs = recentMoods
        journalEntries = recentJournals
    }

    if ((!moodLogs || moodLogs.length === 0) && (!journalEntries || journalEntries.length === 0)) {
        return { success: false, error: "No data available yet. Start logging your mood or journaling to get insights!" }
    }

    // 2. Prepare prompt
    const moodSummary = moodLogs?.map(m => `Mood: ${m.mood} (Intensity: ${m.intensity}), Notes: ${m.notes || 'none'}`).join("\n") || "No mood logs."
    const journalSummary = journalEntries?.map(j => `Journal: ${j.content}, Mood: ${j.mood || 'none'}`).join("\n") || "No journal entries."

    const prompt = `You are a professional mental health AI analyst for the MindCare platform.
Analyze the following user data from the past 7 days and provide a "Weekly Mental Health Insight".
Data:
${moodSummary}
${journalSummary}

Instructions:
1. Be empathetic, supportive, and professional.
2. Identify patterns (e.g., "I noticed you feel more anxious in the mornings").
3. Provide 2-3 actionable suggestions for the next week.
4. Keep the tone warm and non-clinical.
5. Format the response in clear Markdown with a "Summary" and "Suggestions" section.
6. Max length: 250 words.`;

    // 3. Generate with Gemini
    const genAI = new GoogleGenerativeAI(API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
    const result = await model.generateContent(prompt)
    const insightContent = result.response.text()

    // 4. Store in DB
    const { error: storeError } = await supabaseAdmin
        .from("ai_insights")
        .insert({
            user_id: userId,
            content: insightContent
        })

    if (storeError) {
        console.error("Error storing insight:", storeError)
    }

    return { success: true, content: insightContent }
}

export async function getLatestInsight(userId: string) {
    const cookieStore = await cookies()
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("ai_insights")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

    if (error) return null
    return data
}
