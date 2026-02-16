"use client"

import { useEffect, useState } from "react"
import { Users } from "lucide-react"

export function VisitorCounter() {
    const [visits, setVisits] = useState<number | null>(null)

    useEffect(() => {
        // Increment on mount
        const increment = async () => {
            try {
                // Check if already visited in session storage to avoid double counting on reload?
                const hasVisited = sessionStorage.getItem("hasVisited")

                let res
                if (!hasVisited) {
                    res = await fetch("/api/visitor", { method: "POST" })
                    sessionStorage.setItem("hasVisited", "true")
                } else {
                    res = await fetch("/api/visitor", { method: "GET" })
                }

                if (res.ok) {
                    const data = await res.json()
                    setVisits(data.visits)
                }
            } catch (error) {
                console.error("Failed to fetch visits")
            }
        }
        increment()
    }, [])

    if (visits === null) return null

    return (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 backdrop-blur-sm">
            <Users className="w-3 h-3" />
            <span>
                <span className="font-mono font-medium text-white">{visits.toLocaleString()}</span> visitors
            </span>
        </div>
    )
}
