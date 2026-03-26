"use client"

import { useEffect, useState } from "react"

export function Greeting({ name }: { name: string }) {
    const [greeting, setGreeting] = useState("Welcome back")

    useEffect(() => {
        const hour = new Date().getHours()
        if (hour >= 5 && hour < 12) setGreeting("Good Morning")
        else if (hour >= 12 && hour < 17) setGreeting("Good Afternoon")
        else if (hour >= 17 && hour < 21) setGreeting("Good Evening")
        else if (hour >= 21 || hour < 4) setGreeting("Good Night")
        else if (hour === 4) setGreeting("Up early! Good Morning")
        else setGreeting("Welcome back")
    }, [])

    return (
        <span>{greeting}, {name}</span>
    )
}
