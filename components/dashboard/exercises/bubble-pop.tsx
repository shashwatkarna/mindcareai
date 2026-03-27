"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw, Trophy, Sparkles } from "lucide-react"

interface ToolProps {
    onBack: () => void
}

interface Bubble {
    id: string
    key: string
    x: number
    y: number
    size: number
    color: string
    delay: number
    note: number // Frequency in Hz
    rotation: number
    offsetX: number
    offsetY: number
}

interface Fragment {
    id: string
    x: number
    y: number
    vx: number
    vy: number
    color: string
    size: number
    rotate: number
    shape: "circle" | "rect" | "strip"
}

interface ExplosionFlash {
    id: string
    x: number
    y: number
}

const colors = [
    "bg-sky-400/60 border-sky-300 shadow-sky-500/20",
    "bg-emerald-400/60 border-emerald-300 shadow-emerald-500/20",
    "bg-violet-400/60 border-violet-300 shadow-violet-500/20",
    "bg-amber-400/60 border-amber-300 shadow-amber-500/20",
    "bg-rose-400/60 border-rose-300 shadow-rose-500/20"
]

// Harmonious C-Major Scale + Octaves
const MUSICAL_SCALE = [
    261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25,
    587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50
]

const KEY_SET = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N"]

export function BubblePop({ onBack }: ToolProps) {
    const [bubbles, setBubbles] = useState<Bubble[]>([])
    const [fragments, setFragments] = useState<Fragment[]>([])
    const [flashes, setFlashes] = useState<ExplosionFlash[]>([])
    const [sequence, setSequence] = useState<string[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [totalPopped, setTotalPopped] = useState(0)
    const audioContextRef = useRef<AudioContext | null>(null)
    const currentRef = useRef({ bubbles, sequence, currentIndex })

    useEffect(() => { currentRef.current = { bubbles, sequence, currentIndex } }, [bubbles, sequence, currentIndex])

    useEffect(() => {
        setTotalPopped(parseInt(localStorage.getItem("mindcare_total_bubbles") || "0"))
    }, [])

    const initAudio = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        }
    }, [])

    const playNote = useCallback((freq: number) => {
        if (!audioContextRef.current) return
        const ctx = audioContextRef.current
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        
        // Attack-Decay envelope for "Chime" effect
        osc.type = "sine"
        osc.frequency.setValueAtTime(freq, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(freq * 0.9, ctx.currentTime + 0.3)

        gain.gain.setValueAtTime(0, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start()
        osc.stop(ctx.currentTime + 0.45)
    }, [])

    const createShatter = useCallback((x: number, y: number, color: string) => {
        const fid = `${Date.now()}`
        setFlashes(prev => [...prev, { id: fid, x, y }])
        setTimeout(() => setFlashes(prev => prev.filter(f => f.id !== fid)), 400)

        const newFragments: Fragment[] = Array.from({ length: 12 }).map((_, i) => ({
            id: `p-${Date.now()}-${i}`,
            x, y,
            vx: (Math.random() - 0.5) * 20,
            vy: (Math.random() - 0.5) * 20,
            color,
            size: Math.random() * 8 + 4,
            rotate: Math.random() * 360,
            shape: ["circle", "rect", "strip"][Math.floor(Math.random() * 3)] as any
        }))
        setFragments(prev => [...prev, ...newFragments])
        setTimeout(() => setFragments(prev => prev.filter(f => !newFragments.includes(f))), 800)
    }, [])

    const popBubble = useCallback((bubble: Bubble) => {
        initAudio()
        playNote(bubble.note)
        createShatter(bubble.x, bubble.y, bubble.color)
        setBubbles(prev => prev.filter(b => b.id !== bubble.id))
        setCurrentIndex(prev => prev + 1)
        setTotalPopped(curr => {
            const n = curr + 1
            localStorage.setItem("mindcare_total_bubbles", n.toString())
            return n
        })
        if (navigator.vibrate) navigator.vibrate(12)
    }, [initAudio, playNote, createShatter])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toUpperCase()
            const { bubbles, sequence, currentIndex } = currentRef.current
            const target = bubbles.find(b => b.key === key)
            if (target?.id === sequence[currentIndex]) popBubble(target)
            else if (target && navigator.vibrate) navigator.vibrate([10, 20])
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [popBubble])

    const generateGame = useCallback(() => {
        const count = 15
        const keys = [...KEY_SET].sort(() => Math.random() - 0.5).slice(0, count)
        const newBubbles = keys.map((k, i) => ({
            id: `b-${i}-${Date.now()}`,
            key: k,
            x: Math.random() * 74 + 13,
            y: Math.random() * 64 + 18,
            size: 52,
            color: colors[Math.floor(Math.random() * colors.length)],
            delay: i * 0.02,
            note: MUSICAL_SCALE[i % MUSICAL_SCALE.length],
            rotation: (Math.random() - 0.5) * 30,
            offsetX: (Math.random() - 0.5) * 8,
            offsetY: (Math.random() - 0.5) * 8
        }))
        setBubbles(newBubbles)
        setSequence([...newBubbles].sort(() => Math.random() - 0.5).map(b => b.id))
        setCurrentIndex(0)
    }, [])

    useEffect(() => { generateGame() }, [generateGame])

    return (
        <div className="flex flex-col items-center justify-center p-0.5 w-full max-w-4xl mx-auto h-full min-h-[400px]">
             {/* Extreme Compact Header */}
            <div className="w-full flex justify-between items-center mb-2 px-6">
                <Button variant="ghost" onClick={onBack} size="sm" className="rounded-xl h-6 px-2 hover:bg-muted/30 font-bold tracking-tighter text-[8px]">
                    <ArrowLeft className="w-2.5 h-2.5 mr-1" /> EXIT
                </Button>
                <div className="flex items-center gap-1.5 px-3 py-0.5 bg-primary/5 rounded-full border border-primary/10">
                    <Trophy className="w-2.5 h-2.5 text-primary opacity-40" />
                    <span className="text-[10px] font-black">{totalPopped}</span>
                </div>
            </div>

            <div className="text-center mb-4">
                <h2 className="text-2xl lg:text-3xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-sky-400 leading-none">Discovery Harmony</h2>
            </div>

            {/* Zero-Scroll Optimized Box */}
            <div className="relative w-full max-w-xl h-[260px] lg:h-[280px] bg-card/5 backdrop-blur-3xl border border-border/20 rounded-[48px] overflow-hidden shadow-2xl group cursor-none">
                <AnimatePresence>
                    {/* Flashes */}
                    {flashes.map(f => (
                        <motion.div
                            key={f.id}
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: 4, opacity: 0 }}
                            className="absolute w-20 h-20 bg-white/30 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ left: `${f.x}%`, top: `${f.y}%` }}
                        />
                    ))}

                    {/* Shatter Fragments */}
                    {fragments.map(p => (
                        <motion.div
                            key={p.id}
                            initial={{ x: `${p.x}%`, y: `${p.y}%`, scale: 1.5, opacity: 1, rotate: p.rotate }}
                            animate={{ 
                                x: `${p.x + p.vx}%`, 
                                y: `${p.y + p.vy}%`, 
                                scale: 0, 
                                opacity: 0, 
                                rotate: p.rotate * 2 
                            }}
                            className={`absolute z-30 ${p.color} -translate-x-1/2 -translate-y-1/2 ${p.shape === 'circle' ? 'rounded-full' : p.shape === 'rect' ? 'rounded-sm' : 'rounded-full scale-x-[0.2]'}`}
                            style={{ width: p.size, height: p.size }}
                        />
                    ))}

                    {/* Bubbles */}
                    {bubbles.map(bubble => (
                        <motion.button
                            key={bubble.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ 
                                scale: 1, 
                                opacity: 1, 
                                left: `${bubble.x}%`, 
                                top: `${bubble.y}%`, 
                                rotate: bubble.rotation 
                            }}
                            exit={{ scale: 1.8, opacity: 0, filter: "brightness(2) contrast(2) blur(10px)" }}
                            whileTap={{ scale: 0.9, rotate: bubble.rotation * 1.5 }}
                            className={`absolute rounded-full border-2 border-white/40 shadow-xl flex items-center justify-center -translate-x-1/2 -translate-y-1/2 ${bubble.color} transition-all duration-300 hover:border-white`}
                            style={{ width: bubble.size, height: bubble.size }}
                        >
                            <span className="text-xl font-black text-white/90 tracking-tighter select-none drop-shadow-md" style={{ transform: `translate(${bubble.offsetX}px, ${bubble.offsetY}px)` }}>
                                {bubble.key}
                            </span>
                            {/* Inner Shine */}
                            <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 bg-white/40 rounded-full blur-[1px]" />
                        </motion.button>
                    ))}
                </AnimatePresence>

                {bubbles.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/50 backdrop-blur-3xl">
                        <Sparkles className="w-12 h-12 text-primary animate-pulse" />
                        <h3 className="text-4xl font-black italic tracking-tighter uppercase">Melody Complete</h3>
                        <Button onClick={generateGame} className="rounded-2xl h-12 px-10 gap-2 shadow-2xl">REPLAY</Button>
                    </motion.div>
                )}
            </div>

            {/* Tightened Dots */}
            <div className="mt-5 flex gap-1 items-center bg-muted/10 px-4 py-1.5 rounded-full border border-border/10">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/40 mr-2">Sequence Mastery</span>
                {[...Array(15)].map((_, i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i < currentIndex ? "w-4 bg-primary" : "w-1.5 bg-primary/20"}`} />
                ))}
            </div>
        </div>
    )
}
