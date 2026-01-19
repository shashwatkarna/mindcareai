"use client"

import { Card } from "@/components/ui/card"

interface MoodLog {
  id: string
  mood: string
  intensity: number
  notes: string | null
  activities: string[]
  created_at: string
}

export function MoodHistory({ moodLogs }: { moodLogs: MoodLog[] }) {
  const getMoodEmoji = (mood: string) => {
    const moodMap: { [key: string]: string } = {
      happy: "😊",
      sad: "😢",
      anxious: "😰",
      calm: "😌",
      stressed: "😤",
      energetic: "⚡",
    }
    return moodMap[mood] || "😐"
  }

  if (moodLogs.length === 0) {
    return (
      <Card className="p-8 border-[#e0d9d3] bg-white text-center">
        <p className="text-[#6b6b6b]">No mood logs yet. Start tracking to see your patterns!</p>
      </Card>
    )
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-[#3d3d3d] mb-4">Mood History</h3>
      <div className="space-y-3">
        {moodLogs.map((log) => (
          <Card key={log.id} className="p-4 border-[#e0d9d3] bg-white">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{getMoodEmoji(log.mood)}</span>
                  <div>
                    <p className="font-semibold text-[#3d3d3d]">{log.mood}</p>
                    <p className="text-xs text-[#6b6b6b]" suppressHydrationWarning>
                      {new Date(log.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                {log.activities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {log.activities.map((activity) => (
                      <span key={activity} className="text-xs bg-[#f5f3f0] text-[#3d3d3d] px-2 py-1 rounded">
                        {activity}
                      </span>
                    ))}
                  </div>
                )}
                {log.notes && <p className="text-sm text-[#6b6b6b]">{log.notes}</p>}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-2xl font-bold text-[#8b7355]">{log.intensity}</p>
                <p className="text-xs text-[#6b6b6b]">Intensity</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
