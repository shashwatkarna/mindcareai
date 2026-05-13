"use server"

import { createClient } from "@/lib/supabase/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

const GROQ_API_KEY = process.env.GROQ_API_KEY || ""
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""

export async function generateWeeklyInsights(userId: string) {
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

    // Fallback: If no data in last 7 days, fetch the most recent entries
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

    const systemPrompt = `You are a professional mental health AI analyst for the MindCare platform.
Analyze the provided user data and provide a "Weekly Mental Health Insight".
Instructions:
1. Be empathetic, supportive, and professional.
2. Identify patterns (e.g., correlations between mood and notes).
3. Provide 2-3 actionable suggestions for the next week.
4. Format in clear Markdown with "Summary" and "Suggestions" sections.
5. Keep the tone warm and non-clinical.
6. Max length: 250 words.`;

    const userPrompt = `User Data for Analysis:
Mood Logs:
${moodSummary}

Journal Entries:
${journalSummary}`;

    let insightContent = ""

    // 3. Try Groq first, fallback to Gemini
    if (GROQ_API_KEY) {
        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 1024
                })
            })

            const data = await response.json()
            insightContent = data.choices[0].message.content
        } catch (error) {
            console.error("Groq Error, trying Gemini fallback:", error)
        }
    }

    // Fallback to Gemini if Groq failed or key is missing
    if (!insightContent && GEMINI_API_KEY) {
        try {
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
            const result = await model.generateContent(`${systemPrompt}\n\n${userPrompt}`)
            insightContent = result.response.text()
        } catch (error) {
            console.error("Gemini Fallback Error:", error)
            return { success: false, error: "AI service currently unavailable. Please try again later." }
        }
    }

    if (!insightContent) {
        return { success: false, error: "AI configuration missing. Please check your API keys." }
    }

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
