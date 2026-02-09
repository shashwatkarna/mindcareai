
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, RefreshCcw, Sparkles } from "lucide-react"

// Question pools for variety
const questions = {
    physical: [
        "How is your energy level right now?",
        "How does your body feel today?",
        "Rate your physical comfort.",
    ],
    mental: [
        "How is your head space?",
        "Are you feeling focused or distracted?",
        "What's the dominant emotion right now?",
    ],
    social: [
        "How much have you interacted with others?",
        "Have you had any meaningful conversations?",
        "Do you feel connected or isolated?",
    ],
    activity: [
        "What has taken up most of your time?",
        "What have you been up to?",
        "Key activity of the last few hours?",
    ]
}

const options = {
    physical: ["Energized ⚡", "Normal 😐", "Tired 😴", "Exhausted 😫"],
    mental: ["Clear 🧠", "Foggy 🌫️", "Anxious 😰", "Calm 😌"],
    social: ["Social 🗣️", "Quiet 🤫", "Lonely 😔", "Connected 🤝"],
    activity: ["Work 💼", "Family 🏠", "Hobbies 🎨", "Rest 🛌", "Exercise 🏃"]
}

interface MoodQuizProps {
    onComplete: (data: any) => void
    isLoading: boolean
}

export function MoodQuiz({ onComplete, isLoading }: MoodQuizProps) {
    const [step, setStep] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [currentQuestions, setCurrentQuestions] = useState<{ [key: string]: string }>({})
    const [notes, setNotes] = useState("")

    // Initialize random questions on mount
    useState(() => {
        setCurrentQuestions({
            physical: questions.physical[Math.floor(Math.random() * questions.physical.length)],
            mental: questions.mental[Math.floor(Math.random() * questions.mental.length)],
            social: questions.social[Math.floor(Math.random() * questions.social.length)],
            activity: questions.activity[Math.floor(Math.random() * questions.activity.length)],
        })
    })

    // Determine standard mood categories based on answers for fallback
    const deriveMood = () => {
        const text = Object.values(answers).join(" ") + " " + notes;
        return text; // We will send this to API for analysis
    }

    const handleOptionSelect = (category: string, option: string) => {
        setAnswers(prev => ({ ...prev, [category]: option }))
        if (step < 4) {
            setTimeout(() => setStep(prev => prev + 1), 250) // Auto advance
        }
    }

    const steps = [
        { id: "physical", q: currentQuestions.physical, opts: options.physical },
        { id: "mental", q: currentQuestions.mental, opts: options.mental },
        { id: "social", q: currentQuestions.social, opts: options.social },
        { id: "activity", q: currentQuestions.activity, opts: options.activity },
    ]

    const finishQuiz = () => {
        // Combine answers into a narrative for the AI
        const narrative = `
      Physical: ${answers.physical}
      Mental: ${answers.mental}
      Social: ${answers.social}
      Activity: ${answers.activity}
      Additional Notes: ${notes}
    `;
        onComplete(narrative)
    }

    return (
        <Card className="border-none shadow-lg bg-gradient-to-br from-[#fdfbf7] to-[#f4f1ea] overflow-hidden min-h-[400px] flex flex-col justify-center relative">
            <CardContent className="p-6 md:p-10">
                <AnimatePresence mode="wait">
                    {step < 4 ? (
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <div className="flex justify-between items-center text-[#8b7355] text-sm font-medium uppercase tracking-wider">
                                <span>Step {step + 1} of 5</span>
                                <Sparkles className="w-4 h-4" />
                            </div>

                            <h2 className="text-2xl md:text-3xl font-bold text-[#3d3d3d] leading-tight">
                                {steps[step].q}
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                                {steps[step].opts.map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => handleOptionSelect(steps[step].id, opt)}
                                        className={`p-4 text-left rounded-xl transition-all border-2 ${answers[steps[step].id] === opt
                                            ? "border-[#8b7355] bg-[#8b7355]/5 shadow-sm"
                                            : "border-transparent bg-white hover:bg-[#fff9f2] hover:shadow-sm"
                                            }`}
                                    >
                                        <span className="text-lg font-medium text-[#5a5a5a]">{opt}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="notes"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-6 text-center"
                        >
                            <h2 className="text-2xl font-bold text-[#3d3d3d]">Almost done!</h2>
                            <p className="text-[#6b6b6b]">Anything else you'd like to add?</p>

                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="I felt proud because..."
                                className="w-full p-4 rounded-xl border border-[#e0d9d3] bg-white h-32 focus:ring-2 focus:ring-[#8b7355] focus:outline-none resize-none"
                            />

                            <Button
                                onClick={finishQuiz}
                                disabled={isLoading}
                                className="w-full h-12 text-lg bg-[#8b7355] hover:bg-[#6b5344] text-white rounded-xl shadow-md transition-transform active:scale-95"
                            >
                                {isLoading ? "Analyzing..." : "Complete Check-in"}
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 h-1 bg-[#e0d9d3] w-full">
                    <motion.div
                        className="h-full bg-[#8b7355]"
                        animate={{ width: `${((step + 1) / 5) * 100}%` }}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
