"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Play, Square, ArrowLeft } from "lucide-react"

interface BoxBreathingProps {
    onBack: () => void
}

export function BoxBreathing({ onBack }: BoxBreathingProps) {
    const [isActive, setIsActive] = useState(false)
    const [phase, setPhase] = useState<"idle" | "inhale" | "hold1" | "exhale" | "hold2">("idle")
    const [timeLeft, setTimeLeft] = useState(0)

    // 4-4-4-4 Technique
    const phases = {
        inhale: { duration: 4, label: "Inhale", color: "text-blue-600", bg: "bg-blue-50" },
        hold1: { duration: 4, label: "Hold", color: "text-indigo-600", bg: "bg-indigo-50" },
        exhale: { duration: 4, label: "Exhale", color: "text-blue-600", bg: "bg-blue-50" },
        hold2: { duration: 4, label: "Hold", color: "text-indigo-600", bg: "bg-indigo-50" }
    }

    useEffect(() => {
        let interval: NodeJS.Timeout

        if (isActive) {
            const runCycle = async () => {
                setPhase("inhale"); setTimeLeft(4); await new Promise(r => setTimeout(r, 4000));
                if (!isActive) return;
                setPhase("hold1"); setTimeLeft(4); await new Promise(r => setTimeout(r, 4000));
                if (!isActive) return;
                setPhase("exhale"); setTimeLeft(4); await new Promise(r => setTimeout(r, 4000));
                if (!isActive) return;
                setPhase("hold2"); setTimeLeft(4); await new Promise(r => setTimeout(r, 4000));
                if (!isActive) return;
                runCycle();
            }
            runCycle()

            interval = setInterval(() => {
                setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
            }, 1000)
        } else {
            setPhase("idle")
            setTimeLeft(0)
        }

        return () => clearInterval(interval)
    }, [isActive])

    return (
        <div className="flex flex-col items-center justify-center p-8 min-h-[500px] max-w-2xl mx-auto">
            <Button variant="ghost" onClick={onBack} className="self-start mb-8 -ml-4">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Library
            </Button>

            <h2 className="text-3xl font-bold mb-2">Box Breathing</h2>
            <p className="text-muted-foreground mb-12 text-center max-w-md">
                Inhale for 4s, Hold for 4s, Exhale for 4s, Hold for 4s. A Navy SEAL technique for focus and calm.
            </p>

            <div className="relative w-64 h-64 flex items-center justify-center">
                {/* The Box */}
                <motion.div
                    animate={{
                        borderRadius: phase === "inhale" || phase === "exhale" ? ["20%", "40%"] : "30%",
                        scale: phase === "inhale" ? 1.2 : phase === "exhale" ? 0.8 : 1
                    }}
                    transition={{ duration: 4, ease: "linear" }}
                    className={`w-48 h-48 border-4 border-blue-500/30 rounded-3xl flex items-center justify-center relative ${phases[phase as keyof typeof phases]?.bg || "bg-gray-50"}`}
                >
                    {/* Progress Indicator matching the box sides could be complex, simple text is better for MVP */}
                    <div className="text-center z-10">
                        <div className={`text-4xl font-bold ${phases[phase as keyof typeof phases]?.color || "text-gray-400"}`}>
                            {phases[phase as keyof typeof phases]?.label || "Ready"}
                        </div>
                        {isActive && <div className="text-2xl font-medium text-gray-400 mt-2">{timeLeft}s</div>}
                    </div>

                    {/* Moving Dot */}
                    {isActive && (
                        <motion.div
                            animate={{
                                pathLength: [0, 1],
                            }}
                            className="absolute inset-0"
                        >
                            {/* Getting a dot to move along a square path is tricky with simple divs. 
                                 We'll use a simpler visual: the box filling up/emptying or just the pulsing. 
                                 For now, the scale animation above is sufficient for "Box" breathing. 
                             */}
                        </motion.div>
                    )}
                </motion.div>

                {/* External Guide Box */}
                <div className="absolute inset-0 border-2 border-dashed border-gray-200 rounded-3xl -z-10 scale-125" />
            </div>

            <Button
                size="lg"
                onClick={() => setIsActive(!isActive)}
                className="mt-12 rounded-full px-8"
            >
                {isActive ? (
                    <><Square className="w-4 h-4 mr-2 fill-current" /> Stop</>
                ) : (
                    <><Play className="w-4 h-4 mr-2" /> Start Technique</>
                )}
            </Button>
        </div>
    )
}
