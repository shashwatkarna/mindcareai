"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Play, Square, Volume2, VolumeX } from "lucide-react"

const facts = [
    "The 4-7-8 technique is a 'natural tranquilizer' for the nervous system.",
    "It activates the parasympathetic system, responsible for 'rest and digest'.",
    "The extended exhale (8s) is key to triggering the body's relaxation response.",
    "Consistent practice can help lower blood pressure and heart rate over time.",
    "Rooted in Pranayama, an ancient yogic breathing practice for calming the mind.",
    "Studies show just 4 cycles can significantly reduce acute anxiety levels.",
    "Known to improve Heart Rate Variability (HRV) for better stress resilience."
]

export function BreathingTool() {
    const [isActive, setIsActive] = useState(false)
    const [phase, setPhase] = useState<"idle" | "inhale" | "hold" | "exhale">("idle")
    const [timeLeft, setTimeLeft] = useState(0)
    const [cycles, setCycles] = useState(0)
    const [factIndex, setFactIndex] = useState(0)

    // 4-7-8 Technique
    const phases = {
        inhale: { duration: 4, label: "Inhale", color: "text-cyan-600", scale: 1.5, bg: "bg-cyan-100" },
        hold: { duration: 7, label: "Hold", color: "text-indigo-600", scale: 1.5, bg: "bg-indigo-100" },
        exhale: { duration: 8, label: "Exhale", color: "text-teal-600", scale: 1, bg: "bg-teal-100" },
    }

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined
        
        if (isActive) {
            const runCycle = async () => {
                // Inhale
                setPhase("inhale")
                setTimeLeft(4)
                await new Promise(r => setTimeout(r, 4000))
                if (!isActive) return

                // Hold
                setPhase("hold")
                setTimeLeft(7)
                await new Promise(r => setTimeout(r, 7000))
                if (!isActive) return

                // Exhale
                setPhase("exhale")
                setTimeLeft(8)
                await new Promise(r => setTimeout(r, 8000))
                if (!isActive) return

                setCycles(c => c + 1)
                setFactIndex(prev => (prev + 1) % facts.length)
                runCycle()
            }

            runCycle()

            interval = setInterval(() => {
                setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
            }, 1000)
        } else {
            setPhase("idle")
            setTimeLeft(0)
            setCycles(0)
            setFactIndex(0)
        }

        return () => {
            clearInterval(interval)
        }
    }, [isActive])

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-center w-full max-w-4xl mx-auto p-4 md:p-8">
            {/* Animation Area: The "Box" */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center bg-white rounded-[40px] shadow-2xl border border-border/50 overflow-visible">
                {/* Background Pulse */}
                {isActive && (
                    <motion.div
                        animate={{
                            scale: phase === "inhale" || phase === "hold" ? [1, 1.4] : [1.4, 1],
                            opacity: [0.1, 0.2],
                        }}
                        transition={{
                            duration: phases[phase as keyof typeof phases]?.duration || 1,
                            ease: "easeInOut",
                        }}
                        className={`absolute inset-0 rounded-[40px] blur-3xl ${phases[phase as keyof typeof phases]?.bg || "bg-gray-100"}`}
                    />
                )}

                {/* Main Circle */}
                <div className="relative z-10 w-40 h-40 md:w-48 md:h-48 flex items-center justify-center">
                    <motion.div
                        animate={{
                            scale: phase === "idle" ? 1 : (phases[phase as keyof typeof phases].scale - 0.1),
                            borderColor: phase === "idle" ? "#e5e7eb" : phase === "inhale" ? "#06b6d4" : phase === "hold" ? "#4f46e5" : "#0d9488",
                        }}
                        transition={{ duration: phases[phase as keyof typeof phases]?.duration || 0.5, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full border-4 border-dashed"
                    />

                    <motion.div
                        animate={{
                            scale: phase === "idle" ? 1 : (phases[phase as keyof typeof phases].scale - 0.1),
                            backgroundColor: phase === "idle" ? "#f3f4f6" : phase === "inhale" ? "#ecfeff" : phase === "hold" ? "#eef2ff" : "#f0fdfa",
                        }}
                        transition={{ duration: phases[phase as keyof typeof phases]?.duration || 0.5, ease: "easeInOut" }}
                        className="w-28 h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center shadow-inner"
                    >
                        <div className="text-center">
                            {isActive ? (
                                <>
                                    <motion.div
                                        key={phase}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`text-xl md:text-2xl font-black uppercase tracking-tight ${phases[phase as keyof typeof phases]?.color}`}
                                    >
                                        {phases[phase as keyof typeof phases]?.label}
                                    </motion.div>
                                    <div className="text-xl font-bold text-muted-foreground/60 mt-1">{timeLeft}s</div>
                                </>
                            ) : (
                                <div className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Ready</div>
                            )}
                        </div>
                    </motion.div>
                </div>

                <div className="absolute bottom-6 z-20">
                    <Button
                        size="lg"
                        onClick={() => setIsActive(!isActive)}
                        className={`rounded-full px-8 h-12 text-md font-bold transition-all shadow-lg ${isActive ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" : "bg-primary hover:bg-primary/90 text-white"}`}
                    >
                        {isActive ? (
                            <><Square className="w-4 h-4 mr-2 fill-current" /> Stop</>
                        ) : (
                            <><Play className="w-4 h-4 mr-2" /> Start Now</>
                        )}
                    </Button>
                </div>
            </div>

            {/* Info Area: "Outside the Box" */}
            <div className="flex flex-col gap-6 w-full max-w-sm">
                <div className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-[32px] space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">Session Progress</h3>
                        <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-black border border-primary/20">
                            CYCLE {cycles + 1}
                        </div>
                    </div>
                    
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                            <span>Completing 8 cycles is recommended</span>
                            <span>{Math.round(((cycles) / 8) * 100)}%</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-primary"
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(((cycles) / 8) * 100, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={isActive ? factIndex : "idle"}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-primary/5 border border-primary/10 p-6 rounded-[32px] relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Volume2 className="w-12 h-12" />
                        </div>
                        <h4 className="font-black uppercase tracking-widest text-[10px] text-primary mb-3">Health Insight</h4>
                        <p className="text-sm md:text-base font-medium text-foreground/80 leading-relaxed italic">
                           &quot;{isActive ? facts[factIndex] : "The 4-7-8 technique is a 'natural tranquilizer' for your nervous system."}&quot;
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
