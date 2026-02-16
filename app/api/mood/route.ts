import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies()
        const sessionToken = cookieStore.get("mindcare_session")?.value

        if (!sessionToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        let userId
        try {
            const decoded = Buffer.from(sessionToken, "base64").toString()
            userId = decoded.split(":")[0]
        } catch (e) {
            return NextResponse.json({ error: "Invalid session" }, { status: 401 })
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
                    }
                },
            },
        })

        const body = await request.json()
        const { mood, intensity, notes, activities } = body

        const { data, error } = await supabase.from("mood_logs").insert({
            user_id: userId,
            mood,
            intensity,
            notes,
            activities
        }).select()

        if (error) {
            console.error("Supabase insert error:", error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Revalidate dashboard to update streak
        revalidatePath("/dashboard")
        revalidatePath("/dashboard/mood")

        return NextResponse.json({ success: true, data }, { status: 200 })

    } catch (error) {
        console.error("API Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
