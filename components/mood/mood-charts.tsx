
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

interface MoodLog {
    id: string
    mood: string
    intensity: number
    created_at: string
}

export function MoodCharts({ moodLogs }: { moodLogs: MoodLog[] }) {
    if (!moodLogs || moodLogs.length < 2) {
        return null; // Need at least 2 points for a meaningful chart
    }

    // Format data for chart - reverse to show oldest to newest
    const data = [...moodLogs].reverse().map(log => ({
        date: new Date(log.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        intensity: log.intensity,
        mood: log.mood
    }));

    return (
        <Card className="border-[#e0d9d3] bg-white">
            <CardHeader>
                <CardTitle className="text-[#3d3d3d]">Mood Intensity Trend</CardTitle>
                <CardDescription className="text-[#6b6b6b]">Visualizing your emotional intensity over the last 30 entries</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="date"
                                stroke="#4b5563"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: '#4b5563' }}
                            />
                            <YAxis
                                stroke="#4b5563"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                domain={[0, 10]}
                                tick={{ fill: '#4b5563' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '8px',
                                    border: '1px solid #e5e7eb',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    backgroundColor: '#ffffff',
                                    color: '#374151'
                                }}
                                labelStyle={{ color: '#111827', fontWeight: 'bold' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="intensity"
                                stroke="#8b7355"
                                strokeWidth={3}
                                dot={{ r: 4, fill: "#8b7355", strokeWidth: 2, stroke: "#fff" }}
                                activeDot={{ r: 6, fill: "#8b7355" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
