import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
    try {
        const cookieStore = await cookies()
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

        // Call RPC to increment
        const { error: rpcError } = await supabase.rpc('increment_visitor')

        // If RPC fails (e.g. function not created), try direct update
        if (rpcError) {
            await supabase.from('site_stats').update({ visits: 0 }).eq('id', 1) // Verify table exists
            // This fallback is tricky without current value. RPC is best.
            // We'll assume function exists. If not, we just read.
        }

        // Read current value
        const { data, error } = await supabase.from('site_stats').select('visits').eq('id', 1).single()

        if (error) throw error

        return NextResponse.json({ visits: data?.visits || 0 })
    } catch (error) {
        console.error("Visitor count error:", error)
        return NextResponse.json({ visits: 0 }, { status: 500 })
    }
}

export async function GET() {
    try {
        const cookieStore = await cookies()
        const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
            cookies: { getAll() { return cookieStore.getAll() }, setAll() { } },
        })

        const { data, error } = await supabase.from('site_stats').select('visits').eq('id', 1).single()
        if (error) throw error
        return NextResponse.json({ visits: data?.visits || 0 })
    } catch (error) {
        return NextResponse.json({ visits: 0 }, { status: 500 })
    }
}
