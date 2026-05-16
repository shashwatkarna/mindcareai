import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { AssessmentsList } from "@/components/assessments/assessments-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { UnifiedAssessmentDashboard } from "@/components/assessments/unified-assessment-dashboard"

export const metadata = {
  title: "Assessments - MindCare AI",
  description: "Mental health assessments",
}

export default async function AssessmentsPage() {
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

  const { data: assessments } = await supabase
    .from("assessments")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Normalize scores to 0-100 for chart if needed, or just pass raw if consistent
  // The current AssessmentForm calculates 0-100 score.

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assessments</h1>
          <p className="text-muted-foreground mt-1">Track your mental wellbeing over time</p>
        </div>
        <Link href="/dashboard/assessments/new">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Start New Assessment
          </Button>
        </Link>
      </div>

      {assessments && assessments.length > 0 && (
        <UnifiedAssessmentDashboard assessments={assessments} />
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent History</h2>
          {assessments && assessments.length > 0 && (
            <Link href="/dashboard/assessments/archive">
              <Button variant="outline" size="sm" className="text-muted-foreground hover:text-primary border-border/50">
                View Archives
              </Button>
            </Link>
          )}
        </div>
        <AssessmentsList assessments={assessments?.slice(0, 12) || []} />
        
        {assessments && assessments.length > 12 && (
          <div className="mt-6 text-center">
            <Link href="/dashboard/assessments/archive">
              <Button variant="ghost" className="text-primary font-medium hover:bg-primary/5">
                Show more in Archives...
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
