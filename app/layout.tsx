import { GoogleAnalytics } from "@next/third-parties/google"
import Clarity from "@/components/clarity"
import type React from "react"
import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const outfit = Outfit({ subsets: ["latin"] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://itsmindcareai.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MindCare AI - Your Private Mental Health & Wellness Companion",
    template: "%s | MindCare AI"
  },
  description: "Transform your mental wellness journey with MindCare AI. Track moods, journal privately, access AI-powered insights, and take mental health assessments. Your secure, judgment-free space for mental health support.",
  keywords: [
    "MindCare AI",
    "mental health tracker",
    "mental wellness app",
    "mood tracking",
    "AI mental health assistant",
    "private mental health support",
    "mental health journal",
    "anxiety tracker",
    "depression support",
    "mental health assessment",
    "wellness tracking",
    "self-care app",
    "mental health tools",
    "therapy support",
    "emotional wellness"
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
    title: "MindCare AI - Your Private Mental Health & Wellness Companion",
    description: "Transform your mental wellness journey with AI-powered mood tracking, private journaling, and personalized mental health insights. Secure, private, and built for you.",
    siteName: "MindCare AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MindCare AI - Mental Health & Wellness Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MindCare AI - Your Private Mental Health & Wellness Companion",
    description: "Transform your mental wellness journey with AI-powered mood tracking, private journaling, and personalized mental health insights.",
    images: ["/og-image.png"],
    creator: "@MindCareAI",
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
          "Mood Tracking",
          "Private Journaling",
          "Mental Health Assessments",
          "AI-Powered Insights",
          "Appointment Scheduling",
          "Wellness Resources"
        ]
      }
    ]
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${outfit.className} antialiased`}>
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
        <Clarity />
      </body>
    </html>
  )
}
