"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check, Eye, Smartphone, Volume2, Coffee, Hand } from "lucide-react"

interface GroundingProps {
    onBack: () => void
}

const steps = [
    { count: 5, label: "Things you can SEE", icon: Eye, color: "text-blue-500", bg: "bg-blue-100", desc: "Look around you. Find 5 distinct objects." },
    { count: 4, label: "Things you can TOUCH", icon: Hand, color: "text-emerald-500", bg: "bg-emerald-100", desc: "Notice the texture of your clothes, the desk, or your skin." },
    { count: 3, label: "Things you can HEAR", icon: Volume2, color: "text-purple-500", bg: "bg-purple-100", desc: "Listen carefully. Can you hear the wind? Cars? Your breath?" },
    { count: 2, label: "Things you can SMELL", icon: Coffee, color: "text-orange-500", bg: "bg-orange-100", desc: "Try to find the scent of soap, coffee, or fresh air." },
    { count: 1, label: "Thing you can TASTE", icon: Smartphone, color: "text-pink-500", bg: "bg-pink-100", desc: "What does your mouth taste like right now? Or take a sip of water." }
]

export function GroundingTechnique({ onBack }: GroundingProps) {
    const [step, setStep] = useState(0)
    const [completed, setCompleted] = useState(false)

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1)
        } else {
            setCompleted(true)
        }
    }

    const handleReset = () => {
        setStep(0)
        setCompleted(false)
    }

    const currentStep = steps[step]

    return (
        <div className="flex flex-col items-center justify-center p-8 min-h-[500px] max-w-2xl mx-auto">
            <Button variant="ghost" onClick={onBack} className="self-start mb-8 -ml-4">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Library
            </Button>

            <h2 className="text-3xl font-bold mb-2">5-4-3-2-1 Grounding</h2>
            <p className="text-muted-foreground mb-12 text-center max-w-md">
                A mindfulness technique to reconnect with the present moment when you feel anxious.
            </p>

            {completed ? (
                <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                        <Check className="w-12 h-12" />
                    </div>
                    <h3 className="text-2xl font-bold">You did great!</h3>
                    <p className="text-muted-foreground">Take a deep breath. Notice how you feel now compared to before.</p>
                    <Button onClick={handleReset} variant="outline" className="mt-4">
                        Do it again
                    </Button>
                </div>
            ) : (
                <div className="w-full max-w-lg">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-card border border-border rounded-3xl p-8 shadow-sm"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <span className={`text-5xl font-bold ${currentStep.color}`}>
                                    {currentStep.count}
                                </span>
                                <div className={`p-3 rounded-2xl ${currentStep.bg} ${currentStep.color}`}>
                                    <currentStep.icon className="w-8 h-8" />
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold mb-2 text-foreground">{currentStep.label}</h3>
                            <p className="text-lg text-muted-foreground mb-8">
                                {currentStep.desc}
                            </p>

                            <Button onClick={handleNext} className="w-full h-12 text-lg rounded-xl">
                                {step === steps.length - 1 ? "I'm Done" : "Next Step"}
                            </Button>
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex gap-2 justify-center mt-8">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? "w-8 bg-primary" : i < step ? "w-2 bg-primary/40" : "w-2 bg-muted"}`}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
