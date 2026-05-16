"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

async function getUserId() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("mindcare_session")?.value
  if (!sessionToken) return null

  try {
    const decoded = Buffer.from(sessionToken, "base64").toString()
    return decoded.split(":")[0]
  } catch (e) {
    return null
  }
}

async function getSupabase() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role for backend actions
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
}

export async function deleteJournalEntry(entryId: string) {
  const userId = await getUserId()
  console.log(`[Journal Action] Deleting entry ${entryId} for user ${userId}`)
  
  if (!userId) return { success: false, error: "Unauthorized" }

  const supabase = await getSupabase()
  
  // Verify ownership before deleting even with service role for safety
  const { data: entry, error: fetchError } = await supabase
    .from("journal_entries")
    .select("user_id")
    .eq("id", entryId)
    .single()

  if (fetchError || !entry) {
    console.error(`[Journal Action] Fetch error or entry not found:`, fetchError)
    return { success: false, error: "Entry not found" }
  }

  if (String(entry.user_id) !== String(userId)) {
    console.error(`[Journal Action] Unauthorized delete attempt: entry.user_id(${entry.user_id}) !== userId(${userId})`)
    return { success: false, error: "Unauthorized" }
  }

  const { error } = await supabase
    .from("journal_entries")
    .delete()
    .eq("id", entryId)

  if (error) {
    console.error(`[Journal Action] Delete error:`, error)
    return { success: false, error: error.message }
  }

  console.log(`[Journal Action] Successfully deleted entry ${entryId}`)
  revalidatePath("/dashboard/journal")
  return { success: true }
}

export async function updateJournalEntry(entryId: string, title: string, content: string) {
  const userId = await getUserId()
  console.log(`[Journal Action] Updating entry ${entryId} for user ${userId}`)

  if (!userId) return { success: false, error: "Unauthorized" }

  const supabase = await getSupabase()

  // Verify ownership
  const { data: entry, error: fetchError } = await supabase
    .from("journal_entries")
    .select("user_id")
    .eq("id", entryId)
    .single()

  if (fetchError || !entry) {
    console.error(`[Journal Action] Fetch error or entry not found for update:`, fetchError)
    return { success: false, error: "Entry not found" }
  }

  if (String(entry.user_id) !== String(userId)) {
    console.error(`[Journal Action] Unauthorized update attempt: entry.user_id(${entry.user_id}) !== userId(${userId})`)
    return { success: false, error: "Unauthorized" }
  }

  const { error } = await supabase
    .from("journal_entries")
    .update({ title, content })
    .eq("id", entryId)

  if (error) {
    console.error(`[Journal Action] Update error:`, error)
    return { success: false, error: error.message }
  }

  console.log(`[Journal Action] Successfully updated entry ${entryId}`)
  revalidatePath("/dashboard/journal")
  revalidatePath(`/dashboard/journal/${entryId}`)
  return { success: true }
}
