"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, Pause, RefreshCw, Volume2, VolumeX, Sparkles, Activity } from "lucide-react"

interface ToolProps {
    onBack: () => void
}

const groups = [
    {
        id: "hands",
        name: "Clenched Fists",
        instruction: "Squeeze both fists tightly. Feel the tension in your hands and forearms.",
        duration: 8,
        release: 10,
        color: "from-blue-400/20 to-blue-600/10"
    },
    {
        id: "shoulders",
        name: "Shoulder Shrug",
        instruction: "Lift your shoulders up as if to touch your ears. Hold the tension.",
        duration: 8,
        release: 10,
        color: "from-indigo-400/20 to-indigo-600/10"
    },
    {
        id: "face",
        name: "Facial Tensing",
        instruction: "Squint your eyes and scrunch up your nose and forehead. Squeeze tight.",
        duration: 7,
        release: 10,
        color: "from-violet-400/20 to-violet-600/10"
    },
    {
        id: "stomach",
        name: "Core Tightning",
        instruction: "Tighten your abdominal muscles as if protecting your core.",
        duration: 8,
        release: 10,
        color: "from-emerald-400/20 to-emerald-600/10"
    },
    {
        id: "feet",
        name: "Toe Curl",
        instruction: "Curl your toes downward and tighten the arches of your feet.",
        duration: 8,
        release: 12,
        color: "from-amber-400/20 to-orange-600/10"
    }
]

function MuscleFigure({ groupId, isTensing }: { groupId: string, isTensing: boolean }) {
    return (
        <svg viewBox="0 0 100 120" className="w-full h-full">
            <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity={0.3}>
                <path d="M50 35 L50 80 M50 80 L35 110 M50 80 L65 110 M50 50 L25 75 M50 50 L75 75" />
                <circle cx="50" cy="25" r="8" />
            </g>
            
            <g fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
                {/* Highlight/Animate specific group */}
                {groupId === "hands" && (
                    <motion.g animate={isTensing ? { scale: [1, 0.95, 1], x: [-1, 1, -1] } : {}} transition={{ duration: 0.2, repeat: Infinity }}>
                        <path d="M25 75 L20 80" className="text-primary" />
                        <path d="M75 75 L80 80" className="text-primary" />
                    </motion.g>
                )}
                {groupId === "shoulders" && (
                    <motion.path 
                        d="M35 45 Q50 40 65 45" 
                        animate={isTensing ? { y: -5, strokeWidth: 6 } : { y: 0 }}
                        className="text-primary"
                    />
                )}
                {groupId === "face" && (
                    <motion.circle 
                        cx="50" cy="25" r="8" 
                        animate={isTensing ? { scale: 0.85, strokeWidth: 6 } : { scale: 1 }}
                        className="text-primary"
                    />
                )}
                {groupId === "stomach" && (
                    <motion.path 
                        d="M45 60 L55 60" 
                        animate={isTensing ? { strokeWidth: 10, scaleX: 1.2 } : { strokeWidth: 4 }}
                        className="text-primary"
                    />
                )}
                {groupId === "feet" && (
                    <motion.g animate={isTensing ? { y: 2 } : {}}>
                        <path d="M35 110 L30 115" className="text-primary" />
                        <path d="M65 110 L70 115" className="text-primary" />
                    </motion.g>
                )}
            </g>
        </svg>
    )
}

export function MuscleRelaxation({ onBack }: ToolProps) {
    const [currentStep, setCurrentStep] = useState(0)
    const [isTensing, setIsTensing] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [timeLeft, setTimeLeft] = useState(groups[0].duration)
    const speechRef = useRef(false)

    const speak = useCallback((text: string) => {
        if (typeof window === 'undefined' || isMuted) return
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 0.9
        window.speechSynthesis.speak(utterance)
    }, [isMuted])

    const startPhase = useCallback((step: number, tensing: boolean) => {
        const group = groups[step]
        setIsTensing(tensing)
        setTimeLeft(tensing ? group.duration : group.release)
        if (tensing) {
            speak(`Tense your ${group.name}. ${group.instruction}`)
        } else {
            speak(`Now, release completely. Feel the relaxation flowing through your ${group.name.toLowerCase()}.`)
        }
    }, [speak])

    const nextStep = useCallback(() => {
        if (isTensing) {
            startPhase(currentStep, false)
        } else {
            if (currentStep === groups.length - 1) {
                setIsPlaying(false)
                speak("Exercise complete. You are now fully relaxed. Return whenever you feel tension.")
                onBack()
                return
            }
            const nextIdx = currentStep + 1
            setCurrentStep(nextIdx)
            startPhase(nextIdx, true)
        }
    }, [currentStep, isTensing, onBack, speak, startPhase])

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (isPlaying && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
        } else if (isPlaying && timeLeft === 0) {
            nextStep()
        }
        return () => clearInterval(timer)
    }, [isPlaying, timeLeft, nextStep])

    const isUnmutingRef = useRef(false)
    useEffect(() => {
        if (isMuted && typeof window !== 'undefined') {
            window.speechSynthesis.cancel()
            isUnmutingRef.current = true
        } else if (!isMuted && isUnmutingRef.current) {
            const group = groups[currentStep]
            speak(`Voice guidance resumed. ${isTensing ? group.name + '. ' + group.instruction : 'Release completely.'}`)
            isUnmutingRef.current = false
        }
    }, [isMuted, currentStep, isTensing, speak])

    const step = groups[currentStep]
    const progress = (1 - timeLeft / (isTensing ? step.duration : step.release)) * 100

    return (
        <div className={`flex flex-col items-center justify-center p-2 w-full h-full min-h-[450px] transition-all duration-1000 bg-gradient-to-br ${step.color}`}>
            <div className="w-full max-w-5xl flex justify-between items-center mb-6 px-4">
                <Button variant="ghost" onClick={onBack} size="sm" className="rounded-xl h-8 hover:bg-muted/30 font-bold tracking-widest text-[9px] uppercase">
                    <ArrowLeft className="w-3 h-3 mr-1.5" /> Back
                </Button>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)} className="h-8 w-8 rounded-full">
                        {isMuted ? <VolumeX className="w-4 h-4 opacity-40" /> : <Volume2 className="w-4 h-4 text-primary" />}
                    </Button>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/5 rounded-full border border-primary/10">
                        <Activity className={`w-3 h-3 text-primary ${isPlaying ? 'animate-pulse' : ''}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest">PMR Therapy</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 w-full max-w-4xl flex-1 px-4">
                <div className="w-full lg:w-1/2 flex flex-col items-center relative">
                    <div className="w-64 h-64 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10 flex items-center justify-center relative shadow-2xl overflow-hidden group">
                        <MuscleFigure groupId={step.id} isTensing={isTensing && isPlaying} />
                        <motion.div 
                            animate={isTensing && isPlaying ? { opacity: [0.1, 0.3, 0.1] } : { opacity: 0 }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                            className="absolute inset-0 bg-primary/20 pointer-events-none"
                        />
                        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                            <motion.circle 
                                cx="50%" cy="50%" r="48%" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="300" 
                                animate={{ strokeDashoffset: 300 - (progress / 100) * 300 }}
                                className={`${isTensing ? 'text-rose-500' : 'text-emerald-500'} transition-all duration-1000`}
                            />
                        </svg>
                    </div>
                    
                    <div className="mt-6 flex gap-1.5">
                        {groups.map((_, i) => (
                            <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === currentStep ? 'w-8 bg-primary shadow-lg' : 'w-1.5 bg-primary/10'}`} />
                        ))}
                    </div>
                </div>

                <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
                    <div className="space-y-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isTensing ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                            {isTensing ? 'Phase: Tense' : 'Phase: Release'}
                        </span>
                        <h2 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase italic">{step.name}</h2>
                        <p className="text-sm lg:text-base font-medium opacity-60 max-w-md mx-auto lg:mx-0 leading-relaxed">{step.instruction}</p>
                    </div>

                    <div className="flex items-center justify-center lg:justify-start gap-4">
                        <div className="text-6xl font-black tabular-nums tracking-tighter opacity-10">{timeLeft}s</div>
                        <div className="h-10 w-px bg-border/20 mx-1" />
                        <Button 
                            onClick={() => {
                                if (!isPlaying) startPhase(currentStep, true)
                                setIsPlaying(!isPlaying)
                            }}
                            className={`h-16 px-10 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all duration-500 ${isPlaying ? 'bg-orange-500 hover:bg-orange-600' : 'bg-primary hover:bg-primary/90'}`}
                        >
                            {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                            {isPlaying ? 'Pause' : 'Start Guidance'}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mt-8 py-4 opacity-5 flex flex-col items-center gap-1">
                <div className="w-12 h-px bg-foreground" />
                <span className="text-[9px] font-black uppercase tracking-[0.5em]">Tension Release</span>
            </div>
        </div>
    )
}
