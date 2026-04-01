import { GoogleAnalytics } from "@next/third-parties/google"
import Clarity from "@/components/clarity"
import type React from "react"
import type { Metadata } from "next"
import { Outfit, Audiowide } from "next/font/google"
import Script from "next/script"
import { ThemeProvider } from "@/components/theme-provider"
import { CookieConsent } from "@/components/layout/cookie-consent"
import { BackToTop } from "@/components/ui/back-to-top"
import "./globals.css"

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

const audiowide = Audiowide({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-audiowide",
  display: "swap",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://itsmindcareai.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "MindCare AI",
  title: {
    default: "MindCare AI | AI Mental Health & Wellness Tracker",
    template: "%s | MindCare AI"
  },
  alternates: {
    canonical: siteUrl,
  },
  description: "Transform your wellness journey with MindCare AI. Experience secure, AI-powered mood tracking, private journaling, and personalized clinical insights.",
  keywords: [
    "MindCare AI",
    "top mental health apps",
    "ai tool for mood tracking",
    "best ai therapy apps 2026",
    "private ai therapist",
    "mental health tracker",
    "personalized ai mental health",
    "mental wellness app",
    "mood tracking app",
    "ai mental health assistant",
    "secure wellness journaling",
    "mental health analytics",
    "anxiety and depression tracker",
    "telehealth appointments",
    "mindfulness ai",
    "clinical mental health assessments"
  ],
  authors: [{ name: "MindCare AI Team" }],
  creator: "MindCare AI",
  publisher: "MindCare AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "MindCare AI | AI Mental Health & Wellness Tracker",
    description: "Transform your wellness journey with MindCare AI. Experience secure, AI-powered mood tracking, private journaling, and personalized clinical insights.",
    siteName: "MindCare AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MindCare AI Official Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MindCare AI | AI Mental Health & Wellness Tracker",
    description: "Transform your wellness journey with MindCare AI. Experience secure, AI-powered mood tracking, private journaling, and personalized clinical insights.",
    creator: "@MindCareAI",
    images: ["/og-image.png"],
  },
  other: {
    "og:logo": `${siteUrl}/logo.png`,
  },
  verification: {
    google: "lEKd39QapkV0CqMIQBz9Ijnqw4tSdB7QmQ3E3-CIToA",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/favicon-32x32.png",
        type: "image/png",
      },
      {
        url: "/favicon-16x16.png",
        type: "image/png",
      },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://itsmindcareai.vercel.app'}/#website`,
        "url": process.env.NEXT_PUBLIC_SITE_URL || 'https://itsmindcareai.vercel.app',
        "name": "MindCare AI",
        "publisher": {
          "@id": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://itsmindcareai.vercel.app'}/#organization`
        }
      },
      {
        "@type": "Organization",
        "@id": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://itsmindcareai.vercel.app'}/#organization`,
        "name": "MindCare AI",
        "url": process.env.NEXT_PUBLIC_SITE_URL || 'https://itsmindcareai.vercel.app',
        "logo": {
          "@type": "ImageObject",
          "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://itsmindcareai.vercel.app'}/logo.png`
        },
        "description": "AI-powered mental health and wellness platform providing private mood tracking, journaling, and mental health support.",
        "sameAs": [
          "https://twitter.com/MindCareAI",
          "https://linkedin.com/company/mindcare-ai"
        ]
      },
      {
        "@type": "WebApplication",
        "name": "MindCare AI",
        "url": process.env.NEXT_PUBLIC_SITE_URL || 'https://itsmindcareai.vercel.app',
        "description": "Transform your mental wellness journey with AI-powered mood tracking, private journaling, and personalized mental health insights.",
        "applicationCategory": "HealthApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "AI Mood Tracking",
          "Private Secure Journaling",
          "Standardized Clinical Assessments (PHQ-9, GAD-7)",
          "Personalized AI Wellness Insights",
          "Secure Telehealth Appointment Scheduling",
          "24/7 Emotional Support Chatbot"
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What are the top apps for mental health in 2026?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "MindCare AI is a leading mental health platform that combines AI-driven mood tracking, secure journaling, and clinical assessments into one private application."
            }
          },
          {
            "@type": "Question",
            "name": "How does an AI tool for mood tracking work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our AI mood tracking tool analyzes your daily entries and physiological markers to provide deep insights into your emotional patterns and triggers, helping you achieve better mental balance."
            }
          },
          {
            "@type": "Question",
            "name": "Is my data private on MindCare AI?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, we use end-to-end encryption and are HIPAA-ready to ensure that your mental health data remains exclusively yours and accessible only to you."
            }
          }
        ]
      }
    ]
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to Google Fonts CDN to reduce font load latency */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className={`${outfit.className} ${audiowide.variable} antialiased`}>
        <div style={{ display: 'none' }} dangerouslySetInnerHTML={{ __html: `<!--\n  So you came here do you wanna know a secret, analyze this website properly you'll find it\n  Once again Thank you for visiting us give us a star on our github repo\n-->` }} />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
        <CookieConsent />
        <Clarity />
        <BackToTop />
      </body>
    </html>
  )
}
