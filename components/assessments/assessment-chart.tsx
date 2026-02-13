"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Assessment {
    id: string
    assessment_type: string
    score: number | null
    created_at: string
}

export function AssessmentChart({ assessments }: { assessments: Assessment[] }) {
    // Process data for the chart
    const data = assessments
        .filter(a => a.score !== null)
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        .map(a => ({
            date: new Date(a.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            score: a.score,
            type: a.assessment_type,
            fullDate: new Date(a.created_at).toLocaleDateString()
        }))

    if (data.length < 2) {
        return null
    }

    return (
        <Card className="col-span-4 border-border shadow-sm">
            <CardHeader>
                <CardTitle>Assessment History</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis
                            dataKey="date"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 100]} // Assuming score is 0-100 normalized
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))" }}
                            itemStyle={{ color: "hsl(var(--foreground))" }}
                            labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                        />
                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
                            dot={{ r: 4, fill: "hsl(var(--background))", strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
