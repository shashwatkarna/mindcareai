"use client"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { motion } from "framer-motion"

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col font-sans bg-[#0A0118] selection:bg-purple-500/30">
            <Navbar home={true} />

            <main className="flex-1 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="absolute right-0 top-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6 text-center mb-24"
                    >
                        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                            Our Mission
                        </h1>
                        <p className="text-2xl text-purple-200/80 font-light flex items-center justify-center gap-2">
                            Democratizing mental health access through technology, privacy, and compassion.
                        </p>
                    </motion.div>

                    <div className="space-y-20">
                        <section>
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl"
                            >
                                <h2 className="text-3xl font-bold mb-6 text-white">The Story of MindCare AI</h2>
                                <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                                    <p>
                                        MindCare AI was born from a simple observation: mental health support is often inaccessible,
                                        expensive, or intimidating. We wanted to create a safe harbor—a digital space where anyone
                                        could track their well-being without fear of judgment.
                                    </p>
                                    <p>
                                        What started as a simple mood tracker has evolved into a comprehensive platform
                                        connecting users with AI-driven insights, professional therapy, and validated clinical tools.
                                    </p>
                                </div>
                            </motion.div>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold mb-10 text-white text-center">Our Core Values</h2>
                            <div className="grid sm:grid-cols-2 gap-6">
                                {[
                                    { title: "Privacy First", desc: "Your thoughts belong to you. We use military-grade encryption to ensure your data never leaves your control.", color: "text-blue-400", border: "hover:border-blue-500/50" },
                                    { title: "Accessibility", desc: "Mental health tools should be available to everyone, regardless of their location or income.", color: "text-green-400", border: "hover:border-green-500/50" },
                                    { title: "Compassion", desc: "We design every interaction with empathy, recognizing the courage it takes to seek help.", color: "text-pink-400", border: "hover:border-pink-500/50" },
                                    { title: "Innovation", desc: "Leveraging the latest in AI and psychology to provide real-time, personalized support.", color: "text-purple-400", border: "hover:border-purple-500/50" }
                                ].map((val, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className={`p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300 ${val.border} group`}
                                    >
                                        <h3 className={`font-bold text-xl mb-3 ${val.color}`}>{val.title}</h3>
                                        <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{val.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold mb-10 text-white text-center">Meet Our Team</h2>
                            <div className="grid md:grid-cols-3 gap-8">
                                {[
                                    { name: "Shashwat Karna", role: "CEO" },
                                    { name: "Jyoti Sutradhar", role: "CEO" },
                                    { name: "Manjul Sharma", role: "CEO" }
                                ].map((member, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex flex-col items-center text-center p-8 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group backdrop-blur-sm"
                                    >
                                        <div className="w-24 h-24 rounded-full overflow-hidden mb-6 border-2 border-white/10 group-hover:border-purple-500 transition-colors shadow-xl">
                                            <img src={`https://ui-avatars.com/api/?name=${member.name.replace(" ", "+")}&background=random`} alt={member.name} className="w-full h-full object-cover" />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                                        <p className="text-sm text-purple-400 font-medium mb-4">{member.role}</p>
                                        <div className="flex gap-4 opacity-60 group-hover:opacity-100 transition-opacity">
                                            {/* Social Links would go here */}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
            <Footer home={true} />
        </div>
    )
}
