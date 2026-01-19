"use client"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Card } from "@/components/ui/card"

const features = [
    {
        title: "Mood Tracking",
        desc: "Log your daily moods and identify triggers with our intuitive tracking system. Visual charts help you spot patterns over weeks and months.",
        icon: "📊"
    },
    {
        title: "Secure Journaling",
        desc: "A private space to express your thoughts. Our encrypted journal includes daily prompts to help you reflect and grow.",
        icon: "📔"
    },
    {
        title: "Teletherapy Appointments",
        desc: "Connect with licensed therapists directly through the platform. Schedule video sessions that fit your life.",
        icon: "📅"
    },
    {
        title: "AI Wellness Companion",
        desc: "Get instant, 24/7 support for panic attacks, anxiety, or loneliness from our empathetic AI, trained on cognitive behavioral therapy principles.",
        icon: "🤖"
    },
    {
        title: "Clinical Assessments",
        desc: "Take standardized tests like the PHQ-9 and GAD-7 to clinically monitor the severity of depression and anxiety symptoms.",
        icon: "✅"
    },
    {
        title: "Resource Library",
        desc: "Access a curated library of articles, meditation guides, and videos to support your mental health education.",
        icon: "📚"
    }
]

export default function FeaturesPage() {
    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Navbar />
            <main className="flex-1 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center mb-20 animate-fade-in">
                        <h1 className="text-4xl font-bold mb-6 sm:text-5xl">Platform Features</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            A complete toolkit designed to support every aspect of your mental wellness journey.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((f, i) => (
                            <Card key={i} className="p-8 hover:shadow-lg transition-all duration-300 animate-slide-in-up"
                                style={{ animationDelay: `${i * 50}ms` }}>
                                <div className="text-4xl mb-6">{f.icon}</div>
                                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {f.desc}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
