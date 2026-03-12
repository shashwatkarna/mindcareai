
import { Suspense, lazy } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/home/hero-section"

// Lazy-load below-the-fold sections — defers their JS until the user scrolls
const FeaturesSection = lazy(() => import("@/components/home/features-section").then(m => ({ default: m.FeaturesSection })))
const HowItWorks = lazy(() => import("@/components/home/how-it-works").then(m => ({ default: m.HowItWorks })))
const PersonalityTest = lazy(() => import("@/components/home/personality-test").then(m => ({ default: m.PersonalityTest })))
const Testimonials = lazy(() => import("@/components/home/testimonials").then(m => ({ default: m.Testimonials })))
const FAQSection = lazy(() => import("@/components/home/faq-section").then(m => ({ default: m.FAQSection })))

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-[#0A0118] text-foreground font-sans selection:bg-purple-500/30">
      <Navbar home={true} />

      <main>
        {/* Hero is above the fold — eager load */}
        <HeroSection />

        {/* All sections below the fold — lazy loaded */}
        <Suspense fallback={null}>
          <FeaturesSection />
          <HowItWorks />
          <PersonalityTest />
          <Testimonials />
          <FAQSection />
        </Suspense>
      </main>

      <Footer home={true} />
    </div>
  )
}
