import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { AssessmentsList } from "@/components/assessments/assessments-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#3d3d3d]">Assessments</h1>
          <p className="text-[#6b6b6b] mt-1">Complete mental health assessments to track your wellbeing</p>
        </div>
        <Link href="/dashboard/assessments/new">
          <Button className="bg-[#8b7355] hover:bg-[#6b5344] text-white">New Assessment</Button>
        </Link>
      </div>

      <AssessmentsList assessments={assessments || []} />
    </div>
  )
}
