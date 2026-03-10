"use client"

import Link from "next/link"
import { ArrowLeft, Cookie, Info, AppWindow } from "lucide-react"

export default function CookiePolicyPage() {
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
                <div className="mb-16">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm font-medium mb-6">
                        <Cookie className="w-4 h-4" />
                        Cookie Policy
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight leading-tight mb-6">
                        How We Use Cookies
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">
                        We believe in limiting cookies to exactly what is necessary. Here is complete transparency regarding the minimal tracking technology we use.
                    </p>
                    <div className="mt-6 text-sm text-gray-500">
                        Last Updated: March 2026
                    </div>
                </div>

                {/* Content Blocks */}
                <div className="space-y-12 md:space-y-16">

                    {/* Section 1 */}
                    <section className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-md">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
                                <AppWindow className="w-6 h-6 text-purple-400" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-semibold text-white">1. Absolutely Essential Cookies</h2>
                        </div>
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <p>
                                Certain cookies are fundamentally required for MindCare AI to operate. Because of their necessity, they cannot be turned off.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mt-4 text-gray-400 marker:text-purple-500">
                                <li><strong>Authentication:</strong> Tokens used to securely verify that you are logged into your anonymous session. </li>
                                <li><strong>Security:</strong> CSRF protection to prevent malicious cross-site requests impacting your journal data.</li>
                                <li><strong>Preferences:</strong> To remember whether you accepted or dismissed the cookie banner.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-md">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                                <Info className="w-6 h-6 text-blue-400" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-semibold text-white">2. Anonymous Analytics Cookies</h2>
                        </div>
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <p>
                                We use privacy-first tools to measure how heavily our site infrastructure is being used. These do not track individual behavior or attempt to demystify your anonymous identity.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mt-4 text-gray-400 marker:text-blue-500">
                                <li>Counting unique total API calls to scale servers effectively.</li>
                                <li>Measuring page load times to quickly detect bottlenecks.</li>
                            </ul>
                            <p className="mt-4 pt-4 border-t border-white/10 text-gray-400">
                                <strong>You are in control:</strong> You may decline these non-essential analytics cookies entirely via the site banner without losing any functionality.
                            </p>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    )
}
