import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { JournalList } from "@/components/journal/journal-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "Journal - MindCare AI",
  description: "Your private journal entries",
}

import { Suspense } from "react"
import { HistorySkeleton } from "@/components/ui/history-skeleton"
import { AdsterraBanner } from "@/components/ads/adsterra-banner"

export default async function JournalPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Journal</h1>
          <p className="text-muted-foreground mt-1">Write and reflect on your thoughts and feelings</p>
        </div>
        <Link href="/dashboard/journal/new">
          <Button className="bg-primary hover:bg-primary/90 text-white">New Entry</Button>
        </Link>
      </div>

      {/* Monetization: Adsterra Banner */}
      <AdsterraBanner adKey={process.env.NEXT_PUBLIC_ADSTERRA_KEY || ""} className="my-4" />

      <Suspense fallback={<HistorySkeleton count={5} />}>
         <JournalContainer />
      </Suspense>
    </div>
  )
}

async function JournalContainer() {
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

  const { data: entries } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  return <JournalList entries={entries || []} />
}

