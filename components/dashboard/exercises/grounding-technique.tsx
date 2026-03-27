"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, Smartphone, Volume2, Coffee, Hand, Sparkles } from "lucide-react"

interface GroundingProps {
    onBack: () => void
}

const steps = [
    { id: 0, count: 5, label: "SEE", fullLabel: "Things you can SEE", icon: Eye, color: "text-blue-500", shadow: "shadow-blue-500/20", bg: "bg-blue-500/10", border: "border-blue-500/20", desc: "Notice the small details, the colors, and the subtle light around you." },
    { id: 1, count: 4, label: "TOUCH", fullLabel: "Things you can TOUCH", icon: Hand, color: "text-emerald-500", shadow: "shadow-emerald-500/20", bg: "bg-emerald-500/10", border: "border-emerald-500/20", desc: "Feel the textures of your clothes, your seat, or the air on your skin." },
    { id: 2, count: 3, label: "HEAR", fullLabel: "Things you can HEAR", icon: Volume2, color: "text-purple-500", shadow: "shadow-purple-500/20", bg: "bg-purple-500/10", border: "border-purple-500/20", desc: "Listen for layers of sound: the hum, birds, or your own breath." },
    { id: 3, count: 2, label: "SMELL", fullLabel: "Things you can SMELL", icon: Coffee, color: "text-orange-500", shadow: "shadow-orange-500/20", bg: "bg-orange-500/10", border: "border-orange-500/20", desc: "Deep breathe. Can you find a hint of coffee, rain, or fresh soap?" },
    { id: 4, count: 1, label: "TASTE", fullLabel: "Thing you can TASTE", icon: Smartphone, color: "text-pink-500", shadow: "shadow-pink-500/20", bg: "bg-pink-500/10", border: "border-pink-500/20", desc: "Focus on the taste in your mouth, or take a refreshing sip of water." }
]

export function GroundingTechnique({ onBack }: GroundingProps) {
    const [step, setStep] = useState(0)
    const [responses, setResponses] = useState<string[][]>([[], [], [], [], []])
    const [completed, setCompleted] = useState(false)

    // Auto-exit after reflection
    useEffect(() => {
        if (completed) {
            const timer = setTimeout(() => {
                onBack()
            }, 6000) // 6 seconds
            return () => clearTimeout(timer)
        }
    }, [completed, onBack])

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1)
        } else {
            setCompleted(true)
        }
    }

    const updateResponse = (val: string, index: number) => {
        const newResponses = [...responses]
        newResponses[step][index] = val
        setResponses(newResponses)
    }

    const currentStep = steps[step]
    const currentResponses = responses[step]
    const isStepValid = currentResponses.filter(r => r?.trim()).length === currentStep.count

    return (
        <div className="flex flex-col items-center justify-center p-2 w-full max-w-5xl mx-auto h-full min-h-[480px]">
            <AnimatePresence mode="wait">
                {completed ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98, filter: "blur(15px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -20, filter: "blur(15px)" }}
                        className="w-full space-y-8 text-center py-4"
                    >
                        <div className="space-y-2">
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 shadow-2xl shadow-primary/20"
                            >
                                <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                            </motion.div>
                            <h2 className="text-4xl lg:text-5xl font-black tracking-tight uppercase leading-none italic bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">Grounding Gallery</h2>
                            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Your anchors to the present world</p>
                        </div>

                        {/* Optimized Reflection Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left max-h-[45vh] overflow-y-auto px-4 scrollbar-hide py-2">
                            {steps.map((s, idx) => (
                                <motion.div 
                                    key={s.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="relative p-6 rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-3xl overflow-hidden shadow-xl"
                                >
                                    <div className={`absolute top-0 right-0 p-4 opacity-5 ${s.color}`}>
                                        <s.icon className="w-12 h-12" />
                                    </div>
                                    <div className="relative z-10 space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-1.5 rounded-lg ${s.bg} ${s.color}`}>
                                                <s.icon className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest">{s.fullLabel}</span>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            {responses[idx].map((resp, i) => (
                                                <div 
                                                    key={i} 
                                                    className="px-3 py-1.5 bg-background/40 rounded-xl text-[11px] font-bold border border-white/5 italic text-foreground/90 leading-tight"
                                                >
                                                    &quot;{resp}&quot;
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="pt-4 space-y-4 flex flex-col items-center">
                             <div className="flex items-center gap-2.5 bg-muted/30 px-4 py-1.5 rounded-full border border-white/5">
                                <div className="h-1 w-12 bg-primary/20 rounded-full overflow-hidden">
                                     <motion.div 
                                        initial={{ width: "100%" }}
                                        animate={{ width: "0%" }}
                                        transition={{ duration: 5, ease: "linear" }}
                                        className="h-full bg-primary"
                                     />
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Auto-Return in 5s</span>
                             </div>
                             <Button onClick={onBack} size="lg" className="rounded-2xl h-12 px-10 font-black uppercase tracking-widest text-[10px] shadow-2xl transition-transform active:scale-95">
                                Return to Dashboard
                            </Button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, scale: 0.98, filter: "blur(15px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.98, filter: "blur(15px)" }}
                        className="w-full flex flex-col items-center"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 w-full items-center">
                            {/* Left: Balanced Sensory Focus */}
                            <div className="space-y-6 text-left px-4">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <motion.div 
                                            key={`count-${step}`}
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className={`text-9xl lg:text-[10rem] font-black tracking-tighter leading-none transition-colors ${currentStep.color} select-none drop-shadow-xl`}
                                            style={{ textShadow: `0 10px 40px ${currentStep.shadow.split(' ')[1]}` }}
                                        >
                                            {currentStep.count}
                                        </motion.div>
                                        <div className="space-y-2">
                                            <div className={`p-4 rounded-[32px] ${currentStep.bg} ${currentStep.color} ${currentStep.shadow} shadow-xl backdrop-blur-xl border border-white/5 inline-flex`}>
                                                <currentStep.icon className="w-10 h-10" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Phase {step + 1}</span>
                                                <h2 className="text-4xl font-black tracking-tight uppercase leading-none italic">{currentStep.label}</h2>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <p className="text-lg font-bold leading-snug max-w-md text-foreground/80">
                                        {currentStep.desc}
                                    </p>
                                </div>

                                {/* Compact Progress track */}
                                <div className="flex gap-2.5 items-center">
                                    {steps.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-2 rounded-full transition-all duration-700 ${i === step ? "w-12 bg-primary" : i < step ? "w-2.5 bg-primary/30" : "w-2.5 bg-muted-foreground/10"}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Right: Small & Subtle Inputs */}
                            <div className="relative group lg:-translate-y-2">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-[44px] blur-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[36px] p-6 shadow-2xl space-y-5 max-w-sm mx-auto">
                                    <div className="grid grid-cols-1 gap-2.5">
                                        {Array.from({ length: currentStep.count }).map((_, i) => (
                                            <motion.div 
                                                key={`input-${step}-${i}`}
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 + i * 0.05 }}
                                            >
                                                <Input
                                                    placeholder={`I ${currentStep.label.toLowerCase()}...`}
                                                    value={responses[step][i] || ""}
                                                    onChange={(e) => updateResponse(e.target.value, i)}
                                                    className="bg-background/20 border-white/5 focus:border-primary/20 rounded-xl h-11 text-[11px] px-4 placeholder:italic placeholder:opacity-20 shadow-inner"
                                                />
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div className="space-y-3">
                                        <Button 
                                            onClick={handleNext} 
                                            className={`w-full h-12 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all duration-500 ${!isStepValid ? 'opacity-10 grayscale' : 'shadow-primary/10 scale-100 bg-foreground text-background hover:bg-foreground/90'}`}
                                            disabled={!isStepValid}
                                        >
                                            {step === steps.length - 1 ? "End Journey" : "Continue"}
                                        </Button>
                                        
                                        <div className="flex items-center justify-between px-1">
                                            <span className="text-[8px] font-black uppercase tracking-widest opacity-20 italic">{isStepValid ? "Field Complete" : "Waiting for Answer"}</span>
                                            <span className="text-[8px] font-black uppercase tracking-widest opacity-20 italic">Step {step + 1}/5</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
