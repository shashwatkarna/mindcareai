"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, BookOpen, Video, Headphones, Phone, ExternalLink, Heart, Brain, Moon, Sun, Coffee, Users, ShieldAlert } from "lucide-react"
import Link from "next/link"

// Resource Data
const RESOURCES = [
    // CRISIS & SUPPORT
    {
        id: "c1",
        title: "Suicide & Crisis Lifeline (988)",
        description: "24/7, free and confidential support for people in distress, prevention and crisis resources.",
        category: "Crisis",
        type: "Helpline",
        link: "tel:988",
        readTime: "Immediate",
        icon: Phone
    },
    {
        id: "c2",
        title: "Crisis Text Line",
        description: "Text HOME to 741741 to connect with a Crisis Counselor. Free 24/7 support at your fingertips.",
        category: "Crisis",
        type: "Text Service",
        link: "sms:741741",
        readTime: "Immediate",
        icon: ShieldAlert
    },
    {
        id: "c3",
        title: "The Trevor Project",
        description: "Crisis intervention and suicide prevention services to lesbian, gay, bisexual, transgender, queer & questioning (LGBTQ) young people.",
        category: "Crisis",
        type: "Support",
        link: "https://www.thetrevorproject.org/",
        readTime: "24/7",
        icon: Heart
    },

    // ANXIETY
    {
        id: "a1",
        title: "5-4-3-2-1 Grounding Technique",
        description: "A simple yet powerful method to regain control when anxiety or panic strikes by engaging your five senses.",
        category: "Anxiety",
        type: "Technique",
        link: "https://www.mayoclinic.org/diseases-conditions/anxiety/diagnosis-treatment/drc-20350967",
        readTime: "5 min read",
        icon: Brain
    },
    {
        id: "a2",
        title: "Box Breathing Guide",
        description: "Regulate your nervous system with this Navy SEAL approved breathing technique (4-4-4-4 pattern).",
        category: "Anxiety",
        type: "Guide",
        link: "https://www.healthline.com/health/box-breathing",
        readTime: "3 min practice",
        icon: BookOpen
    },
    {
        id: "a3",
        title: "Understanding Panic Attacks",
        description: "Learn the physiological signs of a panic attack and why they happen, to reduce the fear of the unknown.",
        category: "Anxiety",
        type: "Article",
        link: "https://adaa.org/understanding-anxiety/panic-disorder-agoraphobia/symptoms",
        readTime: "8 min read",
        icon: BookOpen
    },

    // DEPRESSION
    {
        id: "d1",
        title: "Behavioral Activation 101",
        description: "One of the most effective CBT skills for depression: doing things even when you don't 'feel' like it to boost mood.",
        category: "Depression",
        type: "Technique",
        link: "https://www.verywellmind.com/increasing-the-effectiveness-of-behavioral-activation-2797597",
        readTime: "10 min read",
        icon: Brain
    },
    {
        id: "d2",
        title: "Dealing with Negative Self-Talk",
        description: "Strategies to identify and challenge the inner critic that fuels depressive thoughts.",
        category: "Depression",
        type: "Article",
        link: "https://www.psychologytoday.com/us/basics/self-talk",
        readTime: "7 min read",
        icon: BookOpen
    },
    {
        id: "d3",
        title: "The Importance of Routine",
        description: "Why structure is vital for mental health recovery and how to build a gentle daily routine.",
        category: "Depression",
        type: "Guide",
        link: "https://www.nm.org/healthbeat/healthy-tips/health-benefits-of-having-a-routine",
        readTime: "6 min read",
        icon: Sun
    },

    // SLEEP
    {
        id: "s1",
        title: "Sleep Hygiene Checklist",
        description: "10 science-backed habits to improve your sleep quality starting tonight.",
        category: "Sleep",
        type: "Checklist",
        link: "https://www.sleepfoundation.org/sleep-hygiene",
        readTime: "4 min read",
        icon: Moon
    },
    {
        id: "s2",
        title: "Progressive Muscle Relaxation",
        description: "A guided audio exercise to release physical tension from your body to prepare for sleep.",
        category: "Sleep",
        type: "Audio",
        link: "https://www.uofmhealth.org/health-library/uz2225",
        readTime: "15 min listen",
        icon: Headphones
    },
    {
        id: "s3",
        title: "CBT-I: Insomnia Basics",
        description: "Introduction to Cognitive Behavioral Therapy for Insomnia, the gold standard for treating sleep issues.",
        category: "Sleep",
        type: "Article",
        link: "https://www.mayoclinic.org/diseases-conditions/insomnia/in-depth/insomnia-treatment/art-20046677",
        readTime: "12 min read",
        icon: BookOpen
    },

    // MINDFULNESS
    {
        id: "m1",
        title: "Mindfulness 101",
        description: "What is mindfulness? A beginners guide to being present in the moment without judgment.",
        category: "Mindfulness",
        type: "Guide",
        link: "https://www.mindful.org/what-is-mindfulness/",
        readTime: "6 min read",
        icon: Brain
    },
    {
        id: "m2",
        title: "3-Minute Body Scan",
        description: "A quick mindfulness practice you can do at your desk to reset your mind.",
        category: "Mindfulness",
        type: "Audio",
        link: "https://www.freetheself.com/3-minute-body-scan-meditation/",
        readTime: "3 min listen",
        icon: Headphones
    },

    // WORK & PRODUCTIVITY
    {
        id: "w1",
        title: "The Pomodoro Technique",
        description: "Avoid burnout by working in focused 25-minute intervals with breaks.",
        category: "Work",
        type: "Technique",
        link: "https://todoist.com/productivity-methods/pomodoro-technique",
        readTime: "5 min read",
        icon: Coffee
    },
    {
        id: "w2",
        title: "Setting Boundaries at Work",
        description: "How to say 'no' effectively and protect your mental health in a professional environment.",
        category: "Work",
        type: "Guide",
        link: "https://hbr.org/2019/02/how-to-set-boundaries-at-work-when-youre-the-boss",
        readTime: "8 min read",
        icon: Users
    },
    {
        id: "w3",
        title: "Overcoming Imposter Syndrome",
        description: "Recognize your achievements and stop feeling like a fraud in your career.",
        category: "Work",
        type: "Article",
        link: "https://www.apa.org/gradpsych/2013/11/fraud",
        readTime: "7 min read",
        icon: BookOpen
    }
]

// Daily Tips Data matching Exercise Tools
const DAILY_TIPS = [
    {
        title: "Tip of the Day: The 'Pause' Button",
        description: "When you feel overwhelmed, visualizing a literal 'pause' button can help interrupt the stress response.",
        action: "Try 4-7-8 Breathing",
        toolId: "breathing"
    },
    {
        title: "Tip of the Day: Clear Your Mind",
        description: "Carrying too many worries? biologically, writing them down reduces brain activity linked to anxiety.",
        action: "Use the Worry Jar",
        toolId: "worry-jar"
    },
    {
        title: "Tip of the Day: Anchor Yourself",
        description: "Feeling scattered? Use your five senses to immediately ground yourself in the present moment.",
        action: "Start Grounding",
        toolId: "grounding"
    },
    {
        title: "Tip of the Day: Instant Relief",
        description: "Sometimes you just need a quick distraction to break a stress loop. Popping bubbles can actually help!",
        action: "Pop Stress Bubbles",
        toolId: "bubble-pop"
    },
    {
        title: "Tip of the Day: Release Tension",
        description: "Your body holds onto stress physically. A quick stretch can send a signal of safety to your brain.",
        action: "Do Desk Yoga",
        toolId: "yoga"
    },
    {
        title: "Tip of the Day: Positive Rewiring",
        description: "Combat negative self-talk by intentionally practicing positive affirmations today.",
        action: "Daily Affirmations",
        toolId: "affirmations"
    },
    {
        title: "Tip of the Day: Focus Flow",
        description: "Need to concentrate? Nature sounds can mask distracting noises and improve cognitive performance.",
        action: "Play Soundscapes",
        toolId: "soundscapes"
    }
]

const CATEGORIES = ["All", "Crisis", "Anxiety", "Depression", "Sleep", "Mindfulness", "Work"]

export default function ResourcesPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")

    // Get a stable daily tip based on the date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24)
    const dailyTip = DAILY_TIPS[dayOfYear % DAILY_TIPS.length]

    const filteredResources = RESOURCES.filter(resource => {
        const matchesCategory = selectedCategory === "All" || resource.category === selectedCategory
        const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Resources Library</h1>
                    <p className="text-muted-foreground mt-1 text-lg">Curated tools, guides, and support for your journey.</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search resources..."
                        className="pl-9 bg-background border-border focus:ring-primary/20"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Featured Banner (Dynamic based on category or default) */}
            {selectedCategory === "All" && !searchQuery && (
                <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-primary/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
                    <div className="p-4 bg-background rounded-full shadow-sm text-primary">
                        <SparklesIcon className="w-8 h-8" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-xl font-bold text-foreground">{dailyTip.title}</h3>
                        <p className="text-muted-foreground mt-2 max-w-2xl">
                            {dailyTip.description}
                        </p>
                    </div>
                    <Link href={`/dashboard/exercises?tool=${dailyTip.toolId}`}>
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap">
                            {dailyTip.action}
                        </Button>
                    </Link>
                </div>
            )}

            {/* Category Tabs */}
            <Tabs defaultValue="All" className="w-full" onValueChange={setSelectedCategory}>
                <TabsList className="flex flex-wrap h-auto p-1 bg-muted/50 gap-1 justify-start">
                    {CATEGORIES.map(category => (
                        <TabsTrigger
                            key={category}
                            value={category}
                            className="px-4 py-2 rounded-md data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                        >
                            {category}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.length > 0 ? (
                    filteredResources.map((resource) => (
                        <ResourceCard key={resource.id} resource={resource} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-medium">No resources found matching your criteria.</p>
                        <Button variant="link" onClick={() => { setSearchQuery(""); setSelectedCategory("All") }} className="mt-2 text-primary">
                            Clear filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

function ResourceCard({ resource }: { resource: any }) {
    const Icon = resource.icon || BookOpen
    const isCrisis = resource.category === "Crisis"

    return (
        <Card className={`group hover:shadow-lg transition-all duration-300 border-border bg-card flex flex-col ${isCrisis ? 'border-red-200 dark:border-red-900/30 bg-red-50/30 dark:bg-red-900/10' : ''}`}>
            <CardHeader>
                <div className="flex justify-between items-start mb-2">
                    <Badge variant={isCrisis ? "destructive" : "secondary"} className="mb-2">
                        {resource.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium bg-secondary/50 px-2 py-1 rounded-full">
                        <ClockIcon className="w-3 h-3" />
                        {resource.readTime}
                    </span>
                </div>
                <div className="flex gap-3 items-start">
                    <div className={`p-2 rounded-lg shrink-0 ${isCrisis ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'bg-primary/10 text-primary'}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-lg leading-snug text-foreground group-hover:text-primary transition-colors">
                        {resource.title}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="flex-1">
                <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                    {resource.description}
                </CardDescription>
            </CardContent>
            <CardFooter className="pt-0">
                {resource.link ? (
                    <Link href={resource.link} target={resource.link.startsWith("http") ? "_blank" : "_self"} className="w-full">
                        <Button variant={isCrisis ? "destructive" : "outline"} className="w-full gap-2">
                            {isCrisis ? "Get Help Now" : "View Resource"}
                            {resource.link.startsWith("http") && <ExternalLink className="w-3 h-3" />}
                        </Button>
                    </Link>
                ) : (
                    <Button variant="secondary" className="w-full" disabled>Coming Soon</Button>
                )}
            </CardFooter>
        </Card>
    )
}

function ClockIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}

function SparklesIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        </svg>
    )
}
