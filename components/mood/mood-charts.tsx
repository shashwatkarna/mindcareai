"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"

interface MoodLog {
    id: string
    mood: string
    intensity: number
    created_at: string
}

export function MoodCharts({ moodLogs }: { moodLogs: MoodLog[] }) {
    if (!moodLogs || moodLogs.length === 0) {
        return (
            <div className="h-full w-full flex items-center justify-center text-gray-400 italic text-sm">
                No data available for the selected period
            </div>
        )
    }

    const data = [...moodLogs]
        .reverse()
        .map(log => ({
            date: new Date(log.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            intensity: log.intensity,
            mood: log.mood,
            fullDate: new Date(log.created_at).toLocaleDateString()
        }))

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis 
                    dataKey="date" 
                    stroke="#9ca3af" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                />
                <YAxis 
                    stroke="#9ca3af" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 10]}
                    width={30}
                />
                <Tooltip
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            const d = payload[0].payload;
                            return (
                                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-xl text-sm">
                                    <p className="font-bold text-gray-900 border-b pb-1 mb-1">{d.fullDate}</p>
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="capitalize text-gray-600">{d.mood}</span>
                                        <span className="font-bold text-primary">{d.intensity}/10</span>
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    }}
                />
                <Line
                    type="monotone"
                    dataKey="intensity"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 6, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
                    animationDuration={1500}
                />
            </LineChart>
        </ResponsiveContainer>
    )
}
