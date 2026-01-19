import type React from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { createClient } from "@/lib/supabase/server"
import { getUserStreak, getUserProfile } from "@/actions/dashboard"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let userProfile = null
  let streak = 0

  if (user) {
    const profile = await getUserProfile(user.id)
    streak = await getUserStreak(user.id)

    // Improved name resolution
    let displayName = "User"
    if (profile?.full_name) displayName = profile.full_name
    else if (user.user_metadata?.full_name) displayName = user.user_metadata.full_name
    else if (user.email) displayName = user.email.split('@')[0] // Fallback to email username

    userProfile = {
      ...profile,
      email: user.email,
      full_name: displayName
    }
  }

  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header userProfile={userProfile} streak={streak} />
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
