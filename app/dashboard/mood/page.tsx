import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { MoodTracker } from "@/components/mood/mood-tracker"
import { MoodHistory } from "@/components/mood/mood-history"
import { UnifiedMoodDashboard } from "@/components/mood/unified-mood-dashboard"
// HiddenLotus removed

export const metadata = {
  title: "Mood Tracker - MindCare AI",
  description: "Track your daily mood and emotions",
}

import { Suspense } from "react"
import { HistorySkeleton } from "@/components/ui/history-skeleton"
import { AdsterraBanner } from "@/components/ads/adsterra-banner"

export default async function MoodPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            Mood Tracker
          </h1>
          <p className="text-muted-foreground mt-1">Monitor your emotional patterns over time</p>
        </div>
      </div>

      {/* Monetization: Adsterra Banner */}
      <AdsterraBanner adKey={process.env.NEXT_PUBLIC_ADSTERRA_KEY || ""} className="my-4" />

      <Suspense fallback={
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
             <div className="h-64 bg-muted animate-pulse rounded-xl" />
             <div className="h-64 bg-muted animate-pulse rounded-xl" />
          </div>
          <HistorySkeleton count={3} />
        </div>
      }>
         <MoodDashboardContent />
      </Suspense>
    </div>
  )
}

async function MoodDashboardContent() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("mindcare_session")?.value

  if (!sessionToken) {
    redirect("/auth/login")
  }

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      getAll() { return cookieStore.getAll() },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch { }
      },
    },
  })

  let userId
  try {
    const decoded = Buffer.from(sessionToken, "base64").toString()
    userId = decoded.split(":")[0]
  } catch (e) {
    redirect("/auth/login")
  }

  const { data: moodLogs } = await supabase
    .from("mood_logs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(30)

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <UnifiedMoodDashboard moodLogs={moodLogs || []} />
        <MoodTracker userId={userId} />
      </div>

      <div className="mt-6">
        <MoodHistory moodLogs={moodLogs || []} />
      </div>
    </>
  )
}

