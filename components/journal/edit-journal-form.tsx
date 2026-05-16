"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { updateJournalEntry } from "@/actions/journal"

interface JournalEntry {
    id: string
    title: string
    content: string
}

export function EditJournalForm({ entry }: { entry: JournalEntry }) {
    const [title, setTitle] = useState(entry.title)
    const [content, setContent] = useState(entry.content)
    const [saving, setSaving] = useState(false)
    const router = useRouter()

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) {
            toast.error("Title and content are required")
            return
        }

        setSaving(true)
        try {
            const res = await updateJournalEntry(entry.id, title, content)
            if (res.success) {
                toast.success("Entry updated!")
                router.push("/dashboard/journal")
                router.refresh()
            } else {
                toast.error(res.error || "Failed to update entry")
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
        } finally {
            setSaving(false)
        }
    }

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
                    <Input 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        disabled={saving}
                        placeholder="Entry Title"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Content</label>
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-[300px]"
                        disabled={saving}
                        placeholder="Write your thoughts here..."
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <Link href="/dashboard/journal">
                        <Button variant="outline" disabled={saving}>Cancel</Button>
                    </Link>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : null}
                        Save Changes
                    </Button>
                </div>
            </Card>
        </div>
    )
}
