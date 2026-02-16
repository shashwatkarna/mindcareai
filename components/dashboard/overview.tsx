"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DailyQuote } from "@/components/dashboard/daily-quote"
import { Smile, BookOpen, Calendar, FileText, TrendingUp, Clock, Sparkles, Zap, Heart, Target } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { motion, useSpring, useTransform } from "framer-motion"
import { useState, useEffect } from "react"

interface DashboardOverviewProps {
  userId: string
  stats: {
    moodLogs: number
    journalEntries: number
    assessments: number
    appointments: number
  }
  moodLogs: Array<{ mood: string; intensity: number; created_at: string }>
  recentActivity: Array<{ type: string; data: any; timestamp: string }>
}

const motivationalQuotes = [
  {
    title: "Welcome to Your Wellness Journey! 🌟",
    message: "Every journey begins with a single step. Start by logging your mood or writing a journal entry.",
    quote: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
    icon: Sparkles,
    gradient: "from-blue-500/20 via-purple-500/20 to-pink-500/20"
  },
  {
    title: "Great Start! 🎯",
    message: "You're building a foundation for lasting wellness. Consistency is key!",
    quote: "Small daily improvements are the key to staggering long-term results.",
    author: "Robin Sharma",
    icon: Target,
    gradient: "from-green-500/20 via-emerald-500/20 to-teal-500/20"
  },
  {
    title: "You're Building Momentum! 🚀",
    message: "Your dedication is showing! You're developing a powerful self-care habit.",
    quote: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier",
    icon: Zap,
    gradient: "from-orange-500/20 via-amber-500/20 to-yellow-500/20"
  },
  {
    title: "Wellness Champion! 🏆",
    message: "Your commitment to mental wellness is truly inspiring. Keep shining!",
    quote: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
    icon: Heart,
    gradient: "from-pink-500/20 via-rose-500/20 to-red-500/20"
  }
]

// Count-up animation component
function CountUp({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)

      setCount(Math.floor(progress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return <>{count}</>
}

export function DashboardOverview({ userId, stats, moodLogs, recentActivity }: DashboardOverviewProps) {
  const [hoveredStat, setHoveredStat] = useState<number | null>(null)

  // Calculate mood trend (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return {
      date: d.toISOString().split('T')[0],
      label: d.toLocaleDateString('en-US', { weekday: 'short' })
    }
  })

  const moodTrendData = last7Days.map(({ date }) => {
    const dayMoods = moodLogs.filter(log => log.created_at.split('T')[0] === date)
    if (dayMoods.length === 0) return null
    const avgIntensity = dayMoods.reduce((sum, log) => sum + log.intensity, 0) / dayMoods.length
    return avgIntensity
  })

  // Generate motivational insight
  const getMotivationalInsight = () => {
    const totalActivities = stats.moodLogs + stats.journalEntries + stats.assessments
    if (totalActivities === 0) return motivationalQuotes[0]
    if (totalActivities < 5) return { ...motivationalQuotes[1], message: `You've completed ${totalActivities} activities. ${motivationalQuotes[1].message}` }
    if (totalActivities < 15) return { ...motivationalQuotes[2], message: `${totalActivities} activities completed! ${motivationalQuotes[2].message}` }
    return { ...motivationalQuotes[3], message: `Amazing! ${totalActivities} activities completed. ${motivationalQuotes[3].message}` }
  }

  const insight = getMotivationalInsight()
  const InsightIcon = insight.icon

  const statCards = [
    { label: "Mood Logs", value: stats.moodLogs, icon: Smile, color: "text-blue-500", glowColor: "shadow-blue-500/50", href: "/dashboard/mood" },
    { label: "Journal Entries", value: stats.journalEntries, icon: BookOpen, color: "text-purple-500", glowColor: "shadow-purple-500/50", href: "/dashboard/journal" },
    { label: "Assessments", value: stats.assessments, icon: FileText, color: "text-green-500", glowColor: "shadow-green-500/50", href: "/dashboard/assessments" },
    { label: "Appointments", value: stats.appointments, icon: Calendar, color: "text-orange-500", glowColor: "shadow-orange-500/50", href: "/dashboard/appointments" },
  ]

  const quickActions = [
    { label: "Log Mood", icon: Smile, href: "/dashboard/mood", gradient: "from-blue-500 to-cyan-500", glow: "shadow-blue-500/50" },
    { label: "Write Journal", icon: BookOpen, href: "/dashboard/journal", gradient: "from-purple-500 to-pink-500", glow: "shadow-purple-500/50" },
    { label: "Book Appointment", icon: Calendar, href: "/dashboard/appointments", gradient: "from-orange-500 to-amber-500", glow: "shadow-orange-500/50" },
  ]

  return (
    <div className="space-y-6">
      {/* Quick Actions - Glassmorphism */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="border border-white/10 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent backdrop-blur-xl overflow-hidden relative shadow-2xl">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 opacity-50 animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />

          <CardHeader className="relative">
            <CardTitle className="text-lg flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Sparkles className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
              </motion.div>
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Quick Actions
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {quickActions.map((action, i) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  whileHover={{
                    scale: 1.05,
                    y: -4,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link href={action.href}>
                    <Button className={cn(
                      "w-full gap-2 text-white bg-gradient-to-r shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group",
                      action.gradient,
                      `hover:${action.glow}`
                    )}>
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <action.icon className="w-4 h-4" />
                      </motion.div>
                      {action.label}
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid - Glassmorphism with 3D Depth */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
            whileHover={{
              y: -6,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            onHoverStart={() => setHoveredStat(i)}
            onHoverEnd={() => setHoveredStat(null)}
          >
            <Link href={stat.href}>
              <Card className={cn(
                "cursor-pointer border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl transition-all duration-300 overflow-hidden relative group",
                "shadow-[0_8px_16px_rgba(0,0,0,0.4)]",
                hoveredStat === i && cn("border-white/30 shadow-2xl", stat.glowColor)
              )}>
                {/* Glow effect on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={hoveredStat === i ? {
                    background: [
                      "radial-gradient(circle at 0% 0%, rgba(139,92,246,0.2), transparent)",
                      "radial-gradient(circle at 100% 100%, rgba(139,92,246,0.2), transparent)",
                      "radial-gradient(circle at 0% 0%, rgba(139,92,246,0.2), transparent)",
                    ]
                  } : {}}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                <CardContent className="p-6 relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-xs font-medium mb-2 uppercase tracking-wider">{stat.label}</p>
                      <motion.p
                        className="text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent"
                        animate={hoveredStat === i ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        <CountUp end={stat.value} duration={1.5} />
                      </motion.p>
                    </div>
                    <motion.div
                      className={cn(
                        "p-3 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10",
                        hoveredStat === i && "shadow-lg"
                      )}
                      animate={hoveredStat === i ? {
                        scale: 1.15,
                        rotate: [0, -5, 5, 0]
                      } : { scale: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <stat.icon className={cn("w-7 h-7", stat.color, "drop-shadow-[0_0_8px_currentColor]")} />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Mood Trend & Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column: Mood Trend + Daily Quote */}
        <div className="space-y-6">
          {/* Enhanced Mood Trend Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            whileHover={{ y: -4 }}
          >
            <Card className="border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.1),transparent)]" />
              <CardHeader className="relative">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                  <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Mood Trend (7 Days)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 relative">
                {moodLogs.length > 0 ? (
                  <div className="h-40 flex items-end justify-between gap-2 px-2">
                    {moodTrendData.map((intensity, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 flex flex-col items-center gap-2 group"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
                        whileHover={{ y: -4 }}
                      >
                        <div className="w-full bg-white/5 backdrop-blur-sm rounded-xl relative overflow-hidden border border-white/10" style={{ height: '120px' }}>
                          {intensity !== null && (
                            <>
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${intensity * 20}%` }}
                                transition={{ delay: 0.8 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                                className="absolute bottom-0 w-full bg-gradient-to-t from-primary via-primary/80 to-primary/50 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.5)] group-hover:shadow-[0_0_30px_rgba(139,92,246,0.8)] transition-shadow"
                              />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <span className="text-xs font-bold text-white bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                                  {intensity.toFixed(1)}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground font-semibold">
                          {last7Days[i].label[0]}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="h-40 flex flex-col items-center justify-center text-muted-foreground text-sm gap-2">
                    <Smile className="w-8 h-8 opacity-50" />
                    <p>No mood data yet. Start logging your mood!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Daily Quote Section - Below Mood Trend */}
          <DailyQuote />
        </div>

        {/* Right Column: Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileHover={{ y: -4 }}
        >
          <Card className="border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl overflow-hidden shadow-2xl h-full">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(236,72,153,0.1),transparent)]" />
            <CardHeader className="relative">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Recent Activity
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 relative">
              {recentActivity.length > 0 ? (
                <div className="space-y-2">
                  {recentActivity.slice(0, 5).map((activity, i) => {
                    const icons = { mood: Smile, journal: BookOpen, assessment: FileText, appointment: Calendar }
                    const colors = { mood: "text-blue-400", journal: "text-purple-400", assessment: "text-green-400", appointment: "text-orange-400" }
                    const Icon = icons[activity.type as keyof typeof icons]
                    const color = colors[activity.type as keyof typeof colors]

                    return (
                      <motion.div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + i * 0.1, duration: 0.3 }}
                        whileHover={{ x: 6, scale: 1.02 }}
                      >
                        <motion.div
                          className={cn("p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10", color)}
                          whileHover={{ scale: 1.15, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Icon className="w-4 h-4 drop-shadow-[0_0_6px_currentColor]" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <p className="text-foreground font-medium capitalize truncate text-sm">
                            {activity.type === 'journal' && activity.data.title ? activity.data.title : `${activity.type} logged`}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {new Date(activity.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <div className="h-40 flex flex-col items-center justify-center text-muted-foreground text-sm gap-2">
                  <Clock className="w-8 h-8 opacity-50" />
                  <p>No recent activity. Start your wellness journey!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Premium Motivational Insight - Glassmorphism */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        whileHover={{ y: -6, scale: 1.01 }}
      >
        <Card className={cn(
          "border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl overflow-hidden relative shadow-2xl",
          insight.gradient
        )}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -ml-48 -mb-48" />

          <CardContent className="p-8 relative">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <motion.div
                className="p-5 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl"
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 3, -3, 0],
                  boxShadow: [
                    "0 0 20px rgba(139,92,246,0.3)",
                    "0 0 40px rgba(139,92,246,0.5)",
                    "0 0 20px rgba(139,92,246,0.3)",
                  ]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <InsightIcon className="w-10 h-10 text-primary drop-shadow-[0_0_12px_rgba(139,92,246,0.8)]" />
              </motion.div>
              <div className="flex-1 space-y-4">
                <h3 className="font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent text-2xl">
                  {insight.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{insight.message}</p>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-foreground italic text-lg font-medium leading-relaxed">"{insight.quote}"</p>
                  <p className="text-muted-foreground text-sm mt-2">— {insight.author}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
