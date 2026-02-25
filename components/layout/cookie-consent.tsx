"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Cookie, X, ArrowRight } from "lucide-react"

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Check local storage on mount
        const hasConsented = localStorage.getItem("cookieConsent")
        if (!hasConsented) {
            // Small delay to not overwhelm user immediately on load
            const timer = setTimeout(() => setIsVisible(true), 1500)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem("cookieConsent", "accepted")
        setIsVisible(false)

        // Optional: Enable analytics here if you had them conditionally disabled
        if (typeof window !== "undefined" && (window as any).gtag) {
            (window as any).gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
    }

    const handleDecline = () => {
        localStorage.setItem("cookieConsent", "declined")
        setIsVisible(false)

        // Optional: Disable analytics here
        if (typeof window !== "undefined" && (window as any).gtag) {
            (window as any).gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-4 left-4 right-4 md:bottom-8 md:left-auto md:right-8 z-[100] max-w-sm w-full"
                >
                    <div className="bg-[#1A103C]/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6 relative overflow-hidden">
                        {/* Decorative glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-[40px] pointer-events-none" />

                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2 text-white font-medium">
                                <Cookie className="w-5 h-5 text-purple-400" />
                                <h3>We value your privacy</h3>
                            </div>
                            <button
                                onClick={() => setIsVisible(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                            We use cookies to improve your experience, analyze site traffic, and support our analytics.
                            You can choose to accept or decline tracking cookies.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={handleDecline}
                                className="flex-1 px-4 py-2 rounded-xl text-sm font-medium border border-white/10 text-gray-300 hover:bg-white/5 transition-colors"
                            >
                                Decline
                            </button>
                            <button
                                onClick={handleAccept}
                                className="group relative flex-1 flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-all overflow-hidden"
                            >
                                <span className="transition-transform duration-300 group-hover:-translate-x-2">Accept All</span>
                                <ArrowRight className="absolute right-3 w-4 h-4 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
