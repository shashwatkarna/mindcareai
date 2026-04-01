import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "AI Mood Tracker & Journaling Features - Top AI Mental Health Tools",
    description: "Discover the best AI mood tracking tools, secure journaling features, and clinical assessments that make MindCare AI one of the top apps for mental health.",
    keywords: ["AI mood tracking tool", "best AI therapy apps", "secure mental health features", "clinical PHQ-9 GAD-7 tracking"],
    alternates: {
        canonical: "/features",
    },
}

export default function FeaturesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
