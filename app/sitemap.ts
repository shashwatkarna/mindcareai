import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://itsmindcareai.vercel.app'
    
    const routes = [
        '',
        '/about',
        '/features',
        '/pricing',
        '/for-therapists',
        '/privacy',
        '/terms',
        '/cookies',
        '/careers',
        '/dashboard',
        '/dashboard/mood',
        '/dashboard/journal',
        '/dashboard/exercises',
        '/dashboard/assessments',
        '/dashboard/appointments',
        '/dashboard/profile',
        '/auth/login',
        '/auth/sign-up',
    ]

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly' as any,
        priority: route === '' ? 1 : 0.8,
    }))
}
