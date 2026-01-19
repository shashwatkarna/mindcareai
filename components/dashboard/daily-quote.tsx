"use client"

import { useEffect, useState } from "react"
import { Quote } from "lucide-react"
import { Card } from "@/components/ui/card"

const quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
    { text: "It is often the small steps, not the giant leaps, that bring about the most lasting change.", author: "Queen Elizabeth II" },
    { text: "Mental health is not a destination, but a process. It's about how you drive, not where you're going.", author: "Noam Shpancer" },
    { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
    { text: "Your present circumstances don't determine where you can go; they merely determine where you start.", author: "Nido Qubein" },
    { text: "There is hope, even when your brain tells you there isn't.", author: "John Green" },
    { text: "Out of your vulnerabilities will come your strength.", author: "Sigmund Freud" },
    { text: "You are the one thing in this world, above all other things, that you must never give up on.", author: "Lili Reinhart" },
    { text: "Self-care is how you take your power back.", author: "Lalah Delia" },
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
        <Card className="p-8 border-border bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden animate-slide-in-up [animation-delay:400ms]">
            {/* Decorative background quote */}
            <div className="absolute top-4 right-4 opacity-5">
                <Quote size={120} />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                <div className="p-3 bg-background rounded-full shadow-sm border border-border">
                    <Quote className="w-6 h-6 text-primary" />
                </div>

                <blockquote className="text-2xl font-medium leading-relaxed italic text-foreground/80 max-w-2xl">
                    "{quote.text}"
                </blockquote>

                <cite className="text-sm font-bold text-muted-foreground uppercase tracking-widest not-italic">
                    — {quote.author}
                </cite>
            </div>
        </Card>
    )
}
