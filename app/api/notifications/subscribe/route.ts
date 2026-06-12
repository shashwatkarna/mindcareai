import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const subscription = await request.json()
    const cookieStore = await cookies()
    
    // Get the user if they are logged in
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll() {},
        },
      }
    )

    // Check session
    const sessionToken = cookieStore.get("mindcare_session")?.value
    let userId = null
    
    if (sessionToken) {
      try {
        const decoded = Buffer.from(sessionToken, "base64").toString()
        userId = decoded.split(":")[0]
      } catch (e) {
        // Not fatal, we can still save anonymous subscriptions or just ignore
      }
    }

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 })
    }

    // Save to database
    const { error } = await supabase
      .from("push_subscriptions")
      .upsert({
        user_id: userId, // Might be null, that's fine if the DB allows it, else we only save for logged-in users
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      }, { onConflict: "endpoint" })

    if (error) {
      console.error("Database error saving subscription:", error)
      return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in subscribe route:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
