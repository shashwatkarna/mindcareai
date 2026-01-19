import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const { userId } = await request.json()

        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 })
        }

        // Initialize Supabase Admin Client (Service Role needed to update other users' profiles)
        // We strictly use the service role key here for the "backend" payment webhook simulation
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // Update profile to premium
        const { error } = await supabase
            .from("profiles")
            .update({ is_premium: true })
            .eq("id", userId)

        if (error) {
            console.error("Database update error:", error)
            return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Payment API error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
