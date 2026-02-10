"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, CloudRain, Trees, Waves, Wind, ArrowLeft } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

const sounds = [
    {
        id: "rain",
        label: "Soft Rain",
        icon: CloudRain,
        color: "text-blue-400",
        bg: "bg-slate-900",
        gradient: "from-slate-900 to-blue-950",
        src: "https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3"
    },
    {
        id: "forest",
        label: "Deep Forest",
        icon: Trees,
        color: "text-green-400",
        bg: "bg-green-950",
        gradient: "from-green-900 to-emerald-950",
        src: "https://assets.mixkit.co/active_storage/sfx/2523/2523-preview.mp3"
    },
    {
        id: "ocean",
        label: "Ocean Waves",
        icon: Waves,
        color: "text-cyan-400",
        bg: "bg-cyan-950",
        gradient: "from-cyan-900 to-blue-900",
        src: "https://assets.mixkit.co/active_storage/sfx/2528/2528-preview.mp3"
    },
    {
        id: "white",
        label: "White Noise",
        icon: Wind,
        color: "text-purple-400",
        bg: "bg-purple-950",
        gradient: "from-purple-900 to-slate-900",
        src: "https://assets.mixkit.co/active_storage/sfx/2526/2526-preview.mp3"
    },
]

// --- Animation Components ---

const RainAnimation = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 100 }).map((_, i) => (
            <motion.div
                key={i}
                initial={{ y: -20, x: Math.random() * 100 + "%" }}
                animate={{ y: "120vh" }}
                transition={{
                    duration: 0.8 + Math.random() * 0.5,
                    repeat: Infinity,
                    ease: "linear",
                    delay: Math.random() * 2
                }}
                className="absolute w-[1px] bg-blue-400/30"
                style={{ height: Math.random() * 20 + 10 + "px" }}
            />
        ))}
    </div>
)

const ForestAnimation = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
                key={i}
                initial={{
                    x: Math.random() * 100 + "%",
                    y: Math.random() * 100 + "%",
                    opacity: 0
                }}
                animate={{
                    y: [null, Math.random() * -50],
                    x: [null, Math.random() * 20 - 10],
                    opacity: [0, 0.8, 0]
                }}
                transition={{
                    duration: 4 + Math.random() * 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: Math.random() * 5
                }}
                className="absolute w-1 h-1 bg-green-300/40 rounded-full blur-[1px]"
            />
        ))}
    </div>
)

const OceanAnimation = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none flex flex-col justify-end">
        {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
                key={i}
                animate={{
                    y: [0, -10, 0],
                    scale: [1, 1.05, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                    duration: 5 + i * 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i
                }}
                className="w-full h-64 bg-cyan-500/10 blur-3xl -mb-10 rounded-[50%]"
                style={{ transform: `scaleY(${1 + i * 0.2})` }}
            />
        ))}
    </div>
)

const WindAnimation = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
                key={i}
                initial={{ x: "-10%", y: Math.random() * 100 + "%", opacity: 0 }}
                animate={{ x: "110%", opacity: [0, 0.2, 0] }}
                transition={{
                    duration: 3 + Math.random() * 4,
                    repeat: Infinity,
                    ease: "linear",
                    delay: Math.random() * 3
                }}
                className="absolute h-px w-32 bg-purple-300/20 blur-sm"
            />
        ))}
    </div>
)

interface SoundscapesFocusProps {
    onBack: () => void
}

export function SoundscapesFocus({ onBack }: SoundscapesFocusProps) {
    const [activeSound, setActiveSound] = useState<string>("rain")
    const [isPlaying, setIsPlaying] = useState(false)
    const [volume, setVolume] = useState(0.5)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const currentSound = sounds.find(s => s.id === activeSound) || sounds[0]

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume
        }
    }, [volume])

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current?.pause()
            setIsPlaying(false)
        } else {
            audioRef.current?.play()
            setIsPlaying(true)
        }
    }

    const changeSound = (id: string) => {
        setActiveSound(id)
        setIsPlaying(true)
    }

    return (
        <div className={cn("relative w-full h-[600px] rounded-3xl overflow-hidden flex flex-col transition-colors duration-1000", currentSound.bg)}>
            {/* Ambient Animated Background */}
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-80 transition-colors duration-1000", currentSound.gradient)} />

            <AnimatePresence mode="wait">
                {activeSound === "rain" && <motion.div key="rain" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><RainAnimation /></motion.div>}
                {activeSound === "forest" && <motion.div key="forest" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><ForestAnimation /></motion.div>}
                {activeSound === "ocean" && <motion.div key="ocean" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><OceanAnimation /></motion.div>}
                {activeSound === "white" && <motion.div key="white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><WindAnimation /></motion.div>}
            </AnimatePresence>

            {/* Content */}
            <div className="relative z-10 flex-1 flex flex-col p-8">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="self-start text-white/70 hover:text-white hover:bg-white/10"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Library
                </Button>

                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
                    <motion.div
                        key={activeSound}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                    >
                        <div className={cn("w-40 h-40 rounded-full flex items-center justify-center mb-6 shadow-[0_0_100px_rgba(255,255,255,0.1)] transition-all duration-1000", currentSound.color.replace('text-', 'bg-').replace('400', '500/20'))}>
                            <currentSound.icon className={cn("w-20 h-20 drop-shadow-lg", currentSound.color)} />
                        </div>
                        {isPlaying && (
                            <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" />
                        )}
                    </motion.div>

                    <div className="space-y-2">
                        <h2 className="text-4xl font-bold text-white tracking-tight">{currentSound.label}</h2>
                        <p className="text-white/60">Immersive Sound Experience</p>
                    </div>

                    <div className="flex items-center gap-6 w-full max-w-sm">
                        <Volume2 className="text-white/60 w-5 h-5" />
                        <Slider
                            value={[volume]}
                            max={1}
                            step={0.01}
                            onValueChange={(val) => setVolume(val[0])}
                            className="flex-1"
                        />
                    </div>

                    <Button
                        onClick={togglePlay}
                        className="h-20 w-20 rounded-full bg-white text-black hover:bg-white/90 hover:scale-105 transition-all shadow-xl flex items-center justify-center p-0"
                    >
                        {isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
                    </Button>
                </div>

                {/* Sound Selector */}
                <div className="flex justify-center gap-4 mt-8 overflow-x-auto pb-2 no-scrollbar">
                    {sounds.map(sound => (
                        <button
                            key={sound.id}
                            onClick={() => changeSound(sound.id)}
                            className={cn(
                                "flex flex-col items-center gap-2 p-3 rounded-2xl transition-all w-24 shrink-0",
                                activeSound === sound.id ? "bg-white/20 backdrop-blur-md ring-1 ring-white/50" : "hover:bg-white/10 opacity-70 hover:opacity-100"
                            )}
                        >
                            <sound.icon className={cn("w-6 h-6", sound.color)} />
                            <span className="text-xs font-medium text-white/90 truncate w-full text-center">{sound.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <audio
                ref={audioRef}
                src={currentSound.src}
                autoPlay={isPlaying}
                loop
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />
        </div>
    )
}

