"use client"

import { useEffect, useState } from "react"
import { Quote, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"

const quotes = [
    {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
        category: "Passion"
    },
    {
        text: "Happiness is not something ready made. It comes from your own actions.",
        author: "Dalai Lama",
        category: "Happiness"
    },
    {
        text: "It is often the small steps, not the giant leaps, that bring about the most lasting change.",
        author: "Queen Elizabeth II",
        category: "Progress"
    },
    {
        text: "Mental health is not a destination, but a process. It's about how you drive, not where you're going.",
        author: "Noam Shpancer",
        category: "Mental Health"
    },
    {
        text: "You don't have to control your thoughts. You just have to stop letting them control you.",
        author: "Dan Millman",
        category: "Mindfulness"
    },
    {
        text: "Your present circumstances don't determine where you can go; they merely determine where you start.",
        author: "Nido Qubein",
        category: "Growth"
    },
    {
        text: "There is hope, even when your brain tells you there isn't.",
        author: "John Green",
        category: "Hope"
    },
    {
        text: "Out of your vulnerabilities will come your strength.",
        author: "Sigmund Freud",
        category: "Strength"
    },
    {
        text: "You are the one thing in this world, above all other things, that you must never give up on.",
        author: "Lili Reinhart",
        category: "Self-Love"
    },
    {
        text: "Self-care is how you take your power back.",
        author: "Lalah Delia",
        category: "Self-Care"
    },
]

export function DailyQuote() {
    const [quote, setQuote] = useState(quotes[0])

    useEffect(() => {
        // Seed random with today's date so it's consistent for the whole day
        const today = new Date()
        const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()

        // Simple pseudo-random index
        const index = seed % quotes.length
        setQuote(quotes[index])
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            whileHover={{ y: -2 }}
        >
            <Card className="border border-white/10 bg-gradient-to-r from-white/5 via-white/[0.02] to-transparent backdrop-blur-xl relative overflow-hidden shadow-lg">
                {/* Subtle gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 opacity-50" />

                {/* Small floating quote mark */}
                <motion.div
                    className="absolute top-2 right-3 opacity-5"
                    animate={{
                        rotate: [0, 5, 0],
                        scale: [1, 1.05, 1]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Quote size={40} className="text-primary" />
                </motion.div>

                <div className="relative z-10 p-4 md:p-5">
                    <div className="flex items-start gap-3">
                        {/* Compact icon */}
                        <motion.div
                            className="p-2 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-lg shadow-md border border-white/10 shrink-0"
                            animate={{
                                boxShadow: [
                                    "0 0 10px rgba(139,92,246,0.2)",
                                    "0 0 20px rgba(139,92,246,0.4)",
                                    "0 0 10px rgba(139,92,246,0.2)",
                                ]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <Quote className="w-4 h-4 text-primary drop-shadow-[0_0_6px_rgba(139,92,246,0.6)]" />
                        </motion.div>

                        <div className="flex-1 min-w-0">
                            {/* Category badge - smaller */}
                            <div className="mb-2">
                                <span className="inline-block px-2 py-0.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-[10px] font-semibold text-primary uppercase tracking-wider">
                                    {quote.category}
                                </span>
                            </div>

                            {/* Quote text - compact */}
                            <blockquote className="text-sm md:text-base font-medium leading-relaxed italic mb-2">
                                <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                    "{quote.text}"
                                </span>
                            </blockquote>

                            {/* Author - inline */}
                            <cite className="text-xs font-semibold text-muted-foreground uppercase tracking-wide not-italic">
                                — {quote.author}
                            </cite>
                        </div>
                    </div>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </Card>
        </motion.div>
    )
}
