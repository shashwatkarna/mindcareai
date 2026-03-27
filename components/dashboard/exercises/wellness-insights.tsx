"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Timer, Star, BarChart2, Flame, Activity } from "lucide-react"

interface WellnessStats {
    totalSessions: number
    totalMinutes: number
    mostUsed: string
    mostUsedCount: number
    streak: number
}

export function WellnessInsights() {
    const [stats, setStats] = useState<WellnessStats | null>(null)

    useEffect(() => {
        // Load from localStorage
        const raw = localStorage.getItem("wellness_activity")
        if (raw) {
            const data = JSON.parse(raw)
            const logEntries = data.logs || []
            
            const totalSessions = logEntries.length
            const totalSeconds = logEntries.reduce((acc: number, curr: any) => acc + (curr.duration || 0), 0)
            
            // Calculate most used
            const counts: Record<string, number> = {}
            logEntries.forEach((entry: any) => {
                counts[entry.id] = (counts[entry.id] || 0) + 1
            })
            
            let mostUsed = "None"
            let mostUsedCount = 0
            Object.entries(counts).forEach(([id, count]) => {
                if (count > mostUsedCount) {
                    mostUsed = id
                    mostUsedCount = count
                }
            })

            setStats({
                totalSessions,
                totalMinutes: Math.round(totalSeconds / 60),
                mostUsed: mostUsed === "None" ? "N/A" : mostUsed.charAt(0).toUpperCase() + mostUsed.slice(1),
                mostUsedCount,
                streak: data.streak || 0
            })
        }
    }, [])

    if (!stats || stats.totalSessions === 0) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-muted/30 border border-dashed border-border p-4 rounded-3xl mb-8 flex items-center justify-between group hover:bg-muted/50 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-background shadow-sm text-primary group-hover:scale-110 transition-transform">
                        <Activity className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm">Start Your Wellness Journey</h4>
                        <p className="text-xs text-muted-foreground">Complete your first exercise to see personalized insights here.</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Live Tracking Active</span>
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
            <InsightCard 
                icon={BarChart2} 
                label="Total Sessions" 
                value={stats.totalSessions.toString()} 
                color="text-blue-500"
                bg="bg-blue-50"
            />
            <InsightCard 
                icon={Timer} 
                label="Mindful Minutes" 
                value={`${stats.totalMinutes}m`} 
                color="text-emerald-500"
                bg="bg-emerald-50"
            />
            <InsightCard 
                icon={Star} 
                label="Top Exercise" 
                value={stats.mostUsed} 
                subValue={`${stats.mostUsedCount} times`}
                color="text-amber-500"
                bg="bg-amber-50"
            />
             <InsightCard 
                icon={Flame} 
                label="Wellness Streak" 
                value={`${stats.streak}d`} 
                color="text-orange-500"
                bg="bg-orange-50"
            />
        </motion.div>
    )
}

function InsightCard({ icon: Icon, label, value, subValue, color, bg }: any) {
    return (
        <div className={`p-4 rounded-2xl border border-border bg-card shadow-sm flex flex-col items-center text-center space-y-1`}>
            <div className={`p-2 rounded-xl ${bg} ${color} mb-1`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{label}</div>
            <div className="text-xl font-bold text-foreground">{value}</div>
            {subValue && <div className="text-[10px] font-bold text-muted-foreground/60">{subValue}</div>}
        </div>
    )
}
