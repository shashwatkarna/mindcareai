"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Heart, ArrowLeft, Copy, Check, Sparkles } from "lucide-react"

const affirmations = [
    "I am worthy of love and happiness.",
    "My mind is calm, and my body is relaxed.",
    "I am in charge of how I feel and today I am choosing happiness.",
    "I am enough just as I am.",
    "I possess the qualities needed to be extremely successful.",
    "My ability to conquer my challenges is limitless; my potential to succeed is infinite.",
    "I forgive myself and set myself free.",
    "I accept myself unconditionally.",
    "I am strong, confident, and capable.",
    "I am resilient, strong, and brave.",
    "I choose to be kind to myself today.",
    "I am proud of how far I've come."
]

interface AffirmationsProps {
    onBack: () => void
}

export function DailyAffirmations({ onBack }: AffirmationsProps) {
    const getRotatingIndex = useCallback(() => {
        const now = new Date()
        const hoursSinceEpoch = Math.floor(now.getTime() / (1000 * 60 * 60 * 3))
        return hoursSinceEpoch % affirmations.length
    }, [])

    const initialIndex = useMemo(() => getRotatingIndex(), [getRotatingIndex])
    const [index, setIndex] = useState(initialIndex)
    const [isLiked, setIsLiked] = useState(false)
    const [isCopied, setIsCopied] = useState(false)

    useEffect(() => {
        const checkRotation = setInterval(() => {
            const newIndex = getRotatingIndex()
            if (newIndex !== index) {
                setIndex(newIndex)
                setIsLiked(false)
                setIsCopied(false)
            }
        }, 10000) // 10s check - light enough
        return () => clearInterval(checkRotation)
    }, [index, getRotatingIndex])

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(affirmations[index])
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy!", err)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center p-2 w-full max-w-4xl mx-auto h-full min-h-[400px]">
            {/* Header */}
            <div className="w-full flex justify-between items-center mb-4 px-2">
                <Button variant="ghost" onClick={onBack} size="sm" className="rounded-xl px-3 hover:bg-muted/50 transition-all font-bold uppercase tracking-widest text-[9px]">
                    <ArrowLeft className="w-3 h-3 mr-1.5" /> Back
                </Button>
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 bg-primary/30 rounded-full" />
                   <span className="text-[9px] font-black uppercase tracking-widest opacity-30">Sanctuary Boost</span>
                </div>
            </div>

            {/* Title */}
            <div className="text-center mb-6 space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 transition-colors">
                    <Sparkles className="w-3 h-3 text-primary" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary">Live Affirmation</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 italic">
                    Daily Presence
                </h2>
            </div>

            {/* Optimized Card - Lighter effects to fix lag */}
            <div className="relative group w-full max-w-xl px-4">
                <div className="relative aspect-video lg:aspect-[2.5/1] bg-card/60 backdrop-blur-xl border border-border/40 rounded-[32px] flex items-center justify-center p-8 overflow-hidden shadow-xl">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-[40px] -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-pink-500/5 rounded-full blur-[60px] translate-x-1/2 translate-y-1/2" />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="relative z-10 text-center"
                        >
                            <p className="text-xl md:text-2xl lg:text-3xl font-black italic tracking-tight text-foreground/90 leading-tight select-none px-6">
                                &quot;{affirmations[index]}&quot;
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Interaction Pill */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-1 p-1 bg-background/95 backdrop-blur-md rounded-2xl border border-border shadow-lg z-20">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setIsLiked(!isLiked)}
                        className={`size-9 rounded-xl transition-all duration-200 ${isLiked ? 'bg-pink-500 text-white shadow-md' : 'hover:bg-pink-500/10 text-pink-500/60'}`}
                    >
                        <motion.div animate={isLiked ? { scale: [1, 1.25, 1] } : {}}>
                            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                        </motion.div>
                    </Button>

                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={copyToClipboard}
                        className={`size-9 rounded-xl transition-all duration-200 ${isCopied ? 'bg-emerald-500 text-white shadow-md' : 'hover:bg-indigo-500/10 text-indigo-500/60'}`}
                    >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </Button>
                </div>
            </div>

            <div className="mt-8 h-px w-8 bg-border/20 mx-auto" />
        </div>
    )
}
