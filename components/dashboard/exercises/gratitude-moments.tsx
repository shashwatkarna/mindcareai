"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, PartyPopper, Star } from "lucide-react"
import confetti from "canvas-confetti"

interface ToolProps {
    onBack: () => void
}

export function GratitudeMoments({ onBack }: ToolProps) {
    const [items, setItems] = useState(["", "", ""])
    const [isSaved, setIsSaved] = useState(false)

    const handleChange = (index: number, value: string) => {
        const newItems = [...items]
        newItems[index] = value
        setItems(newItems)
    }

    const handleSave = () => {
        if (items.some(i => i.trim())) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            })
            setIsSaved(true)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center p-8 min-h-[500px] max-w-xl mx-auto">
            <Button variant="ghost" onClick={onBack} className="self-start mb-8 -ml-4">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Library
            </Button>

            <h2 className="text-3xl font-bold mb-2">Gratitude Moments</h2>
            <p className="text-muted-foreground mb-8 text-center">
                Focusing on the good rewires your brain for happiness. List 3 things you are grateful for today.
            </p>

            {isSaved ? (
                <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="w-10 h-10 fill-current" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Beautiful!</h3>
                    <p className="text-muted-foreground">Keep holding onto these positive moments.</p>
                </div>
            ) : (
                <div className="space-y-4 w-full">
                    {items.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-2xl text-yellow-400">{i + 1}.</span>
                                <Input
                                    className="h-14 text-lg bg-card/50"
                                    placeholder={i === 0 ? "The warm sun..." : i === 1 ? "A good meal..." : "A friend's smile..."}
                                    value={item}
                                    onChange={(e) => handleChange(i, e.target.value)}
                                />
                            </div>
                        </motion.div>
                    ))}

                    <Button
                        size="lg"
                        className="w-full mt-6 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white border-0"
                        onClick={handleSave}
                    >
                        <PartyPopper className="w-5 h-5 mr-2" /> Save & Celebrate
                    </Button>
                </div>
            )}
        </div>
    )
}
