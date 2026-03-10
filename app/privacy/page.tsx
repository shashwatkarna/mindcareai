"use client"

import Link from "next/link"
import { ArrowLeft, ShieldCheck, Lock, EyeOff, Server, Trash2 } from "lucide-react"

export default function PrivacyPolicyPage() {
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
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-6">
                        <ShieldCheck className="w-4 h-4" />
                        Zero Data Tracking Policy
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight leading-tight mb-6">
                        Privacy Policy
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">
                        At MindCare AI, we believe mental health support requires absolute trust. That's why we've built our platform on a foundation of <strong>strict anonymity and zero personal data collection</strong>.
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
                                <EyeOff className="w-6 h-6 text-purple-400" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-semibold text-white">1. Strict Anonymity Model</h2>
                        </div>
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <p>
                                MindCare AI is designed to be completely anonymous from the moment you sign up. We do not ask for, collect, or store any Personally Identifiable Information (PII) such as real names, email addresses, phone numbers, or IP addresses linked to your account.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mt-4 text-gray-400 marker:text-purple-500">
                                <li>Your account is identified solely by the username and password you create.</li>
                                <li>Because we lack email integration, <strong>account recovery is intentionally impossible</strong> by design. This ensures no third party—not even us—can ever access your data.</li>
                                <li>We strongly advise writing your credentials on physical paper rather than storing them digitally.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-md">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                                <Lock className="w-6 h-6 text-blue-400" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-semibold text-white">2. Your Data & AI Interactions</h2>
                        </div>
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <p>
                                Our core features—Mood Tracking, Journaling, and the AI Therapy Companion (Mistral 7B Instruct)—require processing user inputs to function. However, the way we handle this data prioritizes your privacy above all else.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mt-4 text-gray-400 marker:text-blue-500">
                                <li><strong>Chat History:</strong> Your conversations with the MindCare AI are processed securely. The AI model does not use your private conversations to train public foundation models.</li>
                                <li><strong>Mood & Journal Entries:</strong> These are securely stored in our encrypted database under your anonymous user ID, ensuring that only you can access them when logged in.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-md">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                                <Server className="w-6 h-6 text-amber-400" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-semibold text-white">3. Cookies & Analytics</h2>
                        </div>
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <p>
                                We use minimal, privacy-respecting cookies necessary for the basic functioning of the website (e.g., keeping you logged in).
                            </p>
                            <p>
                                We use anonymized website analytics (such as counting total page visitors) to understand platform load. These analytics do not track individual user behavior or tie usage metrics back to your anonymous account. We use an explicit Cookie Consent banner so you remain in control of non-essential tracking.
                            </p>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-md">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
                                <Trash2 className="w-6 h-6 text-red-400" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-semibold text-white">4. Data Deletion & Export</h2>
                        </div>
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <p>
                                Because you own your mental health data, you have the right to disappear completely at any time. When you choose to delete your account via your settings dashboard, all associated journal entries, mood check-ins, and conversation histories are permanently and irreversibly wiped from our servers immediately.
                            </p>
                        </div>
                    </section>

                    {/* Contact Footer */}
                    <div className="pt-8 border-t border-white/10 text-center">
                        <p className="text-gray-400">
                            Have questions about our strict privacy approach?<br />
                            <span className="text-white font-medium mt-2 inline-block">We are completely transparent about how the platform is built.</span>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )
}
