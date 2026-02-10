"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Play, Square, Volume2, VolumeX } from "lucide-react"

export function BreathingTool() {
    const [isActive, setIsActive] = useState(false)
    const [phase, setPhase] = useState<"idle" | "inhale" | "hold" | "exhale">("idle")
    const [timeLeft, setTimeLeft] = useState(0)
    const [cycles, setCycles] = useState(0)
    const [soundEnabled, setSoundEnabled] = useState(false)

    // 4-7-8 Technique
    const phases = {
        inhale: { duration: 4, label: "Inhale", color: "text-cyan-600", scale: 1.5, bg: "bg-cyan-100" },
        hold: { duration: 7, label: "Hold", color: "text-indigo-600", scale: 1.5, bg: "bg-indigo-100" },
        exhale: { duration: 8, label: "Exhale", color: "text-teal-600", scale: 1, bg: "bg-teal-100" },
    }

    useEffect(() => {
        let interval: NodeJS.Timeout
        let phaseTimeout: NodeJS.Timeout

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
                runCycle()
            }

            runCycle()

            // Countdown timer for each phase
            interval = setInterval(() => {
                setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
            }, 1000)
        } else {
            setPhase("idle")
            setTimeLeft(0)
            setCycles(0)
        }

        return () => {
            clearInterval(interval)
            clearTimeout(phaseTimeout)
        }
    }, [isActive])

    return (
        <div className="flex flex-col items-center justify-center p-16 md:p-24 bg-white rounded-3xl shadow-xl max-w-lg mx-auto relative overflow-hidden transition-all">
            {/* Background Pulse */}
            {isActive && (
                <motion.div
                    animate={{
                        scale: phase === "inhale" || phase === "hold" ? [1, 1.5] : [1.5, 1],
                        opacity: [0.1, 0.3],
                    }}
                    transition={{
                        duration: phases[phase as keyof typeof phases]?.duration || 1,
                        ease: "easeInOut",
                    }}
                    className={`absolute inset-0 rounded-full blur-3xl ${phases[phase as keyof typeof phases]?.bg || "bg-gray-100"}`}
                />
            )}

            {/* Main Circle */}
            <div className="relative z-10 w-64 h-64 flex items-center justify-center">
                <motion.div
                    animate={{
                        scale: phase === "idle" ? 1 : phases[phase as keyof typeof phases].scale,
                        borderColor: phase === "idle" ? "#e5e7eb" : phase === "inhale" ? "#06b6d4" : phase === "hold" ? "#4f46e5" : "#0d9488",
                    }}
                    transition={{ duration: phases[phase as keyof typeof phases]?.duration || 0.5, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full border-4 border-dashed"
                />

                <motion.div
                    animate={{
                        scale: phase === "idle" ? 1 : phases[phase as keyof typeof phases].scale,
                        backgroundColor: phase === "idle" ? "#f3f4f6" : phase === "inhale" ? "#ecfeff" : phase === "hold" ? "#eef2ff" : "#f0fdfa",
                    }}
                    transition={{ duration: phases[phase as keyof typeof phases]?.duration || 0.5, ease: "easeInOut" }}
                    className="w-40 h-40 rounded-full flex items-center justify-center shadow-inner"
                >
                    <div className="text-center">
                        {isActive ? (
                            <>
                                <motion.div
                                    key={phase}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`text-3xl font-bold ${phases[phase as keyof typeof phases]?.color}`}
                                >
                                    {phases[phase as keyof typeof phases]?.label || "Prepare..."}
                                </motion.div>
                                <div className="text-xl font-medium text-gray-400 mt-1">{timeLeft}s</div>
                            </>
                        ) : (
                            <div className="text-gray-500 font-medium">Ready?</div>
                        )}
                    </div>
                </motion.div>
            </div>

            <div className="mt-12 flex gap-4 z-10">
                <Button
                    size="lg"
                    onClick={() => setIsActive(!isActive)}
                    className={`rounded-full px-8 h-12 text-lg transition-all ${isActive ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl hover:scale-105"}`}
                >
                    {isActive ? (
                        <>
                            <Square className="w-4 h-4 mr-2 fill-current" /> Stop
                        </>
                    ) : (
                        <>
                            <Play className="w-4 h-4 mr-2" /> Start Breathing
                        </>
                    )}
                </Button>
            </div>

            {isActive && <div className="mt-4 text-sm text-gray-400">Cycles completed: {cycles}</div>}
        </div>
    )
}
