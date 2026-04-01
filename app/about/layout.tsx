import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Our Mission | MindCare AI - Top Apps for Mental Health",
    description: "Learn how MindCare AI is democratizing mental health access. Our mission is to provide secure, AI-powered tools for everyone, from mood tracking to clinical assessments.",
    keywords: ["MindCare AI story", "mental health mission", "top apps for mental health", "private mental health support team"],
    alternates: {
        canonical: "/about",
    },
}

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
