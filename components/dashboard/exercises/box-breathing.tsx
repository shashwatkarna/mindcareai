"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, Square, Activity, ShieldCheck, Timer } from "lucide-react"

interface BoxBreathingProps {
    onBack: () => void
}

type Phase = "inhale" | "hold1" | "exhale" | "hold2" | "idle"

const phases = {
    inhale: { label: "Inhale", color: "text-blue-400", border: "border-blue-400", shadow: "shadow-blue-500/20" },
    hold1: { label: "Hold", color: "text-indigo-400", border: "border-indigo-400", shadow: "shadow-indigo-500/20" },
    exhale: { label: "Exhale", color: "text-blue-400", border: "border-blue-400", shadow: "shadow-blue-500/20" },
    hold2: { label: "Hold", color: "text-indigo-400", border: "border-indigo-400", shadow: "shadow-indigo-500/20" },
    idle: { label: "Get Ready", color: "text-muted-foreground", border: "border-border", shadow: "shadow-none" }
}

export function BoxBreathing({ onBack }: BoxBreathingProps) {
    const [isActive, setIsActive] = useState(false)
    const [phase, setPhase] = useState<Phase>("idle")
    const [timeLeft, setTimeLeft] = useState(4)
    const audioContextRef = useRef<AudioContext | null>(null)

    const initAudio = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        }
    }, [])

    const playTick = useCallback(() => {
        if (!audioContextRef.current) return
        const ctx = audioContextRef.current
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = "sine"
        osc.frequency.setValueAtTime(440, ctx.currentTime)
        gain.gain.setValueAtTime(0.05, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + 0.1)
    }, [])

    useEffect(() => {
        let interval: NodeJS.Timeout
        if (isActive) {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setPhase(curr => {
                            if (curr === "inhale") return "hold1"
                            if (curr === "hold1") return "exhale"
                            if (curr === "exhale") return "hold2"
                            return "inhale"
                        })
                        playTick()
                        return 4
                    }
                    return prev - 1
                })
            }, 1000)
        } else {
            setPhase("idle")
            setTimeLeft(4)
        }
        return () => clearInterval(interval)
    }, [isActive, playTick])

    const toggleActive = () => {
        initAudio()
        setIsActive(!isActive)
        if (!isActive) setPhase("inhale")
    }

    return (
        <div className="flex flex-col items-center justify-center p-2 w-full max-w-4xl mx-auto h-full min-h-[400px]">
             {/* Header */}
            <div className="w-full flex justify-between items-center mb-6 px-4">
                <Button variant="ghost" onClick={onBack} size="sm" className="rounded-xl h-8 hover:bg-muted/30 font-bold tracking-widest text-[9px]">
                    <ArrowLeft className="w-3 h-3 mr-1.5" /> Back
                </Button>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/5 rounded-full border border-blue-500/10">
                   <ShieldCheck className="w-3 h-3 text-blue-500 opacity-60" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-blue-500/60">Tactical Breathing</span>
                </div>
            </div>

            <div className="text-center mb-8 space-y-1">
                <h2 className="text-3xl lg:text-4xl font-black tracking-tighter italic uppercase bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                    Box Focus
                </h2>
                <div className="flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] opacity-30">
                    <span>4s Inhale</span> • <span>4s Hold</span> • <span>4s Exhale</span> • <span>4s Hold</span>
                </div>
            </div>

            {/* Centered Box Visualizer - Zero Scroll */}
            <div className="relative w-full max-w-sm h-[260px] flex items-center justify-center">
                
                {/* Outer Glow Ring */}
                <motion.div 
                    animate={isActive ? { scale: [1, 1.05, 1], opacity: [0.1, 0.2, 0.1] } : { scale: 1, opacity: 0.1 }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className={`absolute w-64 h-64 rounded-[48px] bg-gradient-to-br from-blue-500 to-indigo-600 blur-3xl`}
                />

                {/* The Geometric Box */}
                <div className="relative w-48 h-48">
                    {/* Background Static Box */}
                    <div className="absolute inset-0 border-2 border-border/20 rounded-[40px] backdrop-blur-sm" />
                    
                    {/* Dynamic Border Box */}
                    <motion.div 
                        initial={false}
                        animate={{ 
                            scale: phase === "inhale" ? 1.15 : phase === "exhale" ? 0.85 : 1,
                            borderColor: isActive ? "rgba(96, 165, 250, 0.5)" : "rgba(255, 255, 255, 0.05)"
                        }}
                        transition={{ duration: 4, ease: "linear" }}
                        className="absolute inset-0 border-[3px] rounded-[40px] shadow-2xl flex flex-col items-center justify-center overflow-hidden"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={phase}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="flex flex-col items-center"
                            >
                                <span className={`text-4xl font-black tracking-tighter uppercase italic ${phases[phase].color}`}>
                                    {phases[phase].label}
                                </span>
                                {isActive && (
                                    <span className="text-xl font-black tabular-nums opacity-20">{timeLeft}s</span>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Particle Stream (Subtle) */}
                        {isActive && (
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 p-4"
                            >
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_15px_rgba(96,165,250,0.8)]" />
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Corner Symbols */}
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-blue-500/40 rounded-tl-xl" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-blue-500/40 rounded-br-xl" />
                </div>
            </div>

            {/* Controls */}
            <div className="mt-8 flex flex-col items-center gap-4">
                <Button 
                    onClick={toggleActive}
                    className={`h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all duration-500 ${isActive ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20' : 'bg-primary hover:bg-primary/90 shadow-primary/20'}`}
                >
                    {isActive ? <><Square className="w-4 h-4 mr-2 fill-current" /> Terminate</> : <><Play className="w-4 h-4 mr-2 fill-current" /> Begin Tactical Focus</>}
                </Button>

                <div className="flex items-center gap-6 opacity-20 group">
                    <div className="flex flex-col items-center">
                        <Timer className="w-4 h-4 mb-1" />
                        <span className="text-[8px] font-black uppercase">16s / Cycle</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <Activity className="w-4 h-4 mb-1" />
                        <span className="text-[8px] font-black uppercase">Peak Calm</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
