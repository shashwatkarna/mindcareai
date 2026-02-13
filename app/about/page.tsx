"use client"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
// HiddenLotus removed

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Navbar />
            <main className="flex-1 bg-background">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="space-y-6 text-center mb-16 animate-fade-in relative">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Our Mission</h1>
                        <p className="text-xl text-muted-foreground flex items-center justify-center gap-2">
                            Democratizing mental health access through technology, privacy, and compassion.

                        </p>
                    </div>

                    <div className="prose prose-lg dark:prose-invert mx-auto space-y-12">
                        <section className="animate-slide-in-up">
                            <h2 className="text-3xl font-bold mb-6">The Story of MindCare AI</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                MindCare AI was born from a simple observation: mental health support is often inaccessible,
                                expensive, or intimidating. We wanted to create a safe harbor—a digital space where anyone
                                could track their well-being without fear of judgment.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                What started as a simple mood tracker has evolved into a comprehensive platform
                                connecting users with AI-driven insights, professional therapy, and validated clinical tools.
                            </p>
                        </section>

                        <section className="animate-slide-in-up [animation-delay:100ms]">
                            <h2 className="text-3xl font-bold mb-6">Our Core Values</h2>
                            <div className="grid sm:grid-cols-2 gap-8 not-prose">
                                <div className="p-6 rounded-xl bg-primary/5 border border-primary/10">
                                    <h3 className="font-bold text-xl mb-2 text-primary">Privacy First</h3>
                                    <p className="text-muted-foreground">Your thoughts belong to you. We use military-grade encryption to ensure your data never leaves your control.</p>
                                </div>
                                <div className="p-6 rounded-xl bg-secondary/5 border border-secondary/10">
                                    <h3 className="font-bold text-xl mb-2 text-secondary">Accessibility</h3>
                                    <p className="text-muted-foreground">Mental health tools should be available to everyone, regardless of their location or income.</p>
                                </div>
                                <div className="p-6 rounded-xl bg-accent/5 border border-accent/10">
                                    <h3 className="font-bold text-xl mb-2 text-accent">Compassion</h3>
                                    <p className="text-muted-foreground">We design every interaction with empathy, recognizing the courage it takes to seek help.</p>
                                </div>
                                <div className="p-6 rounded-xl bg-muted/50 border border-border">
                                    <h3 className="font-bold text-xl mb-2">Innovation</h3>
                                    <p className="text-muted-foreground">Leveraging the latest in AI and psychology to provide real-time, personalized support.</p>
                                </div>
                            </div>
                        </section>

                        <section className="animate-slide-in-up [animation-delay:200ms] not-prose">
                            <h2 className="text-3xl font-bold mb-8 text-center sm:text-left">Meet Our Team</h2>
                            <div className="grid md:grid-cols-3 gap-8">
                                {[
                                    {
                                        name: "Shashwat Karna",
                                        role: "CEO",
                                        image: "https://github.com/shadcn.png", // Placeholder
                                        linkedin: "#",
                                        github: "#"
                                    },
                                    {
                                        name: "Jyoti Sutradhar",
                                        role: "CEO",
                                        image: "https://github.com/shadcn.png", // Placeholder
                                        linkedin: "#",
                                        github: "#"
                                    },
                                    {
                                        name: "Manjul Sharma",
                                        role: "CEO",
                                        image: "https://github.com/shadcn.png", // Placeholder
                                        linkedin: "#",
                                        github: "#"
                                    }
                                ].map((member) => (
                                    <div key={member.name} className="flex flex-col items-center text-center p-6 border border-border rounded-xl bg-card shadow-sm hover:shadow-md transition-all group">
                                        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-primary/10 group-hover:border-primary transition-colors">
                                            {/* Using generic avatar placeholder since realistic photos aren't available */}
                                            <img src={`https://ui-avatars.com/api/?name=${member.name.replace(" ", "+")}&background=random`} alt={member.name} className="w-full h-full object-cover" />
                                        </div>
                                        <h3 className="text-lg font-bold text-foreground">{member.name}</h3>
                                        <p className="text-sm text-primary font-medium mb-4">{member.role}</p>
                                        <div className="flex gap-4">
                                            <a href={member.linkedin} className="text-muted-foreground hover:text-primary transition-colors">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                                            </a>
                                            <a href={member.github} className="text-muted-foreground hover:text-primary transition-colors">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
