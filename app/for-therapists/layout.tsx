import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "AI Tools for Mental Health Professionals | MindCare AI",
    description: "Join MindCare AI as a licensed therapist. Empower your practice with our clinical AI tools, patient mood analytics, and HIPAA-compliant communication.",
    keywords: ["AI mental health tools for professionals", "therapist mental health platform", "clinical mood tracking software", "secure patient portal for therapists"],
    alternates: {
        canonical: "/for-therapists",
    },
}

export default function TherapistsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
