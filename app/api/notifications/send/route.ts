import { NextResponse } from "next/server"
import webpush from "web-push"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// Configure web-push with VAPID details
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || "mailto:admin@mindcare.ai",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function POST(request: Request) {
  try {
    const { title, message, url, userId } = await request.json()
    
    const cookieStore = await cookies()
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

    let query = supabase.from("push_subscriptions").select("*")
    if (userId) {
      query = query.eq("user_id", userId)
    }

    const { data: subscriptions, error } = await query

    if (error || !subscriptions) {
      return NextResponse.json({ error: "Could not fetch subscriptions" }, { status: 500 })
    }

    const payload = JSON.stringify({
      title: title || "MindCare AI",
      body: message || "Time for your daily check-in!",
      url: url || "/dashboard",
      icon: "/icon-light-32x32.png"
    })

    const sendPromises = subscriptions.map(async (sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      }

      try {
        await webpush.sendNotification(pushSubscription, payload)
      } catch (err: any) {
        if (err.statusCode === 404 || err.statusCode === 410) {
          // Subscription has expired or is no longer valid, delete it
          await supabase.from("push_subscriptions").delete().eq("endpoint", sub.endpoint)
        } else {
          console.error("Error sending push notification:", err)
        }
      }
    })

    await Promise.all(sendPromises)

    return NextResponse.json({ success: true, sentCount: subscriptions.length })
  } catch (error) {
    console.error("Error in send push route:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
