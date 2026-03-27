"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Line, LineChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, TrendingUp, TrendingDown, Sparkles, Brain, ShieldAlert, Zap, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface Assessment {
    id: string
    assessment_type: string
    score: number | null
    risk_level: string | null
    created_at: string
}

export function UnifiedAssessmentDashboard({ assessments }: { assessments: Assessment[] }) {
    const { analysis, chartData } = useMemo(() => {
        if (!assessments || assessments.length === 0) return { analysis: null, chartData: [] }

        // Process Assessment Data
        const sortedAssessments = [...assessments]
            .filter(a => a.score !== null)
            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

        const chartData = sortedAssessments.map(a => ({
            date: new Date(a.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            score: a.score,
            type: a.assessment_type,
            fullDate: new Date(a.created_at).toLocaleDateString()
        }))

        // Analysis Logic
        const recent = [...sortedAssessments].reverse().slice(0, 5)
        if (recent.length === 0) return { analysis: null, chartData }

        const currentScore = recent[0].score || 0
        const averageScore = recent.reduce((acc, curr) => acc + (curr.score || 0), 0) / recent.length
        
        let trend = "stable"
        if (recent.length > 1) {
            const previousScore = recent[1].score || 0
            if (currentScore > previousScore + 5) trend = "improving"
            else if (currentScore < previousScore - 5) trend = "declining"
        }

        let status = "Balanced"
        let description = "You're consistently maintaining your mental wellbeing. Keep practicing your daily exercises."
        let icon = Brain
        let color = "text-emerald-500"
        let bgColor = "bg-emerald-500/10"
        let bgGradient = "from-emerald-500/20 via-emerald-500/5 to-transparent"

        if (currentScore > 75) {
            status = "Flourishing"
            description = "You are in a high state of wellbeing. Focus on long-term growth and helping others."
            icon = Sparkles
            color = "text-yellow-500"
            bgColor = "bg-yellow-500/10"
            bgGradient = "from-yellow-500/20 via-yellow-500/5 to-transparent"
        } else if (currentScore < 40) {
            status = "At Risk"
            description = "Recent scores suggest tough times. Reach out to a professional or a loved one."
            icon = ShieldAlert
            color = "text-red-500"
            bgColor = "bg-red-500/10"
            bgGradient = "from-red-500/20 via-red-500/5 to-transparent"
        } else if (currentScore < 60) {
            status = "Managing"
            description = "Handling life's challenges well, but prioritize sleep and light exercise."
            icon = Activity
            color = "text-amber-500"
            bgColor = "bg-amber-500/10"
            bgGradient = "from-amber-500/20 via-amber-500/5 to-transparent"
        }

        return { 
            analysis: { currentScore, averageScore, trend, status, description, icon, color, bgColor, bgGradient },
            chartData
        }
    }, [assessments])

    if (!analysis) return null

    const StatusIcon = analysis.icon

    return (
        <Card className="overflow-hidden border-white/20 relative shadow-2xl bg-card/40 backdrop-blur-xl">
            {/* Visual Accents */}
            <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${analysis.bgGradient} rounded-bl-[100%] opacity-20 blur-3xl -z-10`} />
            
            <CardHeader className="border-b border-white/10 pb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className={cn("p-3 rounded-2xl shadow-inner bg-card/50 border border-white/10 flex items-center justify-center", analysis.color)}>
                            <StatusIcon className="w-8 h-8" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
                                Wellbeing Status: <span className={analysis.color}>{analysis.status}</span>
                            </CardTitle>
                            <p className="text-muted-foreground text-sm font-medium mt-0.5 max-w-md">
                                {analysis.description}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-black/5 p-1.5 rounded-2xl border border-white/5">
                        <div className="px-4 py-2 flex flex-col items-center">
                            <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-60">Avg Score</span>
                            <span className="text-xl font-bold">{Math.round(analysis.averageScore)}</span>
                        </div>
                        <div className="w-[1px] h-8 bg-white/10" />
                        <div className={cn("px-4 py-2 flex flex-col items-center rounded-xl bg-card shadow-sm border border-white/10", analysis.color)}>
                            <span className="text-[10px] uppercase font-black tracking-widest opacity-80 current-score-label">Current</span>
                            <span className="text-xl font-bold">{Math.round(analysis.currentScore)}</span>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <div className="grid lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
                    {/* Insights Panel */}
                    <div className="lg:col-span-2 p-6 md:p-8 space-y-8 bg-gradient-to-b from-transparent to-black/5">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-muted-foreground">
                                <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> Wellness Intensity</span>
                                <span className={analysis.color}>{Math.round(analysis.currentScore)}%</span>
                            </div>
                            <div className="relative h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                                <motion.div 
                                    className={`h-full bg-gradient-to-r ${analysis.bgGradient.replace('/20', '/90').replace('/5', '/60')} rounded-full shadow-[0_0_15px_rgba(var(--primary),0.2)]`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${analysis.currentScore}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                                <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground block">Weekly Trend</span>
                                {analysis.trend === "improving" ? (
                                    <div className="flex items-center gap-2 text-emerald-500 font-bold">
                                        <TrendingUp className="w-5 h-5" />
                                        <span>Rising</span>
                                    </div>
                                ) : analysis.trend === "declining" ? (
                                    <div className="flex items-center gap-2 text-red-500 font-bold">
                                        <TrendingDown className="w-5 h-5" />
                                        <span>Dipping</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-blue-500 font-bold">
                                        <Activity className="w-5 h-5" />
                                        <span>Steady</span>
                                    </div>
                                )}
                            </div>
                             <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                                <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground block">Focus Area</span>
                                <div className="flex items-center gap-2 font-bold text-foreground">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                    <span>{analysis.currentScore > 70 ? "Self-Growth" : "Reset & Rest"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                            <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                                <Brain className="w-3.5 h-3.5" /> Mindful Hack
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {analysis.currentScore > 70 
                                    ? "Your mental clarity is high. Perfect time for deep creative work or tackling complex problems." 
                                    : "Focus on 'Micro-Wins'. Accomplish three tiny tasks today to regain a sense of control and momentum."}
                            </p>
                        </div>
                    </div>

                    {/* Chart Panel */}
                    <div className="lg:col-span-3 p-6 md:p-8 flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <div className="space-y-0.5">
                                <h3 className="text-sm font-bold tracking-tight">Emotional Trajectory</h3>
                                <p className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> Historical data across {assessments.length} sessions
                                </p>
                            </div>
                        </div>

                        <div className="flex-1 min-h-[250px] w-full">
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
                                        domain={[0, 100]}
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
                                        itemStyle={{ color: "hsl(var(--primary))", fontSize: "12px", fontWeight: "bold" }}
                                        labelStyle={{ color: "rgba(255,255,255,0.5)", fontSize: "10px", marginBottom: "4px" }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="score"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={4}
                                        activeDot={{ r: 8, fill: "hsl(var(--primary))", stroke: "white", strokeWidth: 2 }}
                                        dot={{ r: 5, fill: "white", stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                                        animationDuration={2000}
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
