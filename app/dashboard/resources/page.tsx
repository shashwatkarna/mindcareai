import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
    title: "Resources - MindCare AI",
    description: "Mental health resources and articles",
}

export default async function ResourcesPage() {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("mindcare_session")?.value

    if (!sessionToken) {
        redirect("/auth/login")
    }

    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
        cookies: {
            getAll() {
                return cookieStore.getAll()
            },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
                } catch {
                    // Handle errors during cookie setting
                }
            },
        },
    })

    // Safe decoding of base64 token
    let userId
    try {
        const decoded = Buffer.from(sessionToken, "base64").toString()
        userId = decoded.split(":")[0]
    } catch (e) {
        redirect("/auth/login")
    }

    if (!userId) {
        redirect("/auth/login")
    }

    const { data: user } = await supabase.from("users").select("*").eq("id", userId).single()

    if (!user) {
        redirect("/auth/login")
    }

    // Placeholder resources data
    const resources = [
        {
            title: "Understanding Anxiety",
            description: "Learn about the symptoms, causes, and coping strategies for anxiety.",
            type: "Article",
            readTime: "5 min read",
        },
        {
            title: "Meditation for Beginners",
            description: "A simple guide to starting your meditation practice today.",
            type: "Guide",
            readTime: "10 min read",
        },
        {
            title: "Sleep Hygiene Tips",
            description: "Improve your sleep quality with these proven habits and changes.",
            type: "Article",
            readTime: "7 min read",
        },
        {
            title: "Managing Stress at Work",
            description: "Practical advice for maintaining work-life balance and reducing stress.",
            type: "Article",
            readTime: "6 min read",
        },
        {
            title: "Crisis Helplines",
            description: "Important numbers and contacts for immediate support.",
            type: "Contacts",
            readTime: "Reference",
        }
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-[#3d3d3d]">Resources</h1>
                <p className="text-[#6b6b6b] mt-1">Helpful articles, guides, and tools for your wellness journey</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource, index) => (
                    <Card key={index} className="bg-white border-[#e0d9d3] hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                                <span className="inline-flex items-center rounded-full bg-[#f5f3f0] px-2.5 py-0.5 text-xs font-semibold text-[#8b7355]">
                                    {resource.type}
                                </span>
                                <span className="text-xs text-[#9ca3af]">{resource.readTime}</span>
                            </div>
                            <CardTitle className="text-[#3d3d3d]">{resource.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-[#6b6b6b] mb-4">
                                {resource.description}
                            </CardDescription>
                            <Button variant="outline" className="w-full border-[#8b7355] text-[#8b7355] hover:bg-[#8b7355] hover:text-white">
                                Read More
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
