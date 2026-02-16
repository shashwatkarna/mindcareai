"use client"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"

const features = [
    {
        title: "Mood Tracking",
        desc: "Log your daily moods and identify triggers with our intuitive tracking system. Visual charts help you spot patterns over weeks and months.",
        icon: "📊",
        color: "from-blue-500/20 to-cyan-500/20"
    },
    {
        title: "Secure Journaling",
        desc: "A private space to express your thoughts. Our encrypted journal includes daily prompts to help you reflect and grow.",
        icon: "📔",
        color: "from-purple-500/20 to-pink-500/20"
    },
    {
        title: "Teletherapy Appointments",
        desc: "Connect with licensed therapists directly through the platform. Schedule video sessions that fit your life.",
        icon: "📅",
        color: "from-green-500/20 to-emerald-500/20"
    },
    {
        title: "AI Wellness Companion",
        desc: "Get instant, 24/7 support for panic attacks, anxiety, or loneliness from our empathetic AI, trained on cognitive behavioral therapy principles.",
        icon: "🤖",
        color: "from-orange-500/20 to-red-500/20"
    },
    {
        title: "Clinical Assessments",
        desc: "Take standardized tests like the PHQ-9 and GAD-7 to clinically monitor the severity of depression and anxiety symptoms.",
        icon: "✅",
        color: "from-indigo-500/20 to-violet-500/20"
    },
    {
        title: "Resource Library",
        desc: "Access a curated library of articles, meditation guides, and videos to support your mental health education.",
        icon: "📚",
        color: "from-teal-500/20 to-lime-500/20"
    }
]

export default function FeaturesPage() {
    return (
        <div className="min-h-screen flex flex-col font-sans bg-[#0A0118] selection:bg-purple-500/30">
            <Navbar home={true} />

            <main className="flex-1 relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.1),transparent_50%)]" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-20"
                    >
                        <h1 className="text-4xl font-bold mb-6 sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-gray-400">
                            Platform Features
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            A complete toolkit designed to support every aspect of your mental wellness journey.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                            >
                                <Card className={`p-8 h-full border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 group relative overflow-hidden`}>
                                    <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                    <div className="relative z-10">
                                        <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg">
                                            {f.icon}
                                        </div>
                                        <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-purple-200 transition-colors">
                                            {f.title}
                                        </h3>
                                        <p className="text-gray-400 leading-relaxed group-hover:text-gray-200 transition-colors">
                                            {f.desc}
                                        </p>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer home={true} />
        </div>
    )
}
