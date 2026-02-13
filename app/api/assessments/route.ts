import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies()
        const sessionToken = cookieStore.get("mindcare_session")?.value

        if (!sessionToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Safe decoding of base64 token
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
                        // Handle errors during cookie setting
                    }
                },
            },
        })

        const body = await request.json()
        const { assessment_type, responses, score, risk_level } = body

        const { data, error } = await supabase.from("assessments").insert({
            user_id: userId,
            assessment_type,
            responses,
            score,
            risk_level,
        }).select().single()

        if (error) {
            console.error("Supabase insert error:", error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, data }, { status: 200 })

    } catch (error) {
        console.error("API Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
