"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Heart, ArrowLeft, Copy, Check, Sparkles, Share2, Image, X, Download } from "lucide-react"

const affirmations = [
    "I am worthy of love and happiness.",
    "My mind is calm, and my body is relaxed.",
    "I am in charge of how I feel and today I am choosing happiness.",
    "I am enough just as I am.",
    "I possess the qualities needed to be extremely successful.",
    "My ability to conquer my challenges is limitless; my potential to succeed is infinite.",
    "I forgive myself and set myself free.",
    "I accept myself unconditionally.",
    "I am strong, confident, and capable.",
    "I am resilient, strong, and brave.",
    "I choose to be kind to myself today.",
    "I am proud of how far I've come."
]

interface AffirmationsProps {
    onBack: () => void
}

export function DailyAffirmations({ onBack }: AffirmationsProps) {
    const getRotatingIndex = useCallback(() => {
        const now = new Date()
        const hoursSinceEpoch = Math.floor(now.getTime() / (1000 * 60 * 60 * 3))
        return hoursSinceEpoch % affirmations.length
    }, [])

    const initialIndex = useMemo(() => getRotatingIndex(), [getRotatingIndex])
    const [index, setIndex] = useState(initialIndex)
    const [isLiked, setIsLiked] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const [isShareModalOpen, setIsShareModalOpen] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)

    useEffect(() => {
        const checkRotation = setInterval(() => {
            const newIndex = getRotatingIndex()
            if (newIndex !== index) {
                setIndex(newIndex)
                setIsLiked(false)
                setIsCopied(false)
                setIsShareModalOpen(false)
            }
        }, 10000) // 10s check - light enough
        return () => clearInterval(checkRotation)
    }, [index, getRotatingIndex])

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(affirmations[index])
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy!", err)
        }
    }

    const shareToWhatsApp = () => {
        const text = `Daily affirmation from MindCare AI: "${affirmations[index]}"\n\nBegin your mental wellness journey today at https://itsmindcareai.vercel.app`
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank")
    }

    const shareToTwitter = () => {
        const text = `Daily affirmation from MindCare AI: "${affirmations[index]}"\n\nBegin your mental wellness journey today at https://itsmindcareai.vercel.app`
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank")
    }

    const downloadAsImage = async () => {
        setIsGenerating(true)
        try {
            const html2canvas = (await import("html2canvas")).default
            const element = document.getElementById("export-affirmation-card")
            if (!element) return
            
            element.style.display = "flex"
            
            const canvas = await html2canvas(element, {
                useCORS: true,
                scale: 2, // High resolution crisp export
                backgroundColor: null,
            })
            
            element.style.display = "none"
            
            const image = canvas.toDataURL("image/png")
            const link = document.createElement("a")
            link.href = image
            link.download = `mindcare-affirmation-${index + 1}.png`
            link.click()
        } catch (error) {
            console.error("Error generating image:", error)
        } finally {
            setIsGenerating(false)
        }
    }

    const shareNative = async () => {
        setIsGenerating(true)
        const shareText = `Daily affirmation from MindCare AI: "${affirmations[index]}"\n\nBegin your mental wellness journey today at https://itsmindcareai.vercel.app`
        
        try {
            const html2canvas = (await import("html2canvas")).default
            const element = document.getElementById("export-affirmation-card")
            if (!element) return
            
            element.style.display = "flex"
            const canvas = await html2canvas(element, {
                useCORS: true,
                scale: 1.5,
                backgroundColor: null,
            })
            element.style.display = "none"
            
            canvas.toBlob(async (blob) => {
                if (!blob) {
                    setIsGenerating(false)
                    return
                }
                const file = new File([blob], `mindcare-affirmation.png`, { type: "image/png" })
                
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({
                            files: [file],
                            title: "MindCare AI Affirmation",
                            text: shareText,
                        })
                    } catch (err) {
                        // Fail fallback or user cancel
                        if (navigator.share) {
                            await navigator.share({
                                title: "MindCare AI Affirmation",
                                text: shareText,
                                url: "https://itsmindcareai.vercel.app"
                            })
                        }
                    }
                } else if (navigator.share) {
                    await navigator.share({
                        title: "MindCare AI Affirmation",
                        text: shareText,
                        url: "https://itsmindcareai.vercel.app"
                    })
                } else {
                    await navigator.clipboard.writeText(shareText)
                    alert("Sharing is not supported on this browser. Quote copied to clipboard!")
                }
                setIsGenerating(false)
            }, "image/png")
        } catch (error) {
            console.error("Error sharing image:", error)
            setIsGenerating(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center p-2 w-full max-w-4xl mx-auto h-full min-h-[400px]">
            {/* Header */}
            <div className="w-full flex justify-between items-center mb-4 px-2">
                <Button variant="ghost" onClick={onBack} size="sm" className="rounded-xl px-3 hover:bg-muted/50 transition-all font-bold uppercase tracking-widest text-[9px]">
                    <ArrowLeft className="w-3 h-3 mr-1.5" /> Back
                </Button>
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 bg-primary/30 rounded-full" />
                   <span className="text-[9px] font-black uppercase tracking-widest opacity-30">Sanctuary Boost</span>
                </div>
            </div>

            {/* Title */}
            <div className="text-center mb-6 space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 transition-colors">
                    <Sparkles className="w-3 h-3 text-primary" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary">Live Affirmation</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 italic">
                    Daily Presence
                </h2>
            </div>

            {/* Optimized Card - Lighter effects to fix lag */}
            <div className="relative group w-full max-w-xl px-4">
                <div className="relative aspect-video lg:aspect-[2.5/1] bg-card/60 backdrop-blur-xl border border-border/40 rounded-[32px] flex items-center justify-center p-8 overflow-hidden shadow-xl">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-[40px] -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-pink-500/5 rounded-full blur-[60px] translate-x-1/2 translate-y-1/2" />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="relative z-10 text-center"
                        >
                            <p className="text-xl md:text-2xl lg:text-3xl font-black italic tracking-tight text-foreground/90 leading-tight select-none px-6">
                                &quot;{affirmations[index]}&quot;
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Interaction Pill */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-1 p-1 bg-background/95 backdrop-blur-md rounded-2xl border border-border shadow-lg z-20">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setIsLiked(!isLiked)}
                        className={`size-9 rounded-xl transition-all duration-200 ${isLiked ? 'bg-pink-500 text-white shadow-md' : 'hover:bg-pink-500/10 text-pink-500/60'}`}
                    >
                        <motion.div animate={isLiked ? { scale: [1, 1.25, 1] } : {}}>
                            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                        </motion.div>
                    </Button>

                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={copyToClipboard}
                        className={`size-9 rounded-xl transition-all duration-200 ${isCopied ? 'bg-emerald-500 text-white shadow-md' : 'hover:bg-indigo-500/10 text-indigo-500/60'}`}
                    >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </Button>

                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setIsShareModalOpen(true)}
                        className={`size-9 rounded-xl transition-all duration-200 ${isShareModalOpen ? 'bg-primary text-white shadow-md' : 'hover:bg-indigo-500/10 text-indigo-500/60'}`}
                    >
                        <Share2 className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </div>

            {/* Share Modal Dialog */}
            <AnimatePresence>
                {isShareModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsShareModalOpen(false)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-md"
                        />
                        
                        {/* Modal Container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 350 }}
                            className="bg-card border border-border rounded-[32px] shadow-2xl p-6 md:p-8 w-full max-w-2xl flex flex-col md:flex-row gap-6 relative z-10 overflow-hidden"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setIsShareModalOpen(false)}
                                className="absolute right-6 top-6 text-muted-foreground hover:text-foreground p-1.5 hover:bg-muted/50 rounded-full transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* Left: Card Preview */}
                            <div className="flex flex-col items-center justify-center flex-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Preview Status Card</span>
                                
                                <div 
                                    className="w-full max-w-[240px] aspect-[9/16] rounded-2xl flex flex-col justify-between p-6 shadow-2xl relative overflow-hidden text-white"
                                    style={{
                                        background: 'linear-gradient(135deg, #03001e 0%, #7303c0 50%, #ec38bc 100%)'
                                    }}
                                >
                                    <div className="absolute inset-0 bg-black/30 z-0" />
                                    
                                    {/* Header */}
                                    <div className="flex items-center gap-2.5 z-10 text-left">
                                        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
                                            <img src="/logo.png" className="w-5 h-5 object-contain" alt="Logo" />
                                        </div>
                                        <div>
                                            <h5 className="text-[10px] font-black tracking-tight text-white leading-none">MindCare AI</h5>
                                            <p className="text-[8px] text-white/60 tracking-wider">DAILY PRESENCE</p>
                                        </div>
                                    </div>
                                    
                                    {/* Quote */}
                                    <div className="flex-1 flex items-center justify-center z-10 text-center py-4">
                                        <p className="text-sm font-extrabold italic leading-relaxed text-white drop-shadow-md">
                                            &quot;{affirmations[index]}&quot;
                                        </p>
                                    </div>
                                    
                                    {/* Footer */}
                                    <div className="flex justify-between items-end border-t border-white/10 pt-3 z-10 text-[8px] text-white/50">
                                        <span>Your Safe Space</span>
                                        <span className="font-semibold text-white">itsmindcareai.vercel.app</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Actions Container */}
                            <div className="flex flex-col justify-center flex-1 space-y-4">
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tight text-foreground leading-none">Share Affirmation</h3>
                                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                                        Spread positive energy. Share the text or download the vertical card styled perfectly for your status or story.
                                    </p>
                                </div>

                                <div className="space-y-2.5 pt-2">
                                    {/* Save to Device */}
                                    <Button 
                                        onClick={downloadAsImage}
                                        disabled={isGenerating}
                                        className="w-full h-11 rounded-xl bg-primary text-white hover:bg-primary/90 font-bold uppercase tracking-wider text-xs gap-2 shadow-lg shadow-primary/10 transition-transform active:scale-95 cursor-pointer"
                                    >
                                        <Download className="w-4 h-4" />
                                        {isGenerating ? "Generating..." : "Save Image to Device"}
                                    </Button>

                                    {/* Native Share */}
                                    <Button 
                                        variant="outline"
                                        onClick={shareNative}
                                        disabled={isGenerating}
                                        className="w-full h-11 rounded-xl border-border/60 hover:bg-muted/50 font-bold uppercase tracking-wider text-xs gap-2 transition-all cursor-pointer"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        Share Card to Any App
                                    </Button>

                                    {/* Dividers */}
                                    <div className="flex items-center gap-2 my-2">
                                        <div className="h-px bg-border/50 flex-1" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Text Share</span>
                                        <div className="h-px bg-border/50 flex-1" />
                                    </div>

                                    {/* Direct links */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button 
                                            variant="outline"
                                            onClick={shareToWhatsApp}
                                            className="h-10 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-500 font-bold uppercase tracking-wider text-[10px] gap-2 border-border/60 transition-all cursor-pointer"
                                        >
                                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                            WhatsApp
                                        </Button>
                                        <Button 
                                            variant="outline"
                                            onClick={shareToTwitter}
                                            className="h-10 rounded-xl hover:bg-sky-500/10 hover:text-sky-500 font-bold uppercase tracking-wider text-[10px] gap-2 border-border/60 transition-all cursor-pointer"
                                        >
                                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                            </svg>
                                            Twitter / X
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Hidden export template for html2canvas - perfect 1080x1920 vertical layout */}
            <div 
                id="export-affirmation-card" 
                className="hidden flex-col justify-between p-24 text-white font-sans relative overflow-hidden"
                style={{ 
                    width: '1080px', 
                    height: '1920px',
                    fontFamily: 'system-ui, sans-serif',
                    background: 'linear-gradient(135deg, #03001e 0%, #7303c0 50%, #ec38bc 100%)'
                }}
            >
                {/* Subtle dark overlay for premium glass contrast */}
                <div className="absolute inset-0 bg-black/40 z-0" />

                {/* Top Brand Header */}
                <div className="flex items-center gap-6 z-10 text-left">
                    <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-md">
                        <img src="/logo.png" className="w-12 h-12 object-contain" alt="Logo" />
                    </div>
                    <div>
                        <h4 className="text-3xl font-black tracking-tight text-white uppercase">MindCare AI</h4>
                        <p className="text-xl text-white/60 tracking-wider">DAILY PRESENCE</p>
                    </div>
                </div>

                {/* Quote in Center */}
                <div className="flex-1 flex items-center justify-center z-10 px-12">
                    <p className="text-7xl font-black italic text-center leading-normal tracking-tight text-white drop-shadow-2xl">
                        &quot;{affirmations[index]}&quot;
                    </p>
                </div>

                {/* Bottom Branding */}
                <div className="flex justify-between items-end border-t border-white/20 pt-10 z-10">
                    <span className="text-xl text-white/60 font-semibold tracking-wide uppercase">Your Safe Space</span>
                    <span className="text-xl font-bold text-white tracking-widest">itsmindcareai.vercel.app</span>
                </div>
            </div>

            <div className="mt-8 h-px w-8 bg-border/20 mx-auto" />
        </div>
    )
}
