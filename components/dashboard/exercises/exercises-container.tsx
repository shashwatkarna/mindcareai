"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BreathingTool } from "@/components/dashboard/exercises/breathing-tool"
import { SoundscapesFocus } from "@/components/dashboard/exercises/soundscapes-focus"
import { WorryJar } from "@/components/dashboard/exercises/worry-jar"
import { DailyAffirmations } from "@/components/dashboard/exercises/daily-affirmations"
import { GroundingTechnique } from "@/components/dashboard/exercises/grounding-technique"
import { BubblePop } from "@/components/dashboard/exercises/bubble-pop"
import { GratitudeMoments } from "@/components/dashboard/exercises/gratitude-moments"
import { YogaStretch } from "@/components/dashboard/exercises/yoga-stretch"
import { Wind, Music, PlayCircle, Heart, Anchor, Smile, Trash2, Activity, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExercisesContainerProps {
    isPremium: boolean
}

type ToolType = "breathing" | "soundscapes" | "worry-jar" | "affirmations" | "grounding" | "bubble-pop" | "gratitude" | "yoga" | null

export function ExercisesContainer({ isPremium }: ExercisesContainerProps) {
    const [activeTool, setActiveTool] = useState<ToolType>(null)

    const tools = [
        {
            id: "breathing",
            title: "4-7-8 Breathing",
            description: "Reduce anxiety and sleep better with this rhythmic breathing technique.",
            icon: Wind,
            color: "text-cyan-500",
            bg: "bg-cyan-500/10",
            border: "hover:border-cyan-500/50",
            component: <BreathingTool />
        },
        {
            id: "worry-jar",
            title: "Worry Jar",
            description: "Write down your worries and seal them away to clear your mind.",
            icon: Trash2,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            border: "hover:border-orange-500/50",
            component: <WorryJar onBack={() => setActiveTool(null)} />
        },
        {
            id: "grounding",
            title: "5-4-3-2-1 Grounding",
            description: "Use your five senses to immediately anchor yourself in the present moment.",
            icon: Anchor,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            border: "hover:border-emerald-500/50",
            component: <GroundingTechnique onBack={() => setActiveTool(null)} />
        },
        {
            id: "affirmations",
            title: "Daily Affirmations",
            description: "Rewire your brain with positive statements to boost self-esteem.",
            icon: Heart,
            color: "text-pink-500",
            bg: "bg-pink-500/10",
            border: "hover:border-pink-500/50",
            component: <DailyAffirmations onBack={() => setActiveTool(null)} />
        },
        {
            id: "bubble-pop",
            title: "Stress Bubble Pop",
            description: "Pop the bubbles for instant stress relief and distraction.",
            icon: Smile,
            color: "text-yellow-500",
            bg: "bg-yellow-500/10",
            border: "hover:border-yellow-500/50",
            component: <BubblePop onBack={() => setActiveTool(null)} />
        },
        {
            id: "gratitude",
            title: "Gratitude Moments",
            description: "Find happiness by listing 3 small things you are grateful for today.",
            icon: Heart,
            color: "text-rose-500",
            bg: "bg-rose-500/10",
            border: "hover:border-rose-500/50",
            component: <GratitudeMoments onBack={() => setActiveTool(null)} />
        },
        {
            id: "yoga",
            title: "Desk Yoga",
            description: "Simple stretches to release physical tension from your body.",
            icon: Activity,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            border: "hover:border-purple-500/50",
            component: <YogaStretch onBack={() => setActiveTool(null)} />
        },
        {
            id: "soundscapes",
            title: "Ambient Soundscapes",
            description: "Immerse yourself in calming nature sounds to focus or relax.",
            icon: Music,
            color: "text-indigo-500",
            bg: "bg-indigo-500/10",
            border: "hover:border-indigo-500/50",
            component: <SoundscapesFocus onBack={() => setActiveTool(null)} />
        }
    ]

    return (
        <div className="relative min-h-[600px]">
            {/* Back Button (only visible when a tool is active) */}
            <AnimatePresence>
                {activeTool && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6"
                    >
                        <button
                            onClick={() => setActiveTool(null)}
                            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors px-2 py-1 rounded-md hover:bg-muted/50"
                        >
                            <div className="p-1 rounded-full bg-muted"><ArrowLeft className="w-4 h-4" /></div>
                            Back to Library
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {activeTool === null ? (
                    <motion.div
                        key="gallery"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {tools.map((tool) => (
                            <button
                                key={tool.id}
                                onClick={() => setActiveTool(tool.id as ToolType)}
                                className={cn(
                                    "relative group flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 p-6 rounded-3xl border border-border bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden",
                                    tool.border
                                )}
                            >
                                <div className={cn("w-24 h-24 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-500", tool.bg)}>
                                    <tool.icon className={cn("w-10 h-10", tool.color)} />
                                </div>
                                <div className="space-y-2 flex-1">
                                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors flex items-center md:justify-start justify-center gap-2">
                                        {tool.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {tool.description}
                                    </p>
                                    <div className={cn("inline-flex items-center text-sm font-medium mt-2 transition-colors", tool.color)}>
                                        Start Exercise <PlayCircle className="w-4 h-4 ml-1" />
                                    </div>
                                </div>
                                <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none", tool.bg.replace('/10', '/30'))} />
                            </button>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="active-tool"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="w-full"
                    >
                        {/* We use a key to ensure mounting/unmounting resets state if needed */}
                        <div key={activeTool} className="w-full animate-in fade-in zoom-in-95 duration-500">
                            {tools.find(t => t.id === activeTool)?.component}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
