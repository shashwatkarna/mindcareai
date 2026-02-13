import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, GripHorizontal, Lock, Unlock } from "lucide-react"

export const metadata = {
    title: "Journal Entry - MindCare AI",
}

export default async function JournalEntryPage({ params }: { params: Promise<{ id: string }> }) {
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

    const { data: entry } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("id", id)
        .single()

    if (!entry) {
        return (
            <div className="flex flex-col items-center justify-center p-12">
                <h1 className="text-2xl font-bold">Entry Not Found</h1>
                <Link href="/dashboard/journal">
                    <Button className="mt-4">Return to Journal</Button>
                </Link>
            </div>
        )
    }

    const getMoodEmoji = (mood: string | null) => {
        const moodMap: { [key: string]: string } = {
            happy: "😊", sad: "😢", anxious: "😰", calm: "😌",
            stressed: "😤", hopeful: "🙂", confused: "🤔", grateful: "🙏",
        }
        return moodMap[mood || ""] || "📝"
    }

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <Link href="/dashboard/journal">
                <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Journal
                </Button>
            </Link>

            <div className="bg-card border shadow-sm rounded-xl overflow-hidden">
                {/* Header */}
                <div className="bg-secondary/30 p-8 border-b flex justify-between items-start">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wider font-semibold">
                            <Calendar className="w-4 h-4" />
                            {new Date(entry.created_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground leading-tight">
                            {entry.title}
                        </h1>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="text-4xl" title={entry.mood}>
                            {getMoodEmoji(entry.mood)}
                        </div>
                        {entry.is_private ? (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded-full">
                                <Lock className="w-3 h-3" /> Private
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded-full">
                                <Unlock className="w-3 h-3" /> Public
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Body */}
                <div className="p-8 md:p-12 min-h-[400px] font-serif text-lg leading-loose text-foreground/90 whitespace-pre-wrap">
                    {entry.content}
                </div>

                {/* Footer */}
                <div className="bg-secondary/10 p-4 border-t flex justify-center">
                    <GripHorizontal className="text-muted-foreground/30" />
                </div>
            </div>
        </div>
    )
}
