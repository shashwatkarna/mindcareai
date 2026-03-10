"use client"

import Link from "next/link"
import { ArrowLeft, Stethoscope, Star, Network } from "lucide-react"

export default function ForTherapistsPage() {
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
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-6 animate-fade-in">
                        <Stethoscope className="w-4 h-4" />
                        Clinical Platform In Development
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight leading-tight mb-6 animate-slide-in-down">
                        MindCare For Therapists
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        We are currently improving and expanding our platform to bring powerful, secure AI tools directly to clinical practices and healthcare professionals.
                    </p>
                </div>

                {/* Content Box */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md text-center animate-scale-in" style={{ animationDelay: '0.2s' }}>
                    <div className="flex justify-center mb-8">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/5">
                                <Network className="w-8 h-8 text-purple-400" />
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-white/5">
                                <Star className="w-8 h-8 text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">Something big is coming.</h2>
                    <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
                        Our team is working heavily behind the scenes to craft a strict privacy-first dashboard tailored specifically for therapists to assign exercises, review consented patient mood logs, and scale their practice.
                    </p>

                    <div className="inline-block p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                        <p className="text-purple-200 font-medium">
                            We'll have more to announce later. Please keep visiting this page to know when we launch!
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}
