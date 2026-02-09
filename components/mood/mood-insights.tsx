
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, TrendingUp, Lightbulb, ArrowRight } from "lucide-react"

export function MoodInsights() {
    const [insights, setInsights] = useState<{ advice: string; prediction: string } | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const res = await fetch("/api/mood/insights", { method: "POST" })
                if (res.ok) {
                    const data = await res.json()
                    setInsights(data)
                }
            } catch (e) {
                console.error("Failed to fetch insights", e)
            } finally {
                setLoading(false)
            }
        }

        fetchInsights()
    }, [])

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
                <div className="h-40 bg-gray-100 rounded-xl"></div>
                <div className="h-40 bg-gray-100 rounded-xl"></div>
            </div>
        )
    }

    if (!insights) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-none shadow-md overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-indigo-50 opacity-100 transition-opacity" />
                <CardHeader className="pb-2 relative z-10">
                    <CardTitle className="text-lg flex items-center gap-2 text-indigo-700">
                        <Lightbulb className="w-5 h-5 text-indigo-500" />
                        AI Insight
                    </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                    <p className="text-indigo-900/80 text-sm leading-relaxed font-medium">
                        "{insights.advice}"
                    </p>
                </CardContent>
                <div className="absolute bottom-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Sparkles className="w-24 h-24 text-indigo-900" />
                </div>
            </Card>

            <Card className="border-none shadow-md overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 opacity-100 transition-opacity" />
                <CardHeader className="pb-2 relative z-10">
                    <CardTitle className="text-lg flex items-center gap-2 text-teal-700">
                        <TrendingUp className="w-5 h-5 text-teal-500" />
                        Forecast
                    </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                    <p className="text-teal-900/80 text-sm leading-relaxed font-medium">
                        "{insights.prediction}"
                    </p>
                </CardContent>
                <div className="absolute bottom-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <ArrowRight className="w-24 h-24 text-teal-900" />
                </div>
            </Card>
        </div>
    )
}
