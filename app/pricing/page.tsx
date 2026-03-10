"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, Loader2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { motion } from "framer-motion"

export default function PricingPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleClaimLifetime = async () => {
        setLoading(true)
        try {
            // Call Server Action directly to unlock premium for free
            const { unlockPremium } = await import("@/actions/gamification")
            const result = await unlockPremium()

            if (!result.success) {
                if (result.error === "Not authenticated") {
                    router.push("/auth/login?redirect=/pricing")
                    return
                }
                throw new Error(result.error)
            }

            // Success!
            router.push("/dashboard?unlocked=true")
        } catch (error) {
            console.error("Claim error:", error)
            alert("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0A0118] text-foreground font-sans selection:bg-purple-500/30">
            {/* Background blobs */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
            </div>

            <Navbar />

            <main className="pt-32 pb-20 px-4 relative z-10">
                <div className="max-w-7xl mx-auto text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-6"
                    >
                        <Star className="w-4 h-4 text-purple-400" />
                        Early Adopter Special
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight leading-tight mb-6">
                        Invest in Your Mind
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        No recurring subscriptions. Access all premium features forever with a single payment.
                    </p>
                </div>

                <div className="max-w-md mx-auto relative mb-20 relative">
                    {/* Glowing backdrop for the card */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur opacity-20 animate-pulse-slow"></div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="relative bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl overflow-hidden"
                    >
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

                        <div className="text-center mb-10 mt-4">
                            <h2 className="text-2xl font-semibold text-white mb-2">Lifetime Access</h2>
                            <div className="flex items-center justify-center gap-4 my-6">
                                <span className="text-3xl text-gray-500 line-through decoration-red-500/60 font-medium">₹19</span>
                                <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">Free</span>
                            </div>
                            <span className="inline-block px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-400 rounded-full text-sm font-semibold animate-pulse">
                                Limited time offer
                            </span>
                        </div>

                        <div className="space-y-4 mb-10">
                            {[
                                "Unlimited AI Therapy Sessions",
                                "Advanced Mood Analytics",
                                "Encrypted Private Journaling",
                                "Free updates forever"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 border border-purple-500/20">
                                        <Check className="w-3.5 h-3.5 text-purple-300" />
                                    </div>
                                    <span className="text-gray-300 font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <Button
                            onClick={handleClaimLifetime}
                            disabled={loading}
                            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300 rounded-xl"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="animate-spin w-5 h-5" /> Unlocking Premium...
                                </span>
                            ) : (
                                "Claim Free Lifetime Access"
                            )}
                        </Button>
                    </motion.div>
                </div>

                {/* For Therapists Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="max-w-5xl mx-auto"
                >
                    <div className="bg-gradient-to-r from-purple-900/40 via-blue-900/20 to-purple-900/40 border border-purple-500/20 rounded-3xl p-8 md:p-12 text-center backdrop-blur-md relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 relative z-10">Are you a Therapist or Clinical Professional?</h3>
                        <p className="text-purple-200/80 mb-8 max-w-2xl mx-auto text-lg relative z-10">
                            We are currently improving and expanding our platform to bring powerful, secure AI tools directly to clinical practices. We will have more to announce later.
                        </p>
                        <Link href="/for-therapists" className="relative z-10 inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium transition-all duration-300 border border-white/10 hover:border-white/20 shadow-lg group">
                            Keep visiting to know more
                            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    )
}
