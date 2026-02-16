"use client"

import { motion } from "framer-motion"
import { BarChart3, Lock, BookHeart, BrainCircuit, Users2, Calendar, ArrowRight } from "lucide-react"

export function FeaturesSection() {
    const features = [
        {
            title: "Mood Tracking",
            desc: "Visualize your emotional journey with beautiful charts and insights.",
            icon: <BarChart3 className="w-6 h-6 text-purple-400" />,
            className: "md:col-span-2 md:row-span-2",
            gradient: "from-purple-500/20 to-blue-500/20"
        },
        {
            title: "Private Journal",
            desc: "End-to-end encrypted personal space.",
            icon: <Lock className="w-6 h-6 text-pink-400" />,
            className: "md:col-span-1 md:row-span-1",
            gradient: "from-pink-500/20 to-orange-500/20"
        },
        {
            title: "AI Companion",
            desc: "24/7 support tailored to your needs.",
            icon: <BrainCircuit className="w-6 h-6 text-cyan-400" />,
            className: "md:col-span-1 md:row-span-2",
            gradient: "from-cyan-500/20 to-blue-500/20"
        },
        {
            title: "Assessments",
            desc: "Clinical-grade tests (PHQ-9, GAD-7) to monitor progress.",
            icon: <BookHeart className="w-6 h-6 text-indigo-400" />,
            className: "md:col-span-2 md:row-span-1",
            gradient: "from-indigo-500/20 to-purple-500/20"
        },
    ]

    return (
        <section className="py-16 bg-[#0A0118] text-white relative overflow-hidden" id="features">
            <div className="absolute inset-0 bg-[#0A0118] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 mb-6">
                        Everything you need to thrive
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        A complete toolkit for your mental wellness journey. Secure, intelligent, and designed for you.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px]">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className={`
                            relative group overflow-hidden rounded-3xl p-8 
                            bg-white/5 border border-white/10 hover:border-white/20 
                            transition-all duration-300 hover:bg-white/10
                            ${i === 3 ? "md:col-span-1 md:row-span-1" : feature.className}
                        `}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>

                                <div>
                                    <h3 className="text-2xl font-semibold mb-2 text-white group-hover:translate-x-1 transition-transform">{feature.title}</h3>
                                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{feature.desc}</p>
                                </div>

                                {/* Decorative Arrow */}
                                <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                    <ArrowRight className="w-6 h-6 text-white/50" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
