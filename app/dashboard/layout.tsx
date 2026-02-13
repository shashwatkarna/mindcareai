import type React from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { createClient } from "@/lib/supabase/server"
import { getUserStreak, getUserProfile } from "@/actions/dashboard"
import { getNotificationData, NotificationData } from "@/actions/notifications"

import { cookies } from "next/headers"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let userProfile = null
  let streakData = { streak: 0, history: [] as string[] }
  let notificationData: NotificationData = { hasLoggedMood: false, hasJournaled: false, streak: 0 }

  console.log("DEBUG: Dashboard Layout Rendered")
  console.log("DEBUG: Supabase Auth User ID:", user?.id)

  let mindcareUserId = null
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("mindcare_session")?.value
  if (sessionToken) {
    try {
      const decoded = Buffer.from(sessionToken, "base64").toString()
      mindcareUserId = decoded.split(":")[0]
      console.log("DEBUG: MindCare Session User ID:", mindcareUserId)
    } catch (e) {
      console.log("DEBUG: Failed to decode mindcare_session")
    }
  }

  const effectiveUserId = user?.id || mindcareUserId

  if (effectiveUserId) {
    const profile = await getUserProfile(effectiveUserId)
    streakData = await getUserStreak(effectiveUserId)
    notificationData = await getNotificationData(effectiveUserId)

    // Improved name resolution
    let displayName = "User"
    if (profile?.full_name) displayName = profile.full_name
    else if (user?.user_metadata?.full_name) displayName = user.user_metadata.full_name
    else if (user?.user_metadata?.name) displayName = user.user_metadata.name
    else if (user?.email) displayName = user.email.split('@')[0]

    userProfile = {
      ...profile,
      email: user?.email || "",
      full_name: displayName,
      is_premium: true // Temporary testing override
    }
  }

  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300 relative overflow-hidden print:overflow-visible print:h-auto">
      {/* Ambient Background Blobs - Hide on print */}
      <div className="fixed inset-0 -z-10 pointer-events-none print:hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl opacity-50 animate-pulse [animation-delay:2s]"></div>
      </div>

      <div className="print:hidden h-full flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 relative z-10 print:w-full print:h-full print:absolute print:inset-0 print:z-50">
        <div className="print:hidden">
          <Header userProfile={userProfile} streakData={streakData} notificationData={notificationData} />
        </div>
        <main className="flex-1 overflow-auto p-4 md:p-6 print:overflow-visible print:p-0 print:m-0">{children}</main>
      </div>
    </div>
  )
}
