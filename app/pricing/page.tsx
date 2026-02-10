"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, Sparkles, Loader2, Search, Map, Lock, Unlock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function PricingPage() {
    const [loading, setLoading] = useState(false)
    const [foundCount, setFoundCount] = useState(0)
    const [foundItems, setFoundItems] = useState<string[]>([])
    const router = useRouter()

    useEffect(() => {
        // Check finding progress
        const items = ["lotus_dashboard", "lotus_mood", "lotus_about"]
        const found = items.filter(id => localStorage.getItem(`lotus_${id}`))
        setFoundItems(found)
        setFoundCount(found.length)
    }, [])

    const handlePurchase = async () => {
        setLoading(true)
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push("/auth/login?redirect=/pricing")
                return
            }

            // Simulate Payment
            const response = await fetch("/api/mock-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id }),
            })

            if (!response.ok) throw new Error("Payment failed")
            router.push("/dashboard/exercises?upgraded=true")

        } catch (error) {
            console.error("Purchase error:", error)
            alert("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleClaimReward = async () => {
        setLoading(true)
        try {
            // Call Server Action directly (it handles auth check)
            const { unlockPremium } = await import("@/actions/gamification")
            const result = await unlockPremium()

            if (!result.success) {
                if (result.error === "Not authenticated") {
                    // Only redirect if server explicitly says so
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
        <div className="min-h-screen bg-background text-foreground font-sans">
            <Navbar />

            <main className="pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Unlock Your <span className="text-primary">Journey</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Two paths to Premium. Choose your way.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">

                    {/* Option 1: The Fast Path */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="h-full border-primary/20 relative overflow-hidden bg-card/50 backdrop-blur-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl flex items-center justify-between">
                                    Instant Access
                                    <span className="text-sm font-normal px-3 py-1 bg-primary/10 rounded-full text-primary">₹1 / Life</span>
                                </CardTitle>
                                <CardDescription>Support the mission directly.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Instant Premium Unlock</li>
                                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Support Development</li>
                                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Good Karma</li>
                                </ul>
                            </CardContent>
                            <CardFooter className="mt-auto">
                                <Button onClick={handlePurchase} disabled={loading} className="w-full">
                                    {loading ? <Loader2 className="animate-spin" /> : "Pay ₹1 & Unlock"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>

                    {/* Option 2: The Scavenger Hunt */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="h-full border-yellow-500/20 bg-yellow-50/50 dark:bg-yellow-900/10 relative overflow-hidden ring-1 ring-yellow-500/30">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Map className="w-32 h-32" />
                            </div>

                            <CardHeader>
                                <CardTitle className="text-2xl flex items-center justify-between text-yellow-600 dark:text-yellow-400">
                                    The Scavenger Hunt
                                    <span className="text-sm font-normal px-3 py-1 bg-yellow-500/10 rounded-full border border-yellow-500/20">Free</span>
                                </CardTitle>
                                <CardDescription>Find the 3 Hidden Golden Lotuses 🪷</CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <p className="text-sm text-muted-foreground">
                                    Prove your exploration skills. Find all 3 hidden symbols across the platform to unlock Premium for free.
                                </p>

                                <div className="space-y-4">
                                    {/* Hint 1 */}
                                    <div className={`p-3 rounded-lg border transition-all ${foundItems.includes('lotus_dashboard') ? 'bg-green-50 border-green-200 dark:bg-green-900/20' : 'bg-background/50 border-dashed'}`}>
                                        <div className="flex items-center gap-3">
                                            {foundItems.includes('lotus_dashboard') ? <Check className="w-5 h-5 text-green-500" /> : <Search className="w-5 h-5 text-muted-foreground" />}
                                            <div>
                                                <div className="font-semibold text-sm">Lotus #1</div>
                                                <div className="text-xs text-muted-foreground italic">"I hide where your journey begins every day."</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hint 2 */}
                                    <div className={`p-3 rounded-lg border transition-all ${foundItems.includes('lotus_mood') ? 'bg-green-50 border-green-200 dark:bg-green-900/20' : 'bg-background/50 border-dashed'}`}>
                                        <div className="flex items-center gap-3">
                                            {foundItems.includes('lotus_mood') ? <Check className="w-5 h-5 text-green-500" /> : <Search className="w-5 h-5 text-muted-foreground" />}
                                            <div>
                                                <div className="font-semibold text-sm">Lotus #2</div>
                                                <div className="text-xs text-muted-foreground italic">"I bloom where you track your emotional highs and lows."</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hint 3 */}
                                    <div className={`p-3 rounded-lg border transition-all ${foundItems.includes('lotus_about') ? 'bg-green-50 border-green-200 dark:bg-green-900/20' : 'bg-background/50 border-dashed'}`}>
                                        <div className="flex items-center gap-3">
                                            {foundItems.includes('lotus_about') ? <Check className="w-5 h-5 text-green-500" /> : <Search className="w-5 h-5 text-muted-foreground" />}
                                            <div>
                                                <div className="font-semibold text-sm">Lotus #3</div>
                                                <div className="text-xs text-muted-foreground italic">"I wait where our story is told."</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter>
                                <Button
                                    onClick={handleClaimReward}
                                    className="w-full"
                                    disabled={foundCount < 3 || loading}
                                    variant={foundCount < 3 ? "outline" : "default"}
                                >
                                    {loading ? (
                                        <><Loader2 className="animate-spin mr-2" /> Unlocking...</>
                                    ) : foundCount < 3 ? (
                                        <>
                                            <Lock className="w-4 h-4 mr-2" /> {foundCount}/3 Found
                                        </>
                                    ) : (
                                        <>
                                            <Unlock className="w-4 h-4 mr-2" /> Claim Premium Reward
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
