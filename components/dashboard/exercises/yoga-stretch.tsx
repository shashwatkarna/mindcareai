"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronRight, Calculator, Timer } from "lucide-react"

interface ToolProps {
    onBack: () => void
}

const poses = [
    {
        id: 1,
        name: "Neck Release",
        desc: "Gently tilt your head towards your shoulder. Hold for 15s each side.",
        color: "bg-orange-100 text-orange-600"
    },
    {
        id: 2,
        name: "Seated Cat-Cow",
        desc: "Arch your back looking up, then round your spine looking down. Repeat 5 times.",
        color: "bg-blue-100 text-blue-600"
    },
    {
        id: 3,
        name: "Shoulder Roll",
        desc: "Roll your shoulders up, back, and down. Release the tension.",
        color: "bg-purple-100 text-purple-600"
    },
    {
        id: 4,
        name: "Forward Fold",
        desc: "Stand up and gently fold forward, letting your arms hang loose.",
        color: "bg-green-100 text-green-600"
    }
]

export function YogaStretch({ onBack }: ToolProps) {
    const [currentPose, setCurrentPose] = useState(0)

    const nextPose = () => {
        setCurrentPose((prev) => (prev + 1) % poses.length)
    }

    const pose = poses[currentPose]

    return (
        <div className="flex flex-col items-center justify-center p-8 min-h-[500px] max-w-2xl mx-auto">
            <Button variant="ghost" onClick={onBack} className="self-start mb-8 -ml-4">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Library
            </Button>

            <h2 className="text-3xl font-bold mb-2">Desk Yoga</h2>
            <p className="text-muted-foreground mb-12 text-center">
                Simple stretches to release physical tension and anxiety.
            </p>

            <AnimatePresence mode="wait">
                <motion.div
                    key={pose.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="w-full"
                >
                    <div className={`w-full aspect-[4/3] rounded-3xl ${pose.color} flex flex-col items-center justify-center p-8 shadow-xl mb-8`}>
                        <div className="text-9xl mb-4 opacity-50">🧘</div>
                        <h3 className="text-3xl font-bold mb-2 text-center">{pose.name}</h3>
                        <p className="text-center font-medium opacity-80 max-w-md text-lg">{pose.desc}</p>
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-4">
                <div className="flex gap-2">
                    {poses.map((_, i) => (
                        <div
                            key={i}
                            className={`h-2 rounded-full transition-all ${i === currentPose ? "w-8 bg-black" : "w-2 bg-gray-200"}`}
                        />
                    ))}
                </div>
                <Button onClick={nextPose} size="lg" className="rounded-full px-8">
                    Next Stretch <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
    )
}
