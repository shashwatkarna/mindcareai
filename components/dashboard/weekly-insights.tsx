"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, RefreshCw, ChevronRight } from "lucide-react"
import { generateWeeklyInsights, getLatestInsight } from "@/actions/insights"
import { toast } from "sonner"
import ReactMarkdown from 'react-markdown'

export function WeeklyInsights({ userId }: { userId: string }) {
    const [insight, setInsight] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)

    useEffect(() => {
        const fetchLatest = async () => {
            const data = await getLatestInsight(userId)
            if (data) setInsight(data.content)
            setIsFetching(false)
        }
        fetchLatest()
    }, [userId])

    const handleGenerate = async () => {
        setIsLoading(true)
        try {
            const res = await generateWeeklyInsights(userId)
            if (res.success && res.content) {
                setInsight(res.content)
                toast.success("New insight generated!")
            } else {
                toast.error(res.error || "Failed to generate insights")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    if (isFetching) return (
        <Card className="border-primary/10 bg-card/50 backdrop-blur-sm h-full animate-pulse">
            <CardHeader className="pb-2">
                <div className="h-6 w-32 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="h-4 w-full bg-muted rounded"></div>
                    <div className="h-4 w-full bg-muted rounded"></div>
                    <div className="h-4 w-3/4 bg-muted rounded"></div>
                </div>
            </CardContent>
        </Card>
    )

    return (
        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm relative overflow-hidden group h-full flex flex-col">
            {/* Ambient Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none opacity-50" />
            
            <CardHeader className="relative z-10 pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Brain className="w-5 h-5 text-primary" />
                        AI Weekly Insights
                    </CardTitle>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleGenerate} 
                        disabled={isLoading}
                        className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors rounded-full"
                        title="Generate New Insight"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
                <CardDescription>
                    Personalized analysis of your mood and journals
                </CardDescription>
            </CardHeader>

            <CardContent className="relative z-10 flex-1 overflow-auto">
                {!insight ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                        <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center">
                             <Brain className="w-6 h-6 text-primary/40" />
                        </div>
                        <p className="text-sm text-muted-foreground px-4">
                            No insights generated yet. Click the refresh icon to see what the AI thinks of your week!
                        </p>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleGenerate} 
                            disabled={isLoading}
                            className="border-primary/20 hover:bg-primary/5"
                        >
                            Generate Insight
                        </Button>
                    </div>
                ) : (
                    <div className="prose dark:prose-invert prose-sm max-w-none text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-bottom-2">
                        <ReactMarkdown>{insight}</ReactMarkdown>
                    </div>
                )}
            </CardContent>
            
            {insight && (
                <div className="p-4 pt-0 mt-auto relative z-10">
                    <div className="h-px w-full bg-border/40 mb-4" />
                    <p className="text-[10px] text-muted-foreground/40 uppercase tracking-widest font-medium text-center">
                        Generated by MindCare AI Engine
                    </p>
                </div>
            )}
        </Card>
    )
}
