import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle2, AlertTriangle, Info } from "lucide-react"

export const metadata = {
    title: "Assessment Results - MindCare AI",
    description: "Your assessment results",
}

export default async function AssessmentResultPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("mindcare_session")?.value

    if (!sessionToken) {
        redirect("/auth/login")
    }

    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
        cookies: {
            getAll() { return cookieStore.getAll() },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
                } catch { }
            },
        },
    })

    // Auth Check
    let userId
    try {
        const decoded = Buffer.from(sessionToken, "base64").toString()
        userId = decoded.split(":")[0]
    } catch (e) {
        redirect("/auth/login")
    }

    if (!userId) redirect("/auth/login")

    const { data: assessment, error } = await supabase
        .from("assessments")
        .select("*")
        .eq("id", id)
        .single()

    if (error || !assessment) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold">Assessment Not Found</h1>
                <Link href="/dashboard/assessments" className="text-primary hover:underline mt-4 block">
                    Return to Assessments
                </Link>
            </div>
        )
    }

    // Interpretations (Mock Logic - ideally stored or helper function)
    const getFeedback = (type: string, risk: string) => {
        if (risk === "high") return {
            title: "Action Recommended",
            description: "Your score suggests significant symptoms. It is highly recommended to speak with a mental health professional.",
            color: "text-red-600",
            bg: "bg-red-50 dark:bg-red-900/20",
            border: "border-red-200 dark:border-red-800"
        }
        if (risk === "moderate") return {
            title: "Monitor Closely",
            description: "Your score indicates mild to moderate symptoms. Consider self-care strategies and monitoring your mood.",
            color: "text-yellow-600",
            bg: "bg-yellow-50 dark:bg-yellow-900/20",
            border: "border-yellow-200 dark:border-yellow-800"
        }
        return {
            title: "Healthy Range",
            description: "Your score is within the range of minimal symptoms. Keep up your healthy habits!",
            color: "text-green-600",
            bg: "bg-green-50 dark:bg-green-900/20",
            border: "border-green-200 dark:border-green-800"
        }
    }

    const feedback = getFeedback(assessment.assessment_type, assessment.risk_level || "low")

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <Link href="/dashboard/assessments">
                <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-primary">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Assessments
                </Button>
            </Link>

            <div className="space-y-8">
                <div className="text-center space-y-2">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        {new Date(assessment.created_at).toLocaleDateString()}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-bold capitalize">{assessment.assessment_type} Result</h1>
                </div>

                <Card className={`border-2 ${feedback.border} shadow-lg overflow-hidden`}>
                    <div className={`${feedback.bg} p-8 text-center space-y-4`}>
                        <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-background rounded-full shadow-sm mb-2">
                            {assessment.risk_level === "high" ? <AlertTriangle className={`w-8 h-8 ${feedback.color}`} /> :
                                assessment.risk_level === "moderate" ? <Info className={`w-8 h-8 ${feedback.color}`} /> :
                                    <CheckCircle2 className={`w-8 h-8 ${feedback.color}`} />
                            }
                        </div>
                        <div>
                            <h2 className={`text-2xl font-bold ${feedback.color}`}>{feedback.title}</h2>
                            <p className="text-muted-foreground max-w-lg mx-auto mt-2">{feedback.description}</p>
                        </div>
                    </div>
                    <CardContent className="p-8 space-y-8">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span>Score</span>
                                <span>{assessment.score}/100</span>
                            </div>
                            <Progress value={assessment.score || 0} className="h-4" />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="bg-secondary/20 border-none">
                                <CardHeader>
                                    <CardTitle className="text-lg">What next?</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                                        <li>Review your daily habits using the Journal.</li>
                                        <li>Try a relaxation exercise from the Exercises tab.</li>
                                        <li>Schedule a follow-up assessment in 2 weeks.</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="bg-primary/5 border-none">
                                <CardHeader>
                                    <CardTitle className="text-lg">Need Support?</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        If you feel overwhelmed, our AI Chatbot is here to listen 24/7.
                                    </p>
                                    <Link href="/dashboard/chatbot">
                                        <Button className="w-full">Chat with MindCare AI</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
