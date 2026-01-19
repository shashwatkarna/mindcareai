import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import Link from "next/link"
import { Lock, Play, Wind, Music, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default async function ExercisesPage() {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("mindcare_session")?.value

    if (!sessionToken) redirect("/auth/login")

    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
        cookies: { getAll: () => cookieStore.getAll(), setAll: () => { } },
    })

    // Decode user ID (simple decode, robust verification handled in middleware mostly)
    let userId
    try {
        userId = Buffer.from(sessionToken, "base64").toString().split(":")[0]
    } catch (e) {
        redirect("/auth/login")
    }

    // Fetch Premium Status
    const { data: profile } = await supabase.from("profiles").select("is_premium").eq("id", userId).single()
    const isPremium = profile?.is_premium

    // LOCKED STATE
    if (!isPremium) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-fade-in">
                <div className="bg-muted p-6 rounded-full mb-6 relative">
                    <Lock className="w-16 h-16 text-muted-foreground" />
                    <div className="absolute top-0 right-0 w-4 h-4 bg-primary rounded-full animate-ping"></div>
                </div>
                <h1 className="text-3xl font-bold mb-4">Premium Content Locked</h1>
                <p className="text-muted-foreground max-w-md mb-8">
                    This feature is available exclusively to MindCare Premium members.
                    Unlock personalized self-exercises, guided meditations, and more for just ₹1.
                </p>
                <Link href="/pricing">
                    <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all">
                        Unlock Now for ₹1
                    </Button>
                </Link>
            </div>
        )
    }

    // UNLOCKED STATE
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Self-Exercise Studio</h1>
                    <p className="text-muted-foreground mt-1">Premium guided activities for your mind.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    <Award className="w-4 h-4" /> Premium Active
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Breathing Exercise Card */}
                <Card className="p-0 overflow-hidden group hover:shadow-lg transition-all border-border">
                    <div className="h-40 bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                        <Wind className="w-16 h-16 text-blue-500" />
                    </div>
                    <div className="p-6">
                        <h3 className="text-xl font-bold mb-2">Deep Breathing</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                            Calm your nervous system with 4-7-8 rhythmic breathing techniques.
                        </p>
                        <Button className="w-full" variant="outline"><Play className="w-4 h-4 mr-2" /> Start Session</Button>
                    </div>
                </Card>

                {/* Meditation Card */}
                <Card className="p-0 overflow-hidden group hover:shadow-lg transition-all border-border">
                    <div className="h-40 bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                        <Music className="w-16 h-16 text-purple-500" />
                    </div>
                    <div className="p-6">
                        <h3 className="text-xl font-bold mb-2">Lo-Fi Focus</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                            Curated soundscapes to help you focus or drift off to sleep.
                        </p>
                        <Button className="w-full" variant="outline"><Play className="w-4 h-4 mr-2" /> Play Audio</Button>
                    </div>
                </Card>

                {/* Coming Soon Card */}
                <Card className="p-0 overflow-hidden border-border bg-muted/30">
                    <div className="h-40 flex items-center justify-center">
                        <span className="text-muted-foreground font-semibold">More Coming Soon</span>
                    </div>
                    <div className="p-6 opacity-60">
                        <h3 className="text-xl font-bold mb-2">Guided Journaling</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                            AI-powered prompts to deep dive into your emotions.
                        </p>
                        <Button disabled className="w-full">Coming Soon</Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}
