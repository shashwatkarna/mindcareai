import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { AssessmentsList } from "@/components/assessments/assessments-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Archive } from "lucide-react"

export const metadata = {
  title: "Assessment Archives - MindCare AI",
  description: "Complete history of your mental health assessments",
}

export default async function AssessmentArchivePage() {
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
          // Handle errors
        }
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

  if (!userId) {
    redirect("/auth/login")
  }

  const { data: user } = await supabase.from("users").select("*").eq("id", userId).single()
  if (!user) redirect("/auth/login")

  const { data: assessments } = await supabase
    .from("assessments")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4">
        <Link 
          href="/dashboard/assessments" 
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Archive className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Assessment Archives</h1>
            <p className="text-muted-foreground mt-1">Viewing all {assessments?.length || 0} historical records</p>
          </div>
        </div>
      </div>

      <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8">
        <AssessmentsList assessments={assessments || []} />
      </div>
    </div>
  )
}
