"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface JournalEntry {
  id: string
  title: string
  content: string
  mood: string | null
  mood_score: number | null
  created_at: string
}

export function JournalList({ entries }: { entries: JournalEntry[] }) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (entryId: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return

    setDeletingId(entryId)
    try {
      const supabase = createClient()
      await supabase.from("journal_entries").delete().eq("id", entryId)
      window.location.reload()
    } catch (error) {
      console.error("Error deleting entry:", error)
      alert("Failed to delete entry")
    } finally {
      setDeletingId(null)
    }
  }

  const getMoodEmoji = (mood: string | null) => {
    const moodMap: { [key: string]: string } = {
      happy: "😊",
      sad: "😢",
      anxious: "😰",
      calm: "😌",
      stressed: "😤",
      hopeful: "🙂",
      confused: "🤔",
      grateful: "🙏",
    }
    return moodMap[mood || ""] || "📝"
  }

  if (entries.length === 0) {
    return (
      <Card className="p-12 border-[#e0d9d3] bg-white text-center">
        <p className="text-[#6b6b6b]">No journal entries yet. Start writing to begin your reflective journey.</p>
        <Link href="/dashboard/journal/new">
          <button className="mt-4 px-4 py-2 bg-[#8b7355] text-white rounded-md hover:bg-[#6b5344]">
            Write First Entry
          </button>
        </Link>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <Card key={entry.id} className="p-6 border-[#e0d9d3] bg-white hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#3d3d3d] truncate">{entry.title}</h3>
                  <p className="text-xs text-[#6b6b6b]">{new Date(entry.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="text-sm text-[#6b6b6b] mt-3 line-clamp-2">{entry.content}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {entry.mood_score && (
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#8b7355]">{entry.mood_score}</p>
                  <p className="text-xs text-[#6b6b6b]">Score</p>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(entry.id)}
                disabled={deletingId === entry.id}
                className="text-red-600 hover:text-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
