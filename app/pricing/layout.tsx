import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Affordable AI Mental Health Support Pricing | MindCare AI",
    description: "View our flexible pricing plans for AI mood tracking, counseling, and premium mental wellness tools that make quality care accessible.",
    keywords: ["affordable AI therapy subscription", "mental health app pricing", "MindCare premium plans", "personalized mental wellness cost"],
    alternates: {
        canonical: "/pricing",
    },
}

export default function PricingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
