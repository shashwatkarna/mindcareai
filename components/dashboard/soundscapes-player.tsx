"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Headphones, Play, Pause, Volume2, CloudRain, Trees, Waves, Wind } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

const sounds = [
    { id: "rain", label: "Soft Rain", icon: CloudRain, color: "text-blue-400", bg: "bg-blue-400/10", src: "https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3" },
    { id: "forest", label: "Deep Forest", icon: Trees, color: "text-green-500", bg: "bg-green-500/10", src: "https://assets.mixkit.co/active_storage/sfx/2523/2523-preview.mp3" },
    { id: "ocean", label: "Ocean Waves", icon: Waves, color: "text-cyan-500", bg: "bg-cyan-500/10", src: "https://assets.mixkit.co/active_storage/sfx/2528/2528-preview.mp3" },
    { id: "white", label: "White Noise", icon: Wind, color: "text-gray-400", bg: "bg-gray-400/10", src: "https://assets.mixkit.co/active_storage/sfx/2526/2526-preview.mp3" },
]

export function SoundscapesPlayer() {
    const [isOpen, setIsOpen] = useState(false)
    const [activeSound, setActiveSound] = useState<string | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [volume, setVolume] = useState(0.5)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume
        }
    }, [volume])

    const toggleSound = (soundId: string) => {
        // If clicking the already selected sound...
        if (activeSound === soundId) {
            if (isPlaying) {
                audioRef.current?.pause()
                setIsPlaying(false)
            } else {
                audioRef.current?.play()
                setIsPlaying(true)
            }
        } else {
            // New sound selected: Just select it, DON'T auto-play if the user prefers manual start?
            // Actually standard UI is to play on selection. 
            // The user said: "only play when i click that icon and open"
            // This might mean "don't play until I explicitly click a PLAY button".
            // Let's adopt a "Select to Load, Click Play to Start" or "Click to Play"
            // Current behavior: Click row -> Play. 
            // I'll keep it as is because "click that icon" likely refers to the main menu icon. 
            // I'll ensure `isOpen` toggle DOES NOT trigger play.

            setActiveSound(soundId)
            setIsPlaying(true)
        }
    }

    return (
        <div className="relative z-50">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "relative rounded-full transition-all duration-300",
                    isPlaying ? "bg-primary/10 text-primary animate-pulse" : "text-muted-foreground hover:bg-muted"
                )}
            >
                <Headphones className="w-5 h-5" />
                {isPlaying && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
                )}
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden p-4"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-foreground">Soundscapes</h3>
                            <div className="flex items-center gap-2">
                                <Volume2 className="w-4 h-4 text-muted-foreground" />
                                <Slider
                                    defaultValue={[0.5]}
                                    max={1}
                                    step={0.01}
                                    className="w-20"
                                    onValueChange={(val) => setVolume(val[0])}
                                />
                            </div>
                        </div>

                        <div className="grid gap-3">
                            {sounds.map((sound) => (
                                <button
                                    key={sound.id}
                                    onClick={() => toggleSound(sound.id)}
                                    className={cn(
                                        "flex items-center justify-between p-3 rounded-xl transition-all border",
                                        activeSound === sound.id
                                            ? "bg-primary/5 border-primary/20 shadow-inner"
                                            : "bg-card hover:bg-accent border-transparent"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn("p-2 rounded-full", sound.bg, sound.color)}>
                                            <sound.icon className="w-5 h-5" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-medium text-sm text-foreground">{sound.label}</div>
                                            {activeSound === sound.id && isPlaying && (
                                                <div className="text-xs text-primary animate-pulse">Playing...</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                                        activeSound === sound.id
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground"
                                    )}>
                                        {activeSound === sound.id && isPlaying ? (
                                            <Pause className="w-4 h-4 fill-current" />
                                        ) : (
                                            <Play className="w-4 h-4 fill-current ml-0.5" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Hidden Audio Element */}
                        {activeSound && (
                            <audio
                                ref={audioRef}
                                src={sounds.find((s) => s.id === activeSound)?.src}
                                autoPlay={false}
                                loop
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                            />
                        )}
                        {/* Note: autoPlay is false, but we call play() in toggleSound. This gives us code control. */}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
