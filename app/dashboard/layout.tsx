import type React from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { createClient } from "@/lib/supabase/server"
import { getUserStreak, getUserProfile } from "@/actions/dashboard"
import { getNotificationData, NotificationData } from "@/actions/notifications"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let userProfile = null
  let streakData = { streak: 0, history: [] as string[] }
  let notificationData: NotificationData = { hasLoggedMood: false, hasJournaled: false, streak: 0 }

  if (user) {
    const profile = await getUserProfile(user.id)
    streakData = await getUserStreak(user.id)
    notificationData = await getNotificationData(user.id)

    // Improved name resolution
    let displayName = "User"
    if (profile?.full_name) displayName = profile.full_name
    else if (user.user_metadata?.full_name) displayName = user.user_metadata.full_name
    else if (user.email) displayName = user.email.split('@')[0] // Fallback to email username

    userProfile = {
      ...profile,
      email: user.email,
      full_name: displayName,
      is_premium: true // Temporary testing override
    }
  }

  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
      {/* Ambient Background Blobs */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl opacity-50 animate-pulse [animation-delay:2s]"></div>
      </div>

      <Sidebar />
      <div className="flex flex-col flex-1 relative z-10">
        <Header userProfile={userProfile} streakData={streakData} notificationData={notificationData} />
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
