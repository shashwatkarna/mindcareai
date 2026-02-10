"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw } from "lucide-react"

interface ToolProps {
    onBack: () => void
}

interface Bubble {
    id: number
    x: number
    y: number
    size: number
    color: string
}

export function BubblePop({ onBack }: ToolProps) {
    const [bubbles, setBubbles] = useState<Bubble[]>([])
    const [poppedCount, setPoppedCount] = useState(0)

    const colors = ["bg-red-400", "bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-purple-400", "bg-pink-400"]

    const generateBubbles = () => {
        const newBubbles = Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            x: Math.random() * 80 + 10, // 10% to 90%
            y: Math.random() * 80 + 10,
            size: Math.random() * 40 + 40, // 40px to 80px
            color: colors[Math.floor(Math.random() * colors.length)]
        }))
        setBubbles(newBubbles)
        setPoppedCount(0)
    }

    useEffect(() => {
        generateBubbles()
    }, [])

    const popBubble = (id: number) => {
        setBubbles(prev => prev.filter(b => b.id !== id))
        setPoppedCount(prev => prev + 1)
        // Add sound effect here if possible, for now visual only
    }

    return (
        <div className="flex flex-col items-center justify-center p-8 min-h-[600px] w-full">
            <div className="w-full max-w-4xl flex justify-between items-center mb-8">
                <Button variant="ghost" onClick={onBack} className="-ml-4">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Library
                </Button>
                <div className="text-xl font-bold text-foreground">Popped: {poppedCount}</div>
            </div>

            <h2 className="text-3xl font-bold mb-2">Stress Bubble Pop</h2>
            <p className="text-muted-foreground mb-8 text-center">
                Click the bubbles to pop them. Great for instant stress relief!
            </p>

            <div className="relative w-full max-w-3xl h-[400px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl overflow-hidden shadow-inner">
                <AnimatePresence>
                    {bubbles.map((bubble) => (
                        <motion.button
                            key={bubble.id}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, x: `${bubble.x}%`, y: `${bubble.y}%` }}
                            exit={{ scale: 1.5, opacity: 0 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => popBubble(bubble.id)}
                            className={`absolute rounded-full shadow-lg ${bubble.color} opacity-80 backdrop-blur-sm border-2 border-white/50 cursor-pointer`}
                            style={{
                                width: bubble.size,
                                height: bubble.size,
                                top: 0,
                                left: 0
                            }}
                        />
                    ))}
                </AnimatePresence>

                {bubbles.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Button size="lg" onClick={generateBubbles} className="animate-bounce">
                            <RefreshCw className="w-4 h-4 mr-2" /> Play Again
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
