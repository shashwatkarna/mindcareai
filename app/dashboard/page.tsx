import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { DashboardOverview } from "@/components/dashboard/overview"

import { Greeting } from "@/components/dashboard/greeting"

export const metadata = {
  title: "Dashboard - MindCare AI",
  description: "Your wellness dashboard",
}

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("mindcare_session")?.value

  if (!sessionToken) {
    redirect("/auth/login")
  }

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Handle errors during cookie setting
        }
      },
    },
  })

  // Safe decoding of base64 token
  let userId
  try {
    const decoded = Buffer.from(sessionToken, "base64").toString()
    userId = decoded.split(":")[0]
  } catch (e) {
    redirect("/auth/login")
  }

  if (!userId) {
    redirect("/auth/login")
  }

  const { data: user } = await supabase.from("users").select("*").eq("id", userId).single()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()
  const profile = { ...profileData, is_premium: true } // Temporary testing override

  // Fetch stats concurrently
  const [moodResult, journalResult, assessmentResult, appointmentResult] = await Promise.all([
    supabase.from("mood_logs").select("*", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("journal_entries").select("*", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("assessments").select("*", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("appointments").select("*", { count: "exact", head: true }).eq("user_id", userId),
  ])

  const stats = {
    moodLogs: moodResult.count || 0,
    journalEntries: journalResult.count || 0,
    assessments: assessmentResult.count || 0,
    appointments: appointmentResult.count || 0,
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Greeting name={profile?.full_name || user.full_name || "User"} />

        </h1>
        <p className="text-muted-foreground mt-1">Here&apos;s your wellness snapshot for today</p>
      </div>

      {/* Premium CTA Banner */}
      {!profile?.is_premium && (
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-4 flex items-center justify-between animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="p-2 bg-primary/20 rounded-lg text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Upgrade to Premium</h3>
              <p className="text-sm text-muted-foreground">Unlock exclusive self-care exercises for just ₹1.</p>
            </div>
          </div>

          <a href="/pricing" className="ml-4 whitespace-nowrap px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:shadow-md transition-all relative z-10">
            Upgrade Now
          </a>
        </div>
      )}

      <DashboardOverview userId={user.id} stats={stats} />
    </div>
  )
}