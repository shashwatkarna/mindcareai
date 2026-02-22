"use client"

import { motion } from "framer-motion"

export function HowItWorks() {
    const steps = [
        {
            num: "01",
            title: "Check In Daily",
            desc: "Log your mood and thoughts in securely encrypted sessions."
        },
        {
            num: "02",
            title: "Get AI Insights",
            desc: "Our AI analyzes patterns to provide personalized coping strategies."
        },
        {
            num: "03",
            title: "Grow & Thrive",
            desc: "Track your progress and build resilience with expert tools."
        }
    ]

    return (
        <section className="py-24 bg-[#0A0118] text-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-16 items-center">

                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-8">
                            Your Journey to Wellness
                        </h2>
                        <div className="space-y-12 relative">
                            {/* Connecting Line */}
                            <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-purple-500/50 to-transparent" />

                            {steps.map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.2 }}
                                    viewport={{ once: true }}
                                    className="relative pl-16"
                                >
                                    <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-[#0A0118] border-2 border-purple-500 flex items-center justify-center z-10">
                                        <span className="text-sm font-bold text-purple-400">{step.num}</span>
                                    </div>
                                    <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        {/* Replaced expensive blur-[100px] with performant radial-gradient */}
                        <div className="absolute inset-[-50px] bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.15),transparent_70%)] rounded-full mix-blend-screen pointer-events-none" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative z-10 rounded-2xl overflow-hidden border border-white/10 shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-700 ease-out"
                        >
                            <img
                                src="/wellness_journey_dashboard.png"
                                alt="MindCare AI Dashboard Journey"
                                className="w-full h-auto object-cover"
                            />
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    )
}
