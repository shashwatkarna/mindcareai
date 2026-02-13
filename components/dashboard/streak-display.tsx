"use client"

import { useState } from "react"
import { Flame, Calendar, Trophy } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface StreakDisplayProps {
    streak: number
    history?: string[] // Array of ISO date strings "YYYY-MM-DD"
}

export function StreakDisplay({ streak, history = [] }: StreakDisplayProps) {
    const [isOpen, setIsOpen] = useState(false)

    // Calculate next milestone
    const milestones = [3, 7, 14, 30, 60, 90, 100, 365]
    const nextMilestone = milestones.find(m => m > streak) || streak + 10
    const progress = Math.min((streak / nextMilestone) * 100, 100)

    // Generate last 7 days for calendar view
    const getLast7Days = () => {
        const days = []
        for (let i = 6; i >= 0; i--) {
            const d = new Date()
            d.setDate(d.getDate() - i)
            const dateStr = d.toISOString().split('T')[0]
            const isActive = history.includes(dateStr)
            days.push({ date: d, isActive, dateStr })
        }
        return days
    }

    const last7Days = getLast7Days()

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <div
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium border border-orange-500/20 cursor-pointer transition-all hover:bg-orange-500/20 group relative overflow-hidden"
                >
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.8, 1, 0.8],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <Flame className="w-4 h-4 fill-orange-500" />
                    </motion.div>
                    <span>{streak} <span className="hidden sm:inline">Day Streak</span></span>

                    {/* Subtle glow effect on hover */}
                    <div className="absolute inset-0 bg-orange-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 overflow-hidden border-orange-500/20 bg-background/95 backdrop-blur-xl shadow-2xl" sideOffset={8}>
                {/* Header with Flame Background */}
                <div className="relative bg-gradient-to-br from-orange-500 to-amber-600 p-6 text-white overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
                    <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-black/10 rounded-full blur-2xl"></div>

                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm font-medium">Current Streak</p>
                            <h3 className="text-4xl font-bold flex items-center gap-2">
                                {streak}
                                <span className="text-lg font-normal opacity-80">Days</span>
                            </h3>
                        </div>
                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm shadow-inner">
                            <Flame className="w-8 h-8 fill-white text-white animate-pulse" />
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="flex justify-between text-xs text-orange-100 mb-1.5">
                            <span>Next Milestone: {nextMilestone} Days</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2 bg-black/20" indicatorClassName="bg-white" />
                    </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-5">
                    {/* Status Message */}
                    <div className="flex gap-3 items-start bg-accent/50 p-3 rounded-xl border border-border/50">
                        <div className="bg-background p-2 rounded-lg shadow-sm text-yellow-500">
                            <Trophy className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm">
                                {streak > 0 ? "You're on fire! 🔥" : "Start your streak today!"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Log your mood, journal, or complete an assessment to keep it going.
                            </p>
                        </div>
                    </div>

                    {/* Weekly Calendar */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Activity (Last 7 Days)</span>
                        </div>
                        <div className="flex justify-between items-end">
                            {last7Days.map((day, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 group">
                                    <div
                                        className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border transition-all duration-300",
                                            day.isActive
                                                ? "bg-orange-500 text-white border-orange-500 shadow-md scale-100"
                                                : "bg-muted text-muted-foreground border-transparent scale-90 opacity-50"
                                        )}
                                        title={day.date.toDateString()}
                                    >
                                        {day.isActive && "✓"}
                                    </div>
                                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                                        {day.date.toLocaleDateString('en-US', { weekday: 'narrow' })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
