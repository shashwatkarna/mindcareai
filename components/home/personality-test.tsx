"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, RefreshCw, Sparkles } from "lucide-react"

// Large pool of questions to randomly select from
const questionPool = [
    // Energy / Social (I vs E)
    { id: 1, text: "It's Friday night. You are:", options: [{ label: "Curled up with a movie", type: "I" }, { label: "Out with friends", type: "E" }] },
    { id: 2, text: "You recharge your batteries by:", options: [{ label: "Spending time alone", type: "I" }, { label: "Being around people", type: "E" }] },
    { id: 3, text: "In a group conversation, you:", options: [{ label: "Listen more than speak", type: "I" }, { label: "Jump right in", type: "E" }] },
    { id: 4, text: "New social situations make you feel:", options: [{ label: "A bit drained", type: "I" }, { label: "Energized", type: "E" }] },

    // Information / Processing (S vs N - mapped to T/F for simplicity in this mini-game)
    { id: 5, text: "You focus more on:", options: [{ label: "Facts and details", type: "T" }, { label: "The big picture", type: "F" }] },
    { id: 6, text: "You trust:", options: [{ label: "Your experience", type: "T" }, { label: "Your gut instinct", type: "F" }] },
    { id: 7, text: "When learning something new, you prefer:", options: [{ label: "Step-by-step instructions", type: "T" }, { label: "Understanding the concept", type: "F" }] },

    // Decisions (T vs F)
    { id: 8, text: "When making a hard choice, you follow:", options: [{ label: "Your head (logic)", type: "T" }, { label: "Your heart (values)", type: "F" }] },
    { id: 9, text: "It is worse to be:", options: [{ label: "Illogical", type: "T" }, { label: "Unkind", type: "F" }] },
    { id: 10, text: "You are more likely to offer:", options: [{ label: "A practical solution", type: "T" }, { label: "Emotional support", type: "F" }] },

    // Structure (J vs P)
    { id: 11, text: "Your workspace is usually:", options: [{ label: "Tidy and organized", type: "J" }, { label: "Messy but functional", type: "P" }] },
    { id: 12, text: "You prefer to:", options: [{ label: "Stick to a plan", type: "J" }, { label: "Go with the flow", type: "P" }] },
    { id: 13, text: "Deadlines make you:", options: [{ label: "Start working immediately", type: "J" }, { label: "Work best at the last minute", type: "P" }] },
    { id: 14, text: "On vacation, you like:", options: [{ label: "A planned itinerary", type: "J" }, { label: "To explore spontaneously", type: "P" }] },
]

const archetypes: { [key: string]: { title: string; desc: string; icon: string } } = {
    "ITJ": { title: "The Architect", desc: "Thoughtful, strategic, and organized.", icon: "🏛️" },
    "ITP": { title: "The Thinker", desc: "Curious, logical, and adaptable.", icon: "🤔" },
    "IFJ": { title: "The Protector", desc: "Caring, dedicated, and steady.", icon: "🛡️" },
    "IFP": { title: "The Dreamer", desc: "Idealistic, creative, and gentle.", icon: "🎨" },
    "ETJ": { title: "The Commander", desc: "Bold, logical, and decisive.", icon: "⚡" },
    "ETP": { title: "The Visionary", desc: "Energetic, inventive, and spontaneous.", icon: "🚀" },
    "EFJ": { title: "The Caregiver", desc: "Warm, supportive, and organized.", icon: "💖" },
    "EFP": { title: "The Inspirer", desc: "Enthusiastic, creative, and sociable.", icon: "✨" },
}

export function PersonalityTest() {
    const [currentQ, setCurrentQ] = useState(0)
    const [answers, setAnswers] = useState<string[]>([])
    const [result, setResult] = useState<{ title: string; desc: string; icon: string } | null>(null)
    const [activeQuestions, setActiveQuestions] = useState<typeof questionPool>([])
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    // Initialize randomized questions on mount
    useEffect(() => {
        startNewGame()
    }, [])

    const startNewGame = () => {
        // Randomly select 3 questions
        // ideally one from each category group, but simplified here to just any 3 unique ones
        const shuffled = [...questionPool].sort(() => 0.5 - Math.random())
        setActiveQuestions(shuffled.slice(0, 3))
        setCurrentQ(0)
        setAnswers([])
        setResult(null)
        setIsAnalyzing(false)
    }

    const handleAnswer = (type: string) => {
        const newAnswers = [...answers, type]
        if (currentQ < activeQuestions.length - 1) {
            setAnswers(newAnswers)
            setCurrentQ(currentQ + 1)
        } else {
            // Finished answering
            setAnswers(newAnswers)
            setIsAnalyzing(true)

            // Simulate AI processing time
            setTimeout(() => {
                calculateResult(newAnswers)
                setIsAnalyzing(false)
            }, 1500)
        }
    }

    const calculateResult = (finalAnswers: string[]) => {
        // Simple logic: we need 3 letters (I/E, T/F, J/P)
        // Since our questions are random, we might get multiple of the same type or missing types
        // We will build a "dominant" trait string based on counts

        // Default fallback
        let i_e = "I"
        let t_f = "F"
        let j_p = "P"

        // Count occurrences
        const counts: { [key: string]: number } = {}
        finalAnswers.forEach(a => counts[a] = (counts[a] || 0) + 1)

        if ((counts["E"] || 0) > (counts["I"] || 0)) i_e = "E"
        if ((counts["T"] || 0) > (counts["F"] || 0)) t_f = "T"
        if ((counts["J"] || 0) > (counts["P"] || 0)) j_p = "J"

        // Construct key (e.g., "IFP")
        const key = i_e + t_f + j_p
        setResult(archetypes[key] || archetypes["IFP"])
    }

    if (activeQuestions.length === 0) return null // Loading state

    return (
        <section className="py-24 bg-[#0A0118] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent" />

            <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                <h2 className="text-3xl font-bold mb-8 text-white">Discover Your Wellness Archetype</h2>
                <Card className="max-w-xl mx-auto p-8 relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl min-h-[400px] flex flex-col justify-center">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-full -mr-8 -mt-8 blur-2xl"></div>

                    {isAnalyzing ? (
                        <div className="flex flex-col items-center justify-center space-y-4 animate-fade-in text-white">
                            <Sparkles className="w-12 h-12 text-purple-400 animate-spin-slow" />
                            <h3 className="text-xl font-semibold">Analyzing your responses...</h3>
                            <p className="text-gray-400">Consulting mental wellness patterns</p>
                        </div>
                    ) : !result ? (
                        <div className="relative z-10 animate-fade-in text-left">
                            <div className="mb-8 text-center">
                                <span className="text-purple-400 text-sm uppercase tracking-wider font-semibold">
                                    Question {currentQ + 1} of {activeQuestions.length}
                                </span>
                                <h3 className="text-2xl font-bold mt-4 text-white">{activeQuestions[currentQ].text}</h3>
                            </div>

                            <div className="space-y-4">
                                {activeQuestions[currentQ].options.map((option, idx) => (
                                    <Button
                                        key={idx}
                                        variant="outline"
                                        className="w-full text-lg h-16 justify-between group border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-purple-500/50 transition-all rounded-xl"
                                        onClick={() => handleAnswer(option.type)}
                                    >
                                        {option.label}
                                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-purple-400" />
                                    </Button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="relative z-10 animate-scale-in text-center">
                            <div className="text-6xl mb-6 animate-float filter drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">{result.icon}</div>
                            <h3 className="text-3xl font-bold text-white mb-2">{result.title}</h3>
                            <p className="text-xl text-gray-400 mb-8">{result.desc}</p>

                            <Button onClick={startNewGame} variant="outline" className="gap-2 border-white/10 text-white hover:bg-white/10">
                                <RefreshCw className="w-4 h-4" /> Try with new questions
                            </Button>
                        </div>
                    )}
                </Card>
            </div>
        </section>
    )
}
