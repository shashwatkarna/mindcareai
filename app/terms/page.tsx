"use client"

import Link from "next/link"
import { ArrowLeft, Scale, ShieldAlert, BrainCircuit, Activity } from "lucide-react"

export default function TermsOfServicePage() {
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
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-6">
                        <Scale className="w-4 h-4" />
                        Legal Agreement
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight leading-tight mb-6">
                        Terms of Service
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">
                        Please read these terms carefully. By using MindCare AI, you agree to these conditions detailing your rights and the limitations of our AI-assisted platform.
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
                            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
                                <ShieldAlert className="w-6 h-6 text-red-400" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-semibold text-white">1. Not a Medical Replacement</h2>
                        </div>
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <p className="text-red-200/90 font-medium">
                                MINDCARE AI IS NOT A REPLACEMENT FOR PROFESSIONAL MEDICAL OR PSYCHIATRIC CARE.
                            </p>
                            <p>
                                Our platform and its companion AI (powered by Mistral 7B) are designed for wellness tracking, journaling, and general conversational support. The AI is not licensed to provide medical diagnoses, psychiatric evaluations, or crisis intervention.
                            </p>
                            <p>
                                If you are experiencing a mental health crisis, severe depression, or suicidal thoughts, please stop using this application immediately and contact your local emergency services or a dedicated crisis hotline.
                            </p>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-md">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
                                <BrainCircuit className="w-6 h-6 text-purple-400" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-semibold text-white">2. AI Limitations</h2>
                        </div>
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <p>
                                You acknowledge that you are interacting with an artificial intelligence language model. While fine-tuned to be empathetic and supportive:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mt-4 text-gray-400 marker:text-purple-500">
                                <li>The AI may occasionally generate inaccurate, biologically incorrect, or contextually inappropriate responses (hallucinations).</li>
                                <li>You are solely responsible for how you interpret and act upon the AI's suggestions.</li>
                                <li>MindCare AI and its developers assume no liability for damages resulting from reliance on the AI's outputs.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-md">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                                <Activity className="w-6 h-6 text-blue-400" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-semibold text-white">3. User Responsibilities & Account Loss</h2>
                        </div>
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <p>
                                As detailed in our Privacy Policy, MindCare AI operates on a completely anonymous model. You are entirely responsible for securely storing your username and password.
                            </p>
                            <p>
                                By using our service, you acknowledge and agree that <strong>if you lose your credentials, your account and all associated journal/mood tracking data are permanently lost.</strong> We have intentionally built our system with zero backdoor access or password reset capabilities to protect your exact anonymity. We cannot and will not attempt to recover a lost account under any circumstances.
                            </p>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    )
}
