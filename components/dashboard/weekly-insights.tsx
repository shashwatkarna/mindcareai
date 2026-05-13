"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, RefreshCw, ChevronRight } from "lucide-react"
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
        <Card className="border-primary/20 bg-background/95 backdrop-blur-2xl relative overflow-hidden group h-full flex flex-col shadow-2xl">
            {/* Ambient Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none" />
            
            <CardHeader className="relative z-10 pb-2 border-b border-border/50">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2 text-foreground">
                        <BarChart3 className="w-5 h-5 text-primary" />
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

            <CardContent className="relative z-10 flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-primary/20" data-lenis-prevent>
                {!insight ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                             <BarChart3 className="w-8 h-8 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg">No Insights Yet</h3>
                            <p className="text-sm text-muted-foreground max-w-[280px]">
                                Click the refresh icon at the top to generate your weekly wellness report!
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="prose dark:prose-invert prose-sm max-w-none text-foreground/90 leading-relaxed animate-in fade-in slide-in-from-bottom-2 prose-headings:text-primary prose-strong:text-foreground">
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
