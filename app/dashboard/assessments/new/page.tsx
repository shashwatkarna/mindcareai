import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { AssessmentForm } from "@/components/assessments/assessment-form"

export const metadata = {
  title: "New Assessment - MindCare AI",
  description: "Start a new assessment",
}

export default async function NewAssessmentPage() {
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

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Start Assessment</h1>
        <p className="text-muted-foreground mt-2">Choose an assessment to help track your mental health</p>
      </div>

      <AssessmentForm userId={user.id} />
    </div>
  )
}
