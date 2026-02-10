"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function EditJournalPage({ params }: { params: { id: string } }) {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const fetchEntry = async () => {
            const supabase = createClient()
            const { data, error } = await supabase.from("journal_entries").select("*").eq("id", params.id).single()

            if (error) {
                toast.error("Failed to load entry")
                router.push("/dashboard/journal")
                return
            }

            setTitle(data.title)
            setContent(data.content)
            setLoading(false)
        }
        fetchEntry()
    }, [params.id, router])

    const handleSave = async () => {
        setSaving(true)
        const supabase = createClient()
        const { error } = await supabase
            .from("journal_entries")
            .update({ title, content })
            .eq("id", params.id)

        if (error) {
            toast.error("Failed to update entry")
        } else {
            toast.success("Entry updated!")
            router.push("/dashboard/journal")
            router.refresh()
        }
        setSaving(false)
    }

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/journal">
                    <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
                </Link>
                <h1 className="text-2xl font-bold">Edit Entry</h1>
            </div>

            <Card className="p-6 space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Content</label>
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-[300px]"
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <Link href="/dashboard/journal">
                        <Button variant="outline">Cancel</Button>
                    </Link>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? <Loader2 className="animate-spin mr-2" /> : null}
                        Save Changes
                    </Button>
                </div>
            </Card>
        </div>
    )
}
