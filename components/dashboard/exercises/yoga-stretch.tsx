"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronRight, ChevronLeft, Play, Pause, Maximize, Minimize, RefreshCw, Volume2, VolumeX, Sparkles } from "lucide-react"

interface ToolProps {
    onBack: () => void
}

const poses = [
    {
        id: "neck-release",
        name: "Neck Release",
        desc: "Gently tilt your head towards your shoulder. Feel the stretch along the side of your neck.",
        instruction: "Gently tilt your head towards your right shoulder. Hold the stretch, then slowly switch to your left side. Breathe deeply.",
        duration: 20,
        color: "from-sky-400/20 to-blue-500/10"
    },
    {
        id: "shoulder-roll",
        name: "Shoulder Rolls",
        desc: "Inhale as you lift your shoulders to your ears, exhale as you roll them back and down.",
        instruction: "Lift your shoulders high toward your ears. Roll them back and down with control. Repeat this rhythm.",
        duration: 20,
        color: "from-violet-400/20 to-purple-500/10"
    },
    {
        id: "seated-cat-cow",
        name: "Seated Cat-Cow",
        desc: "Inhale to arch your back (Cow). Exhale to round your spine and tuck your chin (Cat).",
        instruction: "Inhale, arch your back, and look up to the sky. Exhale, round your spine, and tuck your chin to your chest.",
        duration: 30,
        color: "from-emerald-400/20 to-teal-500/10"
    },
    {
        id: "wrist-stretch",
        name: "Wrist Stretch",
        desc: "Extend one arm forward, palm up. Gently pull back on your fingers with the other hand.",
        instruction: "Extend your arm and gently pull back on your fingers to open your wrist. Switch hands after ten seconds.",
        duration: 20,
        color: "from-amber-400/20 to-orange-500/10"
    },
    {
        id: "seated-twist",
        name: "Seated Twist",
        desc: "Place your hand on the opposite knee and gently twist your torso.",
        instruction: "Place your opposite hand on your knee and gently rotate your spine. Look over your shoulder and breathe.",
        duration: 25,
        color: "from-rose-400/20 to-pink-500/10"
    }
]

function YogaFigure({ poseId }: { poseId: string }) {
    return (
        <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-2xl">
            <path d="M30 80 H70 M35 80 V100 M65 80 V100 M30 80 V50" stroke="currentColor" strokeWidth="2" fill="none" className="opacity-20" />
            <g fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <motion.path 
                    d="M50 50 L50 75" 
                    animate={poseId === "seated-cat-cow" ? { d: ["M50 50 Q55 62.5 50 75", "M50 50 Q45 62.5 50 75"] } : { d: "M50 50 L50 75" }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.g 
                    animate={
                        poseId === "neck-release" ? { rotate: [-20, 20], x: [-2, 2] } : 
                        poseId === "seated-cat-cow" ? { y: [-2, 2], rotate: [-10, 10] } :
                        poseId === "seated-twist" ? { rotate: [-15, 15] } : { rotate: 0 }
                    }
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ originX: "50px", originY: "50px" }}
                >
                    <circle cx="50" cy="40" r="8" />
                </motion.g>
                <motion.g>
                    <motion.path 
                        d="M50 55 L35 70" 
                        animate={
                            poseId === "shoulder-roll" ? { d: ["M50 55 L35 65", "M50 50 L35 70"] } :
                            poseId === "wrist-stretch" ? { d: "M50 55 L25 55 L20 50" } :
                            poseId === "seated-twist" ? { d: "M50 55 L70 75" } : { d: "M50 55 L35 70" }
                        }
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.path 
                        d="M50 55 L65 70" 
                        animate={
                            poseId === "shoulder-roll" ? { d: ["M50 55 L65 65", "M50 50 L65 70"] } :
                            poseId === "wrist-stretch" ? { d: "M50 55 L75 70" } :
                            poseId === "seated-twist" ? { d: "M50 55 L30 75" } : { d: "M50 55 L65 70" }
                        }
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                </motion.g>
                <path d="M50 75 L35 80 L35 100" />
                <path d="M50 75 L65 80 L65 100" />
            </g>
        </svg>
    )
}

export function YogaStretch({ onBack }: ToolProps) {
    const [currentPose, setCurrentPose] = useState(0)
    const [isPlaying, setIsPlaying] = useState(true) // Auto-play on mount
    const [isMuted, setIsMuted] = useState(false)
    const [timeLeft, setTimeLeft] = useState(poses[0].duration)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const initialSpeechRef = useRef(false)

    const speak = useCallback((text: string) => {
        if (typeof window === 'undefined' || isMuted) return
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 0.85
        utterance.pitch = 1.05
        window.speechSynthesis.speak(utterance)
    }, [isMuted])

    // Initial Guidance on Mount
    useEffect(() => {
        if (!initialSpeechRef.current) {
            speak(`Welcome to your Yoga Sanctuary. Let's begin with ${poses[0].name}. ${poses[0].instruction}`)
            initialSpeechRef.current = true
        }
    }, [speak])

    const nextPose = useCallback(() => {
        if (currentPose === poses.length - 1) {
            if (document.fullscreenElement) document.exitFullscreen()
            onBack()
            return
        }
        const nextIdx = currentPose + 1
        setCurrentPose(nextIdx)
        setTimeLeft(poses[nextIdx].duration)
        speak(`Now, ${poses[nextIdx].name}. ${poses[nextIdx].instruction}`)
    }, [currentPose, onBack, speak])

    const prevPose = useCallback(() => {
        const prevIdx = (currentPose - 1 + poses.length) % poses.length
        setCurrentPose(prevIdx)
        setTimeLeft(poses[prevIdx].duration)
        speak(`Returning to ${poses[prevIdx].name}.`)
    }, [currentPose, speak])

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (isPlaying && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
        } else if (isPlaying && timeLeft === 0) {
            nextPose()
        }
        return () => clearInterval(timer)
    }, [isPlaying, timeLeft, nextPose])

    useEffect(() => {
        const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement)
        document.addEventListener('fullscreenchange', onFullscreenChange)
        return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
    }, [])

    const isUnmutingRef = useRef(false)
    useEffect(() => {
        if (isMuted && typeof window !== 'undefined') {
            window.speechSynthesis.cancel()
            isUnmutingRef.current = true
        } else if (!isMuted && isUnmutingRef.current) {
            speak(`Voice guidance resumed. ${poses[currentPose].instruction}`)
            isUnmutingRef.current = false
        }
    }, [isMuted, currentPose, speak])

    const toggleFullscreen = () => {
        if (document.fullscreenElement) document.exitFullscreen()
        else {
            const el = document.getElementById('exercises-viewport')
            el?.requestFullscreen?.().catch(() => {})
        }
    }

    const pose = poses[currentPose]
    const progress = (1 - timeLeft / pose.duration) * 100

    return (
        <div 
            ref={containerRef}
            className={`flex flex-col items-center justify-center p-2 w-full h-full min-h-[500px] transition-all duration-1000 bg-gradient-to-br ${pose.color} ${isFullscreen ? 'p-12' : 'relative'}`}
        >
            {/* Header Controls */}
            <div className="w-full max-w-5xl flex justify-between items-center mb-6 px-6">
                <Button variant="ghost" onClick={() => { if (document.fullscreenElement) document.exitFullscreen(); onBack(); }} size="sm" className="rounded-xl h-8 hover:bg-muted/30 font-bold tracking-widest text-[9px] uppercase">
                    <ArrowLeft className="w-3 h-3 mr-1.5" /> EXIT
                </Button>
                
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)} className="h-8 w-8 rounded-full">
                        {isMuted ? <VolumeX className="w-4 h-4 opacity-40" /> : <Volume2 className="w-4 h-4 text-primary" />}
                    </Button>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/5 rounded-full border border-primary/10">
                        <Play className={`w-2.5 h-2.5 ${isPlaying ? 'animate-pulse text-primary' : ''}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{isPlaying ? 'Sanctuary Flowing' : 'Flow Paused'}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="h-8 w-8 rounded-full ml-1">
                        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    </Button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 w-full max-w-5xl flex-1 px-6">
                
                {/* Left: Animated Figure */}
                <div className="w-full lg:w-1/2 flex flex-col items-center justify-center relative scale-90 lg:scale-100">
                    <div className="w-64 h-64 lg:w-80 lg:h-80 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10 shadow-inner flex items-center justify-center relative">
                        <YogaFigure poseId={pose.id} />
                        
                        {/* Progress Ring */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle cx="50%" cy="50%" r="48%" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-10" />
                            <motion.circle 
                                cx="50%" cy="50%" r="48%" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="300" 
                                animate={{ strokeDashoffset: 300 - (progress / 100) * 300 }}
                                className="text-primary transition-all duration-1000"
                            />
                        </svg>
                    </div>
                    
                    {/* Floating Indicators */}
                    <div className="mt-8 flex gap-1.5">
                        {poses.map((_, i) => (
                            <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === currentPose ? 'w-10 bg-primary shadow-lg shadow-primary/40' : 'w-2 bg-primary/10'}`} />
                        ))}
                    </div>
                </div>

                {/* Right: Text & Active Controls */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-8 text-center lg:text-left">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pose.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">Sanctuary Step {currentPose + 1}</span>
                            <h2 className={`text-4xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none`}>{pose.name}</h2>
                            <p className="text-lg lg:text-xl font-medium opacity-60 leading-relaxed max-w-xl">{pose.desc}</p>
                            
                            <div className="flex items-center justify-center lg:justify-start gap-4">
                                <div className="text-5xl lg:text-7xl font-black tabular-nums tracking-tighter opacity-10">{timeLeft}s</div>
                                <div className="h-12 w-px bg-border/20 mx-2" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Remaining</span>
                                    <span className="text-sm font-bold">Follow the Voice</span>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                        <Button 
                            variant="outline" size="icon" onClick={prevPose}
                            className="w-14 h-14 rounded-full border-border/40 hover:bg-primary/5"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                        <Button 
                            onClick={() => setIsPlaying(!isPlaying)}
                            className={`w-20 h-20 rounded-full shadow-2xl transition-all duration-300 ${isPlaying ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20' : 'bg-primary shadow-primary/20'}`}
                        >
                            {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                        </Button>
                        <Button 
                            variant="outline" size="icon" onClick={nextPose}
                            className="w-14 h-14 rounded-full border-border/40 hover:bg-primary/5"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </Button>
                    </div>
                </div>
            </div>
            
            {/* Zen Overlay Text */}
            <div className="mt-8 py-6 opacity-5 flex flex-col items-center gap-1 pointer-events-none">
                <div className="w-16 h-px bg-foreground" />
                <span className="text-[10px] font-black uppercase tracking-[0.6em]">Absolute Stability</span>
            </div>
        </div>
    )
}
