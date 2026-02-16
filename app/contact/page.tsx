"use client"

import { useState } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Mail, MapPin, Phone, Clock, ArrowUpRight } from "lucide-react"
import { ConversationalForm } from "@/components/contact/conversational-form"
import { motion } from "framer-motion"

export default function ContactPage() {
    // We want the chat to be open by default in this layout
    const [isChatOpen, setIsChatOpen] = useState(true)

    return (
        <div className="min-h-screen flex flex-col font-sans bg-[#0A0118] selection:bg-purple-500/30">
            <Navbar home={true} />

            <main className="flex-1 flex flex-col justify-center p-4 sm:p-6 lg:p-8 pt-24 lg:pt-32 relative overflow-hidden">
                {/* Background Glows */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-4xl mx-auto w-full grid lg:grid-cols-12 gap-4 lg:gap-6 h-auto lg:h-[450px] relative z-10">

                    {/* Left Column: Chat Interface (Span 7) */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-7 h-[500px] lg:h-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col relative order-2 lg:order-1"
                    >
                        {/* We render the form here. */}
                        <div className="absolute inset-0">
                            <ConversationalForm
                                open={isChatOpen}
                                onOpenChange={setIsChatOpen}
                                initialSubject=""
                            />
                        </div>
                    </motion.div>

                    {/* Right Column: Details & Extra (Span 5) */}
                    <div className="lg:col-span-5 grid grid-rows-3 gap-4 lg:gap-6 h-auto lg:h-full order-1 lg:order-2">

                        {/* Upper Block: Contact Details */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="row-span-2 bg-gradient-to-br from-purple-900/40 to-black/40 backdrop-blur-lg rounded-2xl p-6 border border-white/10 flex flex-col justify-between gap-6 lg:gap-0"
                        >
                            <div>
                                <h2 className="text-2xl font-bold mb-1 text-white">Get in touch</h2>
                                <p className="text-sm text-gray-400">We'd love to hear from you. Chat with our AI or reach out.</p>
                            </div>

                            <div className="space-y-4">
                                <a href="mailto:shashwatkarna.07@gmail.com" className="flex items-center gap-3 group p-2 rounded-lg hover:bg-white/5 transition-colors -mx-2">
                                    <div className="h-8 w-8 bg-white/10 rounded-full flex items-center justify-center border border-white/10 shadow-sm group-hover:scale-110 transition-transform">
                                        <Mail className="h-4 w-4 text-purple-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-gray-400">Email</p>
                                        <p className="text-xs sm:text-sm font-semibold text-white group-hover:text-purple-400 transition-colors truncate">shashwatkarna.07@gmail.com</p>
                                    </div>
                                    <ArrowUpRight className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>

                                <a href="tel:+919971374395" className="flex items-center gap-3 group p-2 rounded-lg hover:bg-white/5 transition-colors -mx-2">
                                    <div className="h-8 w-8 bg-white/10 rounded-full flex items-center justify-center border border-white/10 shadow-sm group-hover:scale-110 transition-transform">
                                        <Phone className="h-4 w-4 text-purple-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-gray-400">Phone</p>
                                        <p className="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors">+91 9971374395</p>
                                    </div>
                                    <ArrowUpRight className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>

                                <div className="flex items-center gap-3 group p-2 rounded-lg -mx-2">
                                    <div className="h-8 w-8 bg-white/10 rounded-full flex items-center justify-center border border-white/10 shadow-sm">
                                        <MapPin className="h-4 w-4 text-purple-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-gray-400">Office</p>
                                        <p className="text-sm font-semibold text-white truncate">Sector-18, Noida India</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Lower Block: Operating Hours */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="row-span-1 bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-sm flex items-center justify-between"
                        >
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-purple-400" />
                                    <h3 className="font-semibold text-base text-white">Operating Hours</h3>
                                </div>
                                <p className="text-gray-400 text-xs">Mon - Fri: 9am - 6pm IST</p>
                                <p className="text-gray-400 text-xs">Sat - Sun: Closed</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                </span>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </main>
            <Footer home={true} />
        </div>
    )
}
