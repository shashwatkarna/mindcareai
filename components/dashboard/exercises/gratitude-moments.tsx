"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Sparkles, Plus, History, Flower2 } from "lucide-react"

interface ToolProps {
    onBack: () => void
}

interface GratitudeItem {
    id: string
    text: string
    date: string
}

export function GratitudeMoments({ onBack }: ToolProps) {
    const [currentEntries, setCurrentEntries] = useState(["", "", ""])
    const [pastEntries, setPastEntries] = useState<GratitudeItem[]>([])
    const [isSaving, setIsSaving] = useState(false)
    const audioContextRef = useRef<AudioContext | null>(null)

    // Load History
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("mindcare_gratitude_garden") || "[]")
        setPastEntries(saved)
    }, [])

    const initAudio = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        }
    }, [])

    const playShimmer = useCallback(() => {
        if (!audioContextRef.current) return
        const ctx = audioContextRef.current
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = "sine"
        osc.frequency.setValueAtTime(800, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1)
        gain.gain.setValueAtTime(0, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + 0.4)
    }, [])

    const handleSave = () => {
        const validEntries = currentEntries.filter(e => e.trim().length > 0)
        if (validEntries.length === 0) return
        initAudio()
        setIsSaving(true)
        playShimmer()
        const newItems: GratitudeItem[] = validEntries.map(text => ({
            id: Math.random().toString(36).substr(2, 9),
            text,
            date: new Date().toLocaleDateString()
        }))
        const updatedGarden = [...newItems, ...pastEntries].slice(0, 15) // Keep more for history
        setPastEntries(updatedGarden)
        localStorage.setItem("mindcare_gratitude_garden", JSON.stringify(updatedGarden))
        setTimeout(() => {
            setCurrentEntries(["", "", ""])
            setIsSaving(false)
        }, 800)
    }

    return (
        <div className="flex flex-col items-center justify-start p-1 w-full max-w-5xl mx-auto h-full min-h-[380px]">
            {/* Minimal Header */}
            <div className="w-full flex justify-between items-center mb-4 px-4">
                <Button variant="ghost" onClick={onBack} size="sm" className="rounded-xl h-8 hover:bg-muted/30 font-bold tracking-widest text-[9px]">
                    <ArrowLeft className="w-3 h-3 mr-1.5" /> Back
                </Button>
                <div className="flex items-center gap-1.5">
                   <Flower2 className="w-3 h-3 text-amber-500 opacity-60" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-amber-500/60">Garden Sanctuary</span>
                </div>
            </div>

            {/* Centered Content - Zero Scroll Fit */}
            <div className="w-full max-w-2xl px-4 space-y-6">
                <div className="text-center space-y-1">
                    <h2 className="text-3xl font-black tracking-tighter italic bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">
                        Grow Today&apos;s Gratitude
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">Focus on 3 moments of light</p>
                </div>

                <AnimatePresence mode="wait">
                    {!isSaving ? (
                        <motion.div 
                            key="inputs"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {currentEntries.map((text, i) => (
                                    <div key={i} className="relative group p-4 bg-card/20 backdrop-blur-xl border border-border/40 rounded-3xl transition-all duration-300 hover:border-amber-400/30">
                                        <span className="absolute top-3 left-4 text-[10px] font-black opacity-20 uppercase">#{i + 1}</span>
                                        <Input
                                            className="h-14 mt-2 px-0 bg-transparent border-0 text-center text-sm ring-offset-transparent focus-visible:ring-0 transition-all placeholder:opacity-30"
                                            placeholder="..."
                                            value={text}
                                            onChange={(e) => {
                                                const next = [...currentEntries]
                                                next[i] = e.target.value
                                                setCurrentEntries(next)
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                            <Button 
                                onClick={handleSave} 
                                className="w-full h-12 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-xl shadow-amber-500/10 font-black uppercase tracking-widest text-[10px]"
                                disabled={!currentEntries.some(e => e.trim().length > 0)}
                            >
                                <Plus className="w-4 h-4 mr-2" /> Plant in Library
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-10"
                        >
                            <div className="relative">
                                <motion.div 
                                    animate={{ rotate: 360 }} 
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    className="w-12 h-12 border-2 border-amber-400/20 border-t-amber-500 rounded-full"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                                </div>
                            </div>
                            <span className="mt-4 text-[10px] font-black uppercase tracking-widest text-amber-500">Watering...</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Simplified History - No Container Box Look */}
                {pastEntries.length > 0 && !isSaving && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="pt-4"
                    >
                        <div className="flex items-center justify-center gap-3 mb-4 opacity-30">
                            <div className="h-px w-8 bg-border" />
                            <History className="w-3 h-3" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Recent Blooms</span>
                            <div className="h-px w-8 bg-border" />
                        </div>
                        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 px-2 scroll-smooth">
                            {pastEntries.map((item) => (
                                <div 
                                    key={item.id} 
                                    className="min-w-[140px] p-4 bg-transparent border-l border-amber-400/10 flex flex-col gap-1.5 transition-colors hover:border-amber-400/40"
                                >
                                    <p className="text-[11px] leading-tight text-foreground/70 italic line-clamp-2">&quot;{item.text}&quot;</p>
                                    <span className="text-[7px] opacity-30 uppercase font-black tracking-widest">{item.date}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="mt-6 py-4 opacity-10 flex flex-col items-center gap-1">
                <div className="w-8 h-px bg-border md:w-16" />
                <span className="text-[8px] font-black uppercase tracking-[0.4em]">Endless Positivity</span>
            </div>
        </div>
    )
}
