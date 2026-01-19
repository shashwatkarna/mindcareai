"use client"

import { Card } from "@/components/ui/card"
import { DailyQuote } from "@/components/dashboard/daily-quote"

interface DashboardOverviewProps {
  userId: string
  stats: {
    moodLogs: number
    journalEntries: number
    assessments: number
    appointments: number
  }
}

export function DashboardOverview({ userId, stats }: DashboardOverviewProps) {
  const loading = false

  const statCards = [
    { label: "Mood Logs", value: stats.moodLogs, icon: "😊", color: "from-blue-500/10 to-cyan-500/10", border: "hover:border-blue-500/50" },
    { label: "Journal Entries", value: stats.journalEntries, icon: "📝", color: "from-purple-500/10 to-pink-500/10", border: "hover:border-purple-500/50" },
    { label: "Assessments", value: stats.assessments, icon: "📋", color: "from-green-500/10 to-emerald-500/10", border: "hover:border-green-500/50" },
    { label: "Appointments", value: stats.appointments, icon: "📅", color: "from-orange-500/10 to-amber-500/10", border: "hover:border-orange-500/50" },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <Card
            key={stat.label}
            className={`p-6 border-border bg-gradient-to-br ${stat.color} hover:shadow-md transition-all duration-300 group ${stat.border}`}
            style={{ animation: `slideInUp 0.5s ease-out ${i * 100}ms forwards`, opacity: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground mt-2 group-hover:scale-105 transition-transform origin-left">
                  {loading ? "..." : stat.value}
                </p>
              </div>
              <div className="text-4xl group-hover:rotate-12 transition-transform duration-300 drop-shadow-sm">{stat.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Daily Quote Section (Fills blank space) */}
      <DailyQuote />
    </div>
  )
}
