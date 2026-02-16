"use client"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturesSection } from "@/components/home/features-section"
import { HowItWorks } from "@/components/home/how-it-works"
import { PersonalityTest } from "@/components/home/personality-test"
import { Testimonials } from "@/components/home/testimonials"
import { FAQSection } from "@/components/home/faq-section"

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-[#0A0118] text-foreground font-sans selection:bg-purple-500/30">
      <Navbar home={true} />

      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <PersonalityTest />
        <Testimonials />
        <FAQSection />
      </main>

      <Footer home={true} />
    </div>
  )
}
