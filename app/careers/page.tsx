"use client"

import Link from "next/link"
import { ArrowLeft, Briefcase, Zap, Rocket } from "lucide-react"

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-[#0A0118] text-gray-300 font-sans selection:bg-purple-500/30 pb-20">
            {/* Background blobs */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
            </div>

            <div className="max-w-4xl mx-auto px-6 pt-12 md:pt-20 relative z-10">
                <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 md:mb-12 group text-sm font-medium">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-6 animate-fade-in">
                        <Briefcase className="w-4 h-4" />
                        Team Expansion In Progress
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight leading-tight mb-6 animate-slide-in-down">
                        Join the Mission
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        We are currently refining our core technology and will be expanding our team soon to support worldwide mental health initiatives.
                    </p>
                </div>

                {/* Content Box */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md text-center animate-scale-in" style={{ animationDelay: '0.2s' }}>
                    <div className="flex justify-center mb-8">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/5">
                                <Rocket className="w-8 h-8 text-purple-400" />
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-white/5">
                                <Zap className="w-8 h-8 text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">We are growing fast.</h2>
                    <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
                        While we are not actively hiring or reviewing applications at this exact moment, our user base is expanding rapidly. We will soon be looking for passionate engineers, clinical researchers, and AI safety experts.
                    </p>

                    <div className="inline-block p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                        <p className="text-purple-200 font-medium">
                            We highly encourage you to keep visiting this page! Open roles will be posted here as soon as we launch our next phase.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}
