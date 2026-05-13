"use server"

import { createClient } from "@/lib/supabase/server"
import { createServerClient } from "@supabase/ssr"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

// Helper to create a service role client to bypass RLS since we use custom auth
export async function createServiceClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // ignore
          }
        },
      },
    }
  )
}

// Helper to get effective user ID securely
export async function getUserId() {
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

const ADJECTIVES = ["Brave", "Calm", "Gentle", "Wise", "Peaceful", "Joyful", "Strong", "Kind", "Silent", "Radiant"]
const NOUNS = ["Panda", "River", "Oak", "Mountain", "Cloud", "Tiger", "Owl", "Breeze", "Sun", "Moon"]

function generatePseudonym() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  return `${adj} ${noun}`
}

export async function getAllCircles() {
  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from("circles")
    .select("*, circle_members(count)")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching circles:", error)
    return []
  }
  return data
}

export async function getUserCircles() {
  const userId = await getUserId()
  if (!userId) return []

  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from("circle_members")
    .select(`
      *,
      circles (*)
    `)
    .eq("user_id", userId)

  if (error) {
    console.error("Error fetching user circles:", error)
    return []
  }
  return data
}

export async function joinCircle(circleId: string) {
  const userId = await getUserId()
  if (!userId) return { success: false, error: "Not authenticated" }

  const supabase = await createServiceClient()
  
  // Assign a random pseudonym
  const pseudonym = generatePseudonym()

  const { error } = await supabase
    .from("circle_members")
    .insert({
      user_id: userId,
      circle_id: circleId,
      pseudonym
    })

  if (error) {
    console.error("Error joining circle:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/community")
  return { success: true, pseudonym }
}

export async function createCircle(name: string, description: string) {
  const userId = await getUserId()
  if (!userId) return { success: false, error: "Not authenticated" }

  const supabase = await createServiceClient()
  
  // 1. Create the circle
  const { data: circle, error: createError } = await supabase
    .from("circles")
    .insert({
      name,
      description,
      creator_id: userId,
      icon: '👥',
      color_gradient: 'from-violet-500/20 to-fuchsia-500/20',
      is_official: false
    })
    .select()
    .single()

  if (createError || !circle) {
    return { success: false, error: createError?.message || "Failed to create circle" }
  }

  // 2. Automatically join the creator as a member
  const pseudonym = generatePseudonym()
  await supabase.from("circle_members").insert({
    user_id: userId,
    circle_id: circle.id,
    pseudonym
  })

  revalidatePath("/dashboard/community")
  return { success: true, circleId: circle.id }
}

export async function getCirclePosts(circleId: string) {
  const supabase = await createServiceClient()
  
  // 1. Fetch posts
  const { data: posts, error: postsError } = await supabase
    .from("circle_posts")
    .select("*")
    .eq("circle_id", circleId)
    .order("created_at", { ascending: false })
    .limit(50)

  if (postsError || !posts) {
    console.error("Error fetching circle posts:", postsError)
    return []
  }

  // 2. Fetch members of this circle to get their pseudonyms
  const userIds = [...new Set(posts.map(p => p.user_id))]
  
  if (userIds.length === 0) return []

  const { data: members, error: membersError } = await supabase
    .from("circle_members")
    .select("user_id, pseudonym")
    .eq("circle_id", circleId)
    .in("user_id", userIds)

  if (membersError) {
    console.error("Error fetching members:", membersError)
  }
  
  // 3. Map pseudonyms to posts
  return posts.map(post => {
    const member = members?.find(m => m.user_id === post.user_id)
    return {
      ...post,
      pseudonym: member?.pseudonym || 'Anonymous User'
    }
  })
}

export async function createCirclePost(circleId: string, content: string) {
  const userId = await getUserId()
  if (!userId) return { success: false, error: "Not authenticated" }

  const supabase = await createServiceClient()
  const { error } = await supabase
    .from("circle_posts")
    .insert({
      circle_id: circleId,
      user_id: userId,
      content
    })

  if (error) {
    console.error("Error creating post:", error)
    return { success: false, error: error.message }
  }

  revalidatePath(`/dashboard/community/${circleId}`)
  return { success: true }
}
