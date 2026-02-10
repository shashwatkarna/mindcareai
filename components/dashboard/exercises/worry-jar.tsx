"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Trash2, Archive } from "lucide-react"

interface ToolProps {
    onBack: () => void
}

export function WorryJar({ onBack }: ToolProps) {
    const [worry, setWorry] = useState("")
    const [worries, setWorries] = useState<string[]>([])
    const [isSealed, setIsSealed] = useState(false)

    const addWorry = (e: React.FormEvent) => {
        e.preventDefault()
        if (worry.trim()) {
            setWorries([...worries, worry])
            setWorry("")
        }
    }

    const sealJar = () => {
        setIsSealed(true)
        setTimeout(() => {
            setWorries([])
            setIsSealed(false)
        }, 3000)
    }

    return (
        <div className="flex flex-col items-center justify-center p-8 min-h-[500px] max-w-2xl mx-auto">
            <Button variant="ghost" onClick={onBack} className="self-start mb-8 -ml-4">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Library
            </Button>

            <h2 className="text-3xl font-bold mb-2">The Worry Jar</h2>
            <p className="text-muted-foreground mb-8 text-center max-w-md">
                Type out your worries to get them out of your head. Then seal the jar to let them go.
            </p>

            <div className="relative w-64 h-80 border-4 border-slate-300 rounded-3xl rounded-t-lg bg-white/50 backdrop-blur-sm flex flex-col items-center justify-end p-4 overflow-hidden shadow-inner mb-8">
                {/* Lid */}
                <motion.div
                    animate={{ y: isSealed ? 0 : -100, opacity: isSealed ? 1 : 0 }}
                    className="absolute top-0 w-full h-8 bg-slate-400 rounded-t-lg z-20"
                />

                <AnimatePresence>
                    {worries.map((w, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: -200, rotate: Math.random() * 360, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className="bg-paper p-2 rounded shadow-sm text-xs bg-yellow-100 border border-yellow-200 mb-2 max-w-full truncate w-full text-center font-handwriting"
                        >
                            {w}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isSealed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-white/80 z-10"
                    >
                        <p className="text-lg font-bold text-slate-500">Sealed & Released</p>
                    </motion.div>
                )}
            </div>

            <form onSubmit={addWorry} className="flex gap-2 w-full max-w-md">
                <Input
                    placeholder="I am worried about..."
                    value={worry}
                    onChange={(e) => setWorry(e.target.value)}
                    className="flex-1"
                />
                <Button type="submit">Put in Jar</Button>
            </form>

            {worries.length > 0 && (
                <Button
                    variant="destructive"
                    className="mt-8 rounded-full gap-2"
                    onClick={sealJar}
                >
                    <Archive className="w-4 h-4" /> Seal the Jar & Let Go
                </Button>
            )}
        </div>
    )
}
