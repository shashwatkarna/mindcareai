"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"

export function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollY } = useScroll()
    const y1 = useTransform(scrollY, [0, 500], [0, 100])
    const y2 = useTransform(scrollY, [0, 500], [0, -50])
    const opacity = useTransform(scrollY, [0, 800], [1, 0]) // Fades out slower

    return (
        <section ref={containerRef} className="relative min-h-screen w-full overflow-hidden bg-[#0A0118] text-white pt-24 pb-0 flex flex-col justify-center">

            {/* Dynamic Background */}
            <div className="absolute inset-0 w-full h-full">
                <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
                <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow delay-1000" />
                <div className="absolute bottom-[0%] left-[20%] w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow delay-2000" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-10">
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium backdrop-blur-md mb-8 hover:bg-white/10 transition-colors cursor-default"
                    >
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-purple-100">AI-Powered Mental Wellness</span>
                    </motion.div>

                    {/* Headline with Gradient */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1]"
                    >
                        Find Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-gradient-x">
                            Inner Balance
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        Your private, safe space for mental health tracking.
                        Powered by advanced AI to help you understand your emotions
                        and grow every day.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <Link href="/auth/sign-up">
                            <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-white text-black hover:bg-gray-100 transition-all transform hover:scale-105 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                                Start for Free
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="#features">
                            <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-white/20 text-white hover:bg-white/10 backdrop-blur-sm transition-all">
                                How It Works
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* 3D Dashboard Preview */}
            <motion.div
                style={{ y: y1, opacity }}
                className="relative z-10 max-w-6xl mx-auto px-4 perspective-[2000px]"
            >
                <div className="relative group transform-gpu rotate-x-12 hover:rotate-x-0 transition-transform duration-1000 ease-out">

                    {/* Main Dashboard UI Mockup */}
                    <div className="relative bg-[#1A103C] rounded-2xl border border-white/10 shadow-[0_50px_100px_-20px_rgba(139,92,246,0.3)] overflow-hidden aspect-[16/10]">

                        {/* Mockup Header - simplified representation */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5 backdrop-blur-xl">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>
                            <div className="h-2 w-40 bg-white/10 rounded-full" />
                        </div>

                        {/* Mockup Body Content - Abstract Layout */}
                        <div className="flex h-full p-6 gap-6">

                            {/* Sidebar */}
                            <div className="w-64 hidden md:flex flex-col gap-4 border-r border-white/5 pr-6">
                                <div className="h-8 w-8 rounded-lg bg-pink-500/20 mb-4" />
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-10 w-full rounded-lg bg-white/5 hover:bg-white/10 transition-colors" />
                                ))}
                                <div className="mt-auto h-32 w-full rounded-xl bg-gradient-to-b from-purple-500/10 to-transparent border border-purple-500/20" />
                            </div>

                            {/* Main Content Area */}
                            <div className="flex-1 flex flex-col gap-6">
                                {/* Top Stats Row */}
                                <div className="grid grid-cols-3 gap-6">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-32 rounded-xl bg-white/5 border border-white/10 relative overflow-hidden group/card hover:-translate-y-1 transition-transform">
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                                        </div>
                                    ))}
                                </div>

                                {/* Chart Area */}
                                <div className="h-64 rounded-xl bg-white/5 border border-white/10 relative overflow-hidden">
                                    <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-blue-500/20 to-transparent" />
                                    <svg className="absolute bottom-0 left-0 right-0 w-full h-full" preserveAspectRatio="none">
                                        <path d="M0,100 Q200,50 400,80 T800,40 T1200,90 V150 H0 Z" fill="url(#chart-gradient)" opacity="0.4" />
                                        <defs>
                                            <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#8B5CF6" />
                                                <stop offset="100%" stopColor="transparent" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>

                                {/* Bottom Grid */}
                                <div className="flex-1 grid grid-cols-2 gap-6">
                                    <div className="rounded-xl bg-white/5 border border-white/10" />
                                    <div className="rounded-xl bg-white/5 border border-white/10" />
                                </div>
                            </div>
                        </div>

                        {/* Glowing Accent Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none" />
                    </div>

                    {/* Floating Elements (Parallax) */}
                    <motion.div style={{ y: y2 }} className="absolute -right-20 top-20 w-64 p-4 rounded-xl bg-[#1A103C]/90 backdrop-blur-xl border border-white/10 shadow-2xl skew-x-12 z-20 hidden lg:block">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-white">Mood Improved</div>
                                <div className="text-xs text-gray-400">+15% vs last week</div>
                            </div>
                        </div>
                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full w-[70%] bg-green-500 rounded-full" />
                        </div>
                    </motion.div>

                    <motion.div style={{ y: useTransform(scrollY, [0, 500], [0, -80]) }} className="absolute -left-10 bottom-40 w-56 p-4 rounded-xl bg-[#1A103C]/90 backdrop-blur-xl border border-white/10 shadow-2xl -skew-x-6 z-20 hidden lg:block">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                <Zap className="w-5 h-5 text-yellow-400" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-white">Streak Active</div>
                                <div className="text-xs text-gray-400">7 Day Consistency</div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-15">
                <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent" />
                <span className="text-xs tracking-[0.2em] uppercase text-white">Scroll</span>
            </div>
        </section>
    )
}
