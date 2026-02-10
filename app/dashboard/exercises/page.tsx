import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { Lock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ExercisesContainer } from "@/components/dashboard/exercises/exercises-container"

export const metadata = {
    title: "Exercises - MindCare AI",
    description: "Guided mental wellness exercises",
}

export default async function ExercisesPage() {
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

    // Decode session token
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

    const { data: profile } = await supabase.from("profiles").select("is_premium").eq("id", userId).single()

    // Check for the "Golden Ticket" cookie or Database status
    // const isUnlockedViaCookie = cookieStore.get("mindcare_premium_unlocked")?.value === "true"
    // const isPremium = profile?.is_premium || isUnlockedViaCookie;
    const isPremium = true; // Temporary testing override

    return (
        <div className="space-y-8 min-h-[calc(100vh-8rem)]">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Wellness Exercises</h1>
                <p className="text-muted-foreground mt-1">Tools to calm your mind and body</p>
            </div>

            {isPremium ? (
                <ExercisesContainer isPremium={isPremium} />
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border border-dashed border-gray-300 text-center px-4">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 text-indigo-500">
                        <Lock className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground mb-4">Premium Content</h2>
                    <p className="text-lg text-muted-foreground max-w-md mb-8">
                        Unlock our full library of guided exercises, including the 4-7-8 Breathing Tool, for just ₹1.
                    </p>
                    <Link href="/pricing">
                        <Button size="lg" className="rounded-full px-8 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl">
                            Unlock Premium Access
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    )
}
