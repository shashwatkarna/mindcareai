"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles, X, Archive, ArrowLeft } from "lucide-react"

interface ToolProps {
    onBack: () => void
}

export function WorryJar({ onBack }: ToolProps) {
    const [worry, setWorry] = useState("")
    const [worries, setWorries] = useState<string[]>([])
    const [isSealing, setIsSealing] = useState(false)
    const [isReleased, setIsReleased] = useState(false)

    // Higher capacity with scaling
    const maxWorries = 24
    const scaleFactor = worries.length > 8 ? Math.max(0.6, 1 - (worries.length - 8) * 0.05) : 1

    const playZenSound = (type: 'seal' | 'release') => {
        try {
            const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
            const ctx = new AudioContextClass();
            const masterGain = ctx.createGain();
            masterGain.connect(ctx.destination);

            if (type === 'seal') {
                // Tactical, heavy "Lock" sound
                const osc = ctx.createOscillator();
                const click = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(150, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);
                
                click.type = 'square';
                click.frequency.setValueAtTime(800, ctx.currentTime);
                click.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.05);

                gain.gain.setValueAtTime(0.5, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

                osc.connect(gain);
                click.connect(gain);
                gain.connect(masterGain);

                osc.start();
                click.start();
                osc.stop(ctx.currentTime + 0.2);
                click.stop(ctx.currentTime + 0.2);
            } else {
                // Celestial, rising "Swish"
                const filter = ctx.createBiquadFilter();
                filter.type = 'highpass';
                filter.frequency.setValueAtTime(1000, ctx.currentTime);
                filter.frequency.exponentialRampToValueAtTime(8000, ctx.currentTime + 2);
                
                const noise = ctx.createOscillator();
                const noiseGain = ctx.createGain();
                
                noise.type = 'sawtooth';
                noise.frequency.setValueAtTime(100, ctx.currentTime);
                noise.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 2.5);

                noiseGain.gain.setValueAtTime(0.3, ctx.currentTime);
                noiseGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.5);

                noise.connect(filter);
                filter.connect(noiseGain);
                noiseGain.connect(masterGain);

                noise.start();
                noise.stop(ctx.currentTime + 2.6);
            }
        } catch (e) {
            console.warn("Audio synthesis not supported or blocked", e);
        }
    }

    const addWorry = (e: React.FormEvent) => {
        e.preventDefault()
        if (worry.trim() && worries.length < maxWorries) {
            setWorries([...worries, worry])
            setWorry("")
        }
    }

    const releaseWorries = () => {
        setIsSealing(true)
        playZenSound('seal')
        
        setTimeout(() => {
            setIsReleased(true)
            playZenSound('release')
            
            setTimeout(() => {
                setWorries([])
                setIsSealing(false)
                setIsReleased(false)
            }, 3000)
        }, 800)
    }

    const removeWorry = (index: number) => {
        setWorries(worries.filter((_, i) => i !== index))
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-center p-2 w-full h-full min-h-[420px] max-w-5xl mx-auto overflow-visible">
            
            {/* Left: Premium Jar Area */}
            <div className="relative w-full max-w-[280px] md:max-w-sm flex flex-col items-center justify-center h-[350px]">
                <motion.div
                    animate={{ 
                        y: isReleased ? -400 : 0, 
                        opacity: isReleased ? 0 : 1,
                        scale: isReleased ? 0.8 : 1,
                        rotate: isReleased ? 8 : 0
                    }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                    className="relative w-48 h-64 md:w-60 md:h-80"
                >
                    {/* Glass Jar Body */}
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl border-2 border-white/40 rounded-[60px] rounded-t-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden z-10 flex flex-col items-center p-4 pt-10">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
                        
                        <div className="flex flex-wrap gap-1.5 items-start justify-center overflow-y-auto scrollbar-hide w-full h-full pb-10">
                            <AnimatePresence>
                                {worries.map((w, i) => (
                                    <motion.div
                                        key={`${w}-${i}`}
                                        initial={{ scale: 0, y: -100, rotate: Math.random() * 40 - 20 }}
                                        animate={{ 
                                            scale: scaleFactor, 
                                            y: 0,
                                            rotate: (i % 2 === 0 ? 5 : -5) // Tidy stacking
                                        }}
                                        transition={{ 
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 20
                                        }}
                                        exit={{ scale: 0, opacity: 0, filter: "blur(8px)" }}
                                        className="bg-[#fff9c4] text-[#827717] px-2 py-1 rounded-md shadow-sm text-[10px] font-bold border border-[#fbc02d]/20 max-w-[90px] truncate cursor-pointer hover:bg-red-50 hover:text-red-500 transition-colors"
                                        style={{ 
                                            transform: `scale(${scaleFactor})`,
                                            zIndex: i 
                                        }}
                                        onClick={() => removeWorry(i)}
                                    >
                                        {w}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {worries.length === 0 && !isSealing && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.2 }}
                                    className="h-full flex flex-col items-center justify-center text-center px-4"
                                >
                                    <Archive className="w-8 h-8 mb-2" />
                                    <p className="text-[9px] font-black uppercase tracking-widest">Jar is currently empty</p>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* The Lid */}
                    <motion.div
                        animate={{ 
                            y: isSealing ? 0 : -60,
                            opacity: isSealing ? 1 : 0.6
                        }}
                        transition={{ duration: 0.8, ease: "backOut" }}
                        className="absolute -top-4 left-1/2 -translate-x-1/2 w-40 md:w-52 h-10 bg-gradient-to-b from-slate-200 to-slate-400 rounded-t-3xl rounded-b-xl z-30 shadow-lg border-b border-slate-500/30 flex items-center justify-center"
                    >
                         <div className="w-12 h-1 bg-slate-500/20 rounded-full" />
                    </motion.div>

                    {/* Ground Shadow */}
                    <motion.div 
                        animate={{ scale: isReleased ? 0.2 : 1, opacity: isReleased ? 0 : 0.2 }}
                        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-40 h-3 bg-black/20 rounded-full blur-lg -z-0" 
                    />
                </motion.div>
            </div>

            {/* Right: Controls Area */}
            <div className="flex flex-col gap-6 w-full max-w-sm lg:max-w-xs text-left">
                {!isSealing ? (
                    <>
                        <div className="space-y-2">
                             <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 rounded-full border border-primary/20 text-primary">
                                <Sparkles className="w-3 h-3" />
                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Safe Release</span>
                            </div>
                            <h2 className="text-3xl font-black tracking-tight text-foreground uppercase leading-none">The Worry Jar</h2>
                            <p className="text-muted-foreground text-[11px] font-medium leading-relaxed">
                                Don&apos;t keep it all inside. Type your thoughts and put them in the glass. We&apos;ll seal it and let it drift into the universe together.
                            </p>
                        </div>

                        <form onSubmit={addWorry} className="space-y-3">
                            <div className="relative group">
                                <Input
                                    placeholder="What's weighing on you?"
                                    value={worry}
                                    onChange={(e) => setWorry(e.target.value)}
                                    className="h-12 bg-card/50 backdrop-blur-sm rounded-2xl border-border/50 focus-visible:ring-primary/20 text-sm px-5 pr-12 transition-all group-focus-within:border-primary/40 shadow-sm"
                                    disabled={worries.length >= maxWorries}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black opacity-30 select-none">
                                    {worries.length}/{maxWorries}
                                </div>
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full rounded-2xl h-12 font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/10 transition-transform active:scale-95"
                                disabled={!worry.trim() || worries.length >= maxWorries}
                            >
                                Put it in the Jar
                            </Button>
                        </form>
                        
                        <AnimatePresence>
                            {worries.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                >
                                    <Button
                                        className="w-full rounded-2xl h-14 gap-3 bg-foreground text-background hover:bg-foreground/90 shadow-2xl group transition-all"
                                        onClick={releaseWorries}
                                    >
                                        <div className="p-1.5 rounded-lg bg-background/10 group-hover:rotate-12 transition-transform">
                                            <Archive className="w-4 h-4" />
                                        </div>
                                        <span className="font-black uppercase tracking-widest text-xs">Confirm & Release</span>
                                    </Button>
                                    <p className="text-center text-[9px] text-muted-foreground mt-3 font-bold uppercase tracking-tighter opacity-50 italic">
                                        Once sealed, these thoughts are gone.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-8 bg-primary/5 rounded-[40px] border border-primary/20 text-center space-y-4"
                    >
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                             <Sparkles className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tight text-primary leading-none">
                             {isReleased ? "Safe Journey" : "Sealing Now"}
                        </h3>
                        <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                            {isReleased 
                                ? "Your worries have been released into the vast universe. Take a deep breath." 
                                : "We're tucking your thoughts away so you don't have to carry them."}
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
