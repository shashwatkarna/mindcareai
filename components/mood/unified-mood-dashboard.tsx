"use client"

import { useMemo, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Line, LineChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Heart, TrendingUp, Sparkles, Calendar, Activity, Zap, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

interface MoodLog {
    id: string
    mood: string
    intensity: number
    created_at: string
}

interface Insights {
    advice: string
    prediction: string
}

export function UnifiedMoodDashboard({ moodLogs }: { moodLogs: MoodLog[] }) {
    const [insights, setInsights] = useState<Insights | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const res = await fetch("/api/mood/insights", { method: "POST" })
                if (res.ok) {
                    const data = await res.json()
                    setInsights(data)
                }
            } catch (e) {
                console.error("Failed to fetch insights", e)
            } finally {
                setLoading(false)
            }
        }
        fetchInsights()
    }, [])

    const { chartData, stats, correlation } = useMemo(() => {
        if (!moodLogs || moodLogs.length === 0) return { chartData: [], stats: null, correlation: null }

        const sortedLogs = [...moodLogs].reverse()
        const chartData = sortedLogs.map(log => ({
            date: new Date(log.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            intensity: log.intensity,
            mood: log.mood,
            activities: Array.isArray(log.activities) ? log.activities.join(", ") : "",
            fullDate: new Date(log.created_at).toLocaleDateString()
        }))

        // Basic Stats
        const avgIntensity = moodLogs.reduce((acc, curr) => acc + curr.intensity, 0) / moodLogs.length
        const currentMood = moodLogs[0]?.mood || "Calm"
        const currentIntensity = moodLogs[0]?.intensity || 5

        // Correlation Analysis (Mood vs Activity)
        const activityCounts: Record<string, { total: number, intensitySum: number }> = {}
        moodLogs.forEach(log => {
            if (Array.isArray(log.activities)) {
                log.activities.forEach((act: string) => {
                    if (!activityCounts[act]) activityCounts[act] = { total: 0, intensitySum: 0 }
                    activityCounts[act].total++
                    activityCounts[act].intensitySum += log.intensity
                })
            }
        })

        const topActivity = Object.entries(activityCounts).sort((a, b) => b[1].total - a[1].total)[0]?.[0] || "None"
        const topActivityAvg = topActivity !== "None" ? activityCounts[topActivity].intensitySum / activityCounts[topActivity].total : 0

        // Stability Score (Standard Deviation of intensity - simplified)
        const variance = moodLogs.reduce((acc, curr) => acc + Math.pow(curr.intensity - avgIntensity, 2), 0) / moodLogs.length
        const stability = Math.max(0, 100 - (Math.sqrt(variance) * 20))

        return { 
            chartData, 
            stats: { avgIntensity, currentMood, currentIntensity, stability },
            correlation: { topActivity, topActivityAvg }
        }
    }, [moodLogs])

    if (!stats || !correlation) return null

    return (
        <Card className="overflow-hidden border-white/20 relative shadow-2xl bg-card/40 backdrop-blur-xl min-h-[400px] flex flex-col">
            {/* Visual Accents */}
            <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent rounded-bl-[100%] opacity-20 blur-3xl -z-10`} />
            
            <CardHeader className="border-b border-white/10 py-3 px-5 shrink-0">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        <Heart className="w-5 h-5 text-primary fill-primary/20" />
                        <CardTitle className="text-lg font-bold tracking-tight">
                            Mood: <span className="text-primary">{stats.currentMood}</span>
                        </CardTitle>
                    </div>

                    <div className="flex items-center gap-1.5 bg-black/5 p-1 rounded-lg border border-white/5">
                        <div className="px-2 py-0.5 flex items-center gap-1.5">
                            <span className="text-[9px] uppercase font-black tracking-widest text-muted-foreground opacity-60">Avg</span>
                            <span className="text-xs font-bold">{stats.avgIntensity.toFixed(1)}</span>
                        </div>
                        <div className="w-[1px] h-3 bg-white/10" />
                        <div className="px-2 py-0.5 flex items-center gap-1.5 rounded bg-primary/10 text-primary">
                            <span className="text-[9px] uppercase font-black tracking-widest opacity-80">Logs</span>
                            <span className="text-xs font-bold">{moodLogs.length}</span>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0 flex-1 flex flex-col">
                <div className="grid lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-white/10 flex-1">
                    {/* Insights Panel */}
                    <div className="lg:col-span-2 p-5 space-y-4 bg-gradient-to-b from-transparent to-black/5">
                        {loading ? (
                            <div className="space-y-3 animate-pulse">
                                <div className="h-16 bg-white/5 rounded-xl" />
                                <div className="h-16 bg-white/5 rounded-xl" />
                            </div>
                        ) : insights ? (
                            <div className="space-y-3">
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 relative overflow-hidden group"
                                >
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1.5 flex items-center gap-1.5 relative z-10">
                                        <Lightbulb className="w-3 h-3" /> Daily Tip
                                    </h4>
                                    <p className="text-[11px] text-indigo-900/80 dark:text-indigo-200/80 leading-snug relative z-10 italic">
                                        "{insights.advice}"
                                    </p>
                                </motion.div>

                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 relative overflow-hidden group"
                                >
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1.5 flex items-center gap-1.5 relative z-10">
                                        <TrendingUp className="w-3 h-3" /> Outlook
                                    </h4>
                                    <p className="text-[11px] text-emerald-900/80 dark:text-emerald-200/80 leading-snug relative z-10 italic">
                                        "{insights.prediction}"
                                    </p>
                                </motion.div>
                            </div>
                        ) : null}

                        <div className="space-y-3 pt-2">
                             <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-muted-foreground px-0.5">
                                <span>Mood Stability</span>
                                <span className="text-primary">{Math.round(stats.stability)}%</span>
                            </div>
                            <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <motion.div 
                                    className="absolute inset-y-0 left-0 bg-primary/40 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stats.stability}%` }}
                                    transition={{ duration: 1.5 }}
                                />
                            </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-card/40 border border-white/10 shadow-inner">
                            <h5 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5 leading-none">
                                <Activity className="w-2.5 h-2.5" /> High Impact Activity
                            </h5>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold capitalize">{correlation.topActivity}</span>
                                <span className="text-[10px] text-muted-foreground font-medium bg-black/5 px-2 py-0.5 rounded">
                                    {correlation.topActivityAvg.toFixed(1)} Intensity
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Chart Panel */}
                    <div className="lg:col-span-3 p-6 md:p-8 flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <div className="space-y-0.5">
                                <h3 className="text-sm font-bold tracking-tight">Emotional Trajectory</h3>
                                <p className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> Historical intensity over last 30 entries
                                </p>
                            </div>
                        </div>

                        <div className="flex-1 min-h-[180px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="rgba(255,255,255,0.3)"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                        fontWeight="bold"
                                    />
                                    <YAxis
                                        stroke="rgba(255,255,255,0.3)"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        domain={[0, 10]}
                                        fontWeight="bold"
                                    />
                                    <RechartsTooltip
                                        contentStyle={{ 
                                            backgroundColor: "rgba(10, 10, 10, 0.9)", 
                                            borderRadius: "16px", 
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            backdropFilter: "blur(12px)",
                                            boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
                                        }}
                                        labelStyle={{ color: "rgba(255,255,255,0.5)", fontSize: "10px", marginBottom: "4px" }}
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="p-3 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl min-w-[150px]">
                                                        <p className="text-[10px] text-muted-foreground font-bold mb-1 uppercase tracking-widest">{data.fullDate}</p>
                                                        <div className="flex items-center justify-between gap-4 mb-2">
                                                            <span className="text-xs font-black uppercase tracking-tight text-white">{data.mood}</span>
                                                            <span className="text-xs font-bold text-primary">{data.intensity}/10</span>
                                                        </div>
                                                        {data.activities && (
                                                            <div className="pt-2 border-t border-white/5">
                                                                <p className="text-[9px] text-muted-foreground font-medium mb-1">Impact Factors:</p>
                                                                <p className="text-[10px] text-primary/80 font-bold capitalize">{data.activities}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Line
                                        type="natural"
                                        dataKey="intensity"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={4}
                                        activeDot={{ r: 8, fill: "hsl(var(--primary))", stroke: "white", strokeWidth: 2 }}
                                        dot={{ r: 4, fill: "white", stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                                        animationDuration={2500}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
