"use client"

import { Card } from "@/components/ui/card"

const testimonials = [
    {
        name: "Aman Kumar Singh",
        role: "Senior Developer",
        company: "TechFlow Solutions",
        content: "MindCare AI has completely transformed how I manage my work-life balance. The mood tracking insights are incredibly accurate.",
    },
    {
        name: "Nitesh Kumar Mishra",
        role: "Product Manager",
        company: "InnovateX",
        content: "I was skeptical about AI therapy at first, but the 24/7 availability and empathetic responses have been a lifesaver during stressful launches.",
    },
    {
        name: "Aryan Pathak",
        role: "UX Designer",
        company: "Creative Studio",
        content: "The design is beautiful and calming. It's the only app that actually makes me want to journal every day. Highly recommended!",
    },
    {
        name: "Adarsh Kumar Thakur",
        role: "Data Scientist",
        company: "FinTech Corp",
        content: "As someone who loves data, seeing my emotional trends visualized helped me understand my triggers better than generic advice ever could.",
    },
    {
        name: "Aditya Om",
        role: "Marketing Lead",
        company: "GrowthHackerz",
        content: "Finally, a mental health tool that feels personal. The personality test was spot on and the daily quotes keep me motivated.",
    },
    {
        name: "Raghuvendra Pratap Singh",
        role: "HR Director",
        company: "Global Systems",
        content: "We've started recommending MindCare to our employees. It's a private, secure, and effective way to support mental well-being.",
    },
    {
        name: "Priya Sharma",
        role: "Freelance Writer",
        company: "Self-Employed",
        content: "The guided meditation tracks are pure gold. I use the focus exercises before every writing session now.",
    },
    {
        name: "Rahul Verma",
        role: "Student",
        company: "University of Delhi",
        content: "Exam stress used to paralyze me. The anxiety, assessments and coping strategies here have really helped me stay grounded.",
    },
    {
        name: "Sneha Gupta",
        role: "Architect",
        company: "Urban Designs",
        content: "I love how secure it feels. knowing my journal entries are encrypted gives me the freedom to be truly honest with myself.",
    },
]

export function Testimonials() {
    return (
        <section className="py-24 bg-[#0A0118] overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1),transparent_70%)]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center relative z-10">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-white">Trusted by Thousands</h2>
                <p className="text-xl text-gray-400">
                    See what our community has to say about their journey with MindCare AI.
                </p>
            </div>

            <div className="relative flex w-full flex-col items-center justify-center overflow-hidden z-10">
                {/* Gradient Masks */}
                <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-[#0A0118] to-transparent"></div>
                <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-[#0A0118] to-transparent"></div>

                <div className="flex w-full overflow-hidden py-4">
                    <div className="flex min-w-full shrink-0 gap-6 animate-scroll hover:[animation-play-state:paused] pl-6">
                        {/* First Set */}
                        {testimonials.map((testimonial, i) => (
                            <TestimonialCard key={i} {...testimonial} />
                        ))}
                        {/* Duplicate Set for Seamless Loop */}
                        {testimonials.map((testimonial, i) => (
                            <TestimonialCard key={`dup-${i}`} {...testimonial} ariaHidden={true} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

function TestimonialCard({ name, role, company, content, ariaHidden }: { name: string; role: string; company: string; content: string, ariaHidden?: boolean }) {
    return (
        <Card className="w-[350px] shrink-0 p-6 border-white/10 bg-[#140b2e] hover:border-purple-500/30 transition-colors shadow-xl" aria-hidden={ariaHidden}>
            <div className="flex items-start gap-4 mb-4">
                <div className="rounded-full overflow-hidden border border-white/10 w-12 h-12 shrink-0 ring-2 ring-purple-500/20">
                    <img
                        src={`https://ui-avatars.com/api/?name=${name.replace(" ", "+")}&background=random`}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <p className="font-semibold text-sm text-white m-0">{name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{role} at {company}</p>
                </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed italic">"{content}"</p>
        </Card>
    )
}
