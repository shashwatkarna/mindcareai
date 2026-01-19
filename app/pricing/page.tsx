"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export default function PricingPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handlePurchase = async () => {
        setLoading(true)
        try {
            const supabase = createClient()

            // 1. Check if user is logged in
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                // Redirect to login if not authenticated
                router.push("/auth/login?redirect=/pricing")
                return
            }

            // 2. Simulate Payment Process
            // In a real app, you would integrate Razorpay/Stripe here
            const response = await fetch("/api/mock-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id }),
            })

            if (!response.ok) throw new Error("Payment failed")

            // 3. Success! Redirect to exercises
            router.push("/dashboard/exercises?upgraded=true")

        } catch (error) {
            console.error("Purchase error:", error)
            alert("Something went wrong with the purchase. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <Navbar />

            <main className="pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-in-down">
                        Invest in Your <span className="text-primary">Peace of Mind</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
                        Unlock the full potential of MindCare AI with our premium self-care tools.
                        Small price, massive impact.
                    </p>
                </div>

                <div className="max-w-md mx-auto animate-scale-in">
                    <div className="relative p-8 rounded-3xl border border-primary/20 bg-card shadow-2xl overflow-hidden">
                        {/* Gradient Glow */}
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-3xl -z-10 -mr-20 -mt-20"></div>

                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-2xl font-bold">MindCare Premium</h3>
                                <p className="text-muted-foreground">Lifetime Access</p>
                            </div>
                            <div className="text-right">
                                <span className="text-4xl font-bold">₹1</span>
                                <span className="text-muted-foreground text-sm ml-1">/ life</span>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            {[
                                "Unlimited Self-Exercise Activities",
                                "Advanced Mood Analytics",
                                "Priority AI Chat Support",
                                "Exclusive Meditation Tracks",
                                "Early Access to Future Features"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="p-1 rounded-full bg-primary/10 text-primary">
                                        <Check className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <Button
                            onClick={handlePurchase}
                            disabled={loading}
                            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...
                                </>
                            ) : (
                                <>
                                    Get Premium Access <Sparkles className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </Button>

                        <p className="text-xs text-center text-muted-foreground mt-4">
                            One-time payment of ₹1. No recurring fees. Secure processing.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
