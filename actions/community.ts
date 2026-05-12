"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

// Helper to get effective user ID securely
async function getUserId() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) return user.id

  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("mindcare_session")?.value
  if (sessionToken) {
    try {
      const decoded = Buffer.from(sessionToken, "base64").toString()
      return decoded.split(":")[0]
    } catch (e) {
      return null
    }
  }
  return null
}

export async function getActiveChallenges() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching challenges:", error)
    return []
  }
  return data
}

export async function getUserEnrollments() {
  const userId = await getUserId()
  if (!userId) return []

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("challenge_enrollments")
    .select(`
      *,
      challenges (*)
    `)
    .eq("user_id", userId)

  if (error) {
    console.error("Error fetching enrollments:", error)
    return []
  }
  return data
}

export async function enrollInChallenge(challengeId: string) {
  const userId = await getUserId()
  if (!userId) return { success: false, error: "Not authenticated" }

  const supabase = await createClient()
  const { error } = await supabase
    .from("challenge_enrollments")
    .insert({
      user_id: userId,
      challenge_id: challengeId,
      progress_days: 0,
      is_completed: false
    })

  if (error) {
    console.error("Error enrolling:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/community")
  return { success: true }
}

export async function checkInChallenge(enrollmentId: string) {
  const userId = await getUserId()
  if (!userId) return { success: false, error: "Not authenticated" }

  const supabase = await createClient()
  
  // Get current progress
  const { data: enrollment } = await supabase
    .from("challenge_enrollments")
    .select("*, challenges(duration_days)")
    .eq("id", enrollmentId)
    .single()

  if (!enrollment) return { success: false, error: "Enrollment not found" }

  const today = new Date().toISOString().split('T')[0]
  if (enrollment.last_checkin_date === today) {
    return { success: false, error: "Already checked in today" }
  }

  const newProgress = enrollment.progress_days + 1
  const duration = enrollment.challenges.duration_days
  const isCompleted = newProgress >= duration

  const { error } = await supabase
    .from("challenge_enrollments")
    .update({
      progress_days: newProgress,
      is_completed: isCompleted,
      last_checkin_date: today
    })
    .eq("id", enrollmentId)

  if (error) {
    console.error("Error checking in:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/community")
  return { success: true, completed: isCompleted }
}

export async function getChallengeParticipants(challengeId: string) {
    const userId = await getUserId()
    if (!userId) return []
  
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("challenge_enrollments")
      .select(`
        user_id,
        progress_days,
        profiles (full_name)
      `)
      .eq("challenge_id", challengeId)
      .neq("user_id", userId) // Exclude self
      .limit(10)
  
    if (error) {
      console.error("Error fetching participants:", error)
      return []
    }
    return data
}

export async function sendNudge(receiverId: string, challengeId: string, emoji: string) {
  const senderId = await getUserId()
  if (!senderId) return { success: false, error: "Not authenticated" }

  const supabase = await createClient()
  const { error } = await supabase
    .from("challenge_nudges")
    .insert({
      sender_id: senderId,
      receiver_id: receiverId,
      challenge_id: challengeId,
      nudge_type: 'emoji',
      message: emoji
    })

  if (error) {
    console.error("Error sending nudge:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function getRecentNudges() {
  const userId = await getUserId()
  if (!userId) return []

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("challenge_nudges")
    .select(`
      *,
      challenges (title)
    `)
    .eq("receiver_id", userId)
    .order("created_at", { ascending: false })
    .limit(5)

  if (error) {
    console.error("Error fetching nudges:", error)
    return []
  }
  return data
}
