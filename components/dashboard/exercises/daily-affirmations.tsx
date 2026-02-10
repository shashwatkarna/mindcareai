"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { RefreshCw, Heart, ArrowLeft, Copy, Share2 } from "lucide-react"

const affirmations = [
    "I am worthy of love and happiness.",
    "My mind is calm, and my body is relaxed.",
    "I am in charge of how I feel and today I am choosing happiness.",
    "I am enough just as I am.",
    "I possess the qualities needed to be extremely successful.",
    "My ability to conquer my challenges is limitless; my potential to succeed is infinite.",
    "I forgive myself and set myself free.",
    "I accept myself unconditionally.",
    "I am strong, confident, and capable."
]

interface AffirmationsProps {
    onBack: () => void
}

export function DailyAffirmations({ onBack }: AffirmationsProps) {
    const [index, setIndex] = useState(0)

    const nextAffirmation = () => {
        setIndex((prev) => (prev + 1) % affirmations.length)
    }

    return (
        <div className="flex flex-col items-center justify-center p-8 min-h-[500px] max-w-3xl mx-auto">
            <Button variant="ghost" onClick={onBack} className="self-start mb-8 -ml-4">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Library
            </Button>

            <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">Daily Affirmations</h2>

            <div className="relative w-full max-w-xl aspect-video md:aspect-[2/1] bg-gradient-to-br from-pink-50 to-violet-50 rounded-3xl shadow-xl flex items-center justify-center p-8 md:p-12 overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-pink-200/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-violet-200/50 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 1.1 }}
                        transition={{ duration: 0.4 }}
                        className="relative z-10 text-center"
                    >
                        <p className="text-2xl md:text-4xl font-serif font-medium text-slate-800 leading-tight">
                            &quot;{affirmations[index]}&quot;
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="flex gap-4 mt-8">
                <Button variant="outline" size="lg" onClick={nextAffirmation} className="rounded-full gap-2">
                    <RefreshCw className="w-4 h-4" /> New Affirmation
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full text-pink-500 hover:bg-pink-50">
                    <Heart className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full text-slate-500 hover:bg-slate-50">
                    <Copy className="w-5 h-5" />
                </Button>
            </div>
        </div>
    )
}
