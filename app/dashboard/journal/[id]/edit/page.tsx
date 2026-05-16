import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { EditJournalForm } from "@/components/journal/edit-journal-form"

export const metadata = {
  title: "Edit Journal - MindCare AI",
}

export default async function EditJournalPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("mindcare_session")?.value

    if (!sessionToken) redirect("/auth/login")

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

    // Safe decoding of base64 token
    let userId
    try {
        const decoded = Buffer.from(sessionToken, "base64").toString()
        userId = decoded.split(":")[0]
    } catch (e) {
        redirect("/auth/login")
    }

    if (!userId) redirect("/auth/login")

    const { data: entry, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("id", id)
        .single()

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-12">
                <h1 className="text-2xl font-bold">Error Loading Entry</h1>
                <p className="text-muted-foreground mt-2">{error.message}</p>
                <Link href="/dashboard/journal">
                    <Button className="mt-4">Return to Journal</Button>
                </Link>
            </div>
        )
    }

    if (!entry || entry.user_id !== userId) {
        return (
            <div className="flex flex-col items-center justify-center p-12">
                <h1 className="text-2xl font-bold">Unauthorized</h1>
                <p className="text-muted-foreground mt-2">You do not have permission to edit this entry.</p>
                <Link href="/dashboard/journal">
                    <Button className="mt-4">Return to Journal</Button>
                </Link>
            </div>
        )
    }

    return <EditJournalForm entry={entry} />
}
