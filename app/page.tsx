"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { PersonalityTest } from "@/components/home/personality-test"
import { FAQSection } from "@/components/home/faq-section"
import { Testimonials } from "@/components/home/testimonials"

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors duration-300 font-sans selection:bg-primary/20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-32 bg-[#EED9C4] dark:bg-transparent transition-colors duration-500">
        {/* Background blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl opacity-50 animate-float"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl opacity-50 animate-float [animation-delay:2s]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-slide-in-down">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Now available for everyone
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] animate-slide-in-up [animation-delay:100ms]">
              Mental Wellness, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Reimagined.</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed animate-slide-in-up [animation-delay:200ms]">
              Your secure, judgment-free space for mental health tracking.
              Powered by AI, designed for privacy, and built for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-slide-in-up [animation-delay:300ms]">
              <Link href="/auth/sign-up">
                <Button size="lg" className="h-12 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 group">
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="outline" size="lg" className="h-12 px-8 text-lg rounded-full hover:bg-muted/50 border-input transition-colors duration-300">
                  See How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Personality Test Section (New) */}
      <PersonalityTest />

      {/* Features Grid */}
      <section className="py-24 bg-[#F4E7D9] dark:bg-muted/10 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Complete Mental Health Toolset</h2>
            <p className="text-xl text-muted-foreground">Everything you need to understand and improve your well-being</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: "📊", title: "Smart Mood Tracking", desc: "Visualize emotional patterns over time with intuitive charts." },
              { icon: "📔", title: "Private Journaling", desc: "Securely record your thoughts with daily prompts." },
              { icon: "✅", title: "Clinical Assessments", desc: "Standardized tests (PHQ-9, GAD-7) to monitor progress." },
              { icon: "📅", title: "Easy Scheduling", desc: "Book appointments with therapists directly in-app." },
              { icon: "🤖", title: "24/7 AI Companion", desc: "Instant support and coping strategies whenever you need them." },
              { icon: "📚", title: "Curated Resources", desc: "Expert articles and guides for your mental health journey." },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slide-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits / Split Section */}
      <section className="py-24 bg-[#F8EDE3] dark:bg-transparent transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-slide-in-up">
              <h2 className="text-4xl font-bold tracking-tight">Why Choose MindCare AI?</h2>
              <div className="space-y-6">
                {[
                  "End-to-end encryption for complete privacy",
                  "AI-driven insights tailored to your data",
                  "Seamless connection with mental health professionals",
                  "Accessible anywhere, anytime, on any device"
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="mt-1 w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-lg text-foreground/80">{item}</p>
                  </div>
                ))}
              </div>
              <Link href="/about">
                <Button size="lg" variant="secondary" className="mt-4 rounded-full px-8">
                  Learn About Our Mission
                </Button>
              </Link>
            </div>

            <div className="relative animate-float">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-accent/30 rounded-[2rem] blur-2xl transform rotate-3"></div>
              <div className="relative bg-card border border-border rounded-[2rem] p-8 shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-full bg-muted animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                    <div className="h-3 w-20 bg-muted rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 w-full bg-muted rounded animate-pulse"></div>
                  <div className="h-3 w-5/6 bg-muted rounded animate-pulse"></div>
                  <div className="h-3 w-4/6 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="mt-8 flex gap-4">
                  <div className="h-24 w-1/3 bg-primary/10 rounded-xl animate-pulse"></div>
                  <div className="h-24 w-1/3 bg-secondary/10 rounded-xl animate-pulse delay-75"></div>
                  <div className="h-24 w-1/3 bg-accent/10 rounded-xl animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section (New) */}
      <FAQSection />

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-24 border-t border-border animate-fade-in bg-[#FEFAF8] dark:bg-primary/5 transition-colors duration-500">
        <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Start Your Journey Today</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands who have taken control of their mental health with MindCare AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 rounded-full bg-primary hover:bg-primary/90 text-white">
                Create Your Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
