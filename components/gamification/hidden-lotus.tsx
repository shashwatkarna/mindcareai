"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Check } from "lucide-react"
import { toast } from "sonner"
import { unlockPremium } from "@/actions/gamification"
import { useRouter } from "next/navigation"

interface HiddenLotusProps {
    id: string
    userId?: string // Optional, if we want to server-unlock immediately
    hint?: string
}

export function HiddenLotus({ id, userId, hint }: HiddenLotusProps) {
    const [isFound, setIsFound] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const router = useRouter()

    useEffect(() => {
        // Check if already found
        const found = localStorage.getItem(`lotus_${id}`)
        if (found) {
            setIsFound(true)
        }
        setIsVisible(true)
    }, [id])

    const handleCollect = async () => {
        if (isFound) return

        // 1. Mark as found locally
        localStorage.setItem(`lotus_${id}`, "true")
        setIsFound(true)

        // 2. Play Sound (Optional - can add Audio later)

        // 3. Check Global Progress
        const allLotuses = ["lotus_dashboard", "lotus_mood", "lotus_about"]
        const foundCount = allLotuses.filter(l => localStorage.getItem(l)).length

        toast.success("You found a Golden Lotus!", {
            description: `Collected ${foundCount}/3. ${foundCount === 3 ? "All found!" : "Keep looking!"}`,
            icon: <Sparkles className="text-yellow-500" />
        })

        // 4. Unlock if Complete
        if (foundCount === 3 && userId) {
            toast.promise(unlockPremium(userId), {
                loading: "Unlocking Premium...",
                success: "Premium Unlocked! Welcome to the journey.",
                error: "Error unlocking. Please contact support."
            })
            setTimeout(() => router.refresh(), 2000)
        }
    }

    if (!isVisible || isFound) return null // Hide if already found to avoid clutter, or maybe show a "ghost" version?
    // Let's hide it completely if found to make the hunt feel "cleaner"

    return (
        <AnimatePresence>
            <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.4, scale: 0.8 }} // Subtle by default
                whileHover={{ opacity: 1, scale: 1.2, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCollect}
                className="fixed z-50 cursor-pointer group interactable-lotus"
                style={{
                    // Position should be passed via className or style from parent, but defaults here:
                    // Actually, better to let parent position it. 
                    // Reuse className or pass style? 
                    // Let's make it a relative inline component that the parent positions.
                    position: "relative" // Changed from fixed to allow parent positioning
                }}
                title="What is this?"
            >
                <div className="relative">
                    <span className="text-2xl filter drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-300">🪷</span>
                    <motion.div
                        className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-0 group-hover:opacity-50"
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </motion.button>
        </AnimatePresence>
    )
}
