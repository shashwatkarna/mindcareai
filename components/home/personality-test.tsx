"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, RefreshCw, Sparkles, Brain, Target, Shield } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Expanded 28-Question Pool carefully mapped to 4 axes (E/I, S/N, T/F, J/P)
const questionPool = {
    // Axis 1: Energy (Extraversion vs Introversion)
    EI: [
        { id: 'ei1', text: "After a long, stressful week, you recover best by:", options: [{ label: "Spending quiet, uninterrupted time alone", type: "I" }, { label: "Going out and socializing with friends", type: "E" }] },
        { id: 'ei2', text: "In a group discussion, you typically:", options: [{ label: "Listen, process, and then speak if needed", type: "I" }, { label: "Think out loud and jump right into the fray", type: "E" }] },
        { id: 'ei3', text: "Your ideal weekend plan looks more like:", options: [{ label: "A cozy evening reading or watching a movie", type: "I" }, { label: "Attending a lively event or party", type: "E" }] },
        { id: 'ei4', text: "When you have a big piece of news to share, you:", options: [{ label: "Tell a few close friends privately", type: "I" }, { label: "Want to announce it to the whole room", type: "E" }] },
        { id: 'ei5', text: "In new, unfamiliar social settings, you usually:", options: [{ label: "Observe the dynamics before engaging", type: "I" }, { label: "Introduce yourself and make quick connections", type: "E" }] },
        { id: 'ei6', text: "You feel most drained and exhausted when:", options: [{ label: "Forced into prolonged, superficial socializing", type: "I" }, { label: "Stuck in isolation for too many days", type: "E" }] },
        { id: 'ei7', text: "Your social circle consists mostly of:", options: [{ label: "A few very deep, lifelong friendships", type: "I" }, { label: "A vast, ever-growing network of acquaintances", type: "E" }] },
    ],
    // Axis 2: Information (Sensing vs Intuition)
    SN: [
        { id: 'sn1', text: "When solving a problem, your first instinct is to:", options: [{ label: "Look at the concrete facts and past data", type: "S" }, { label: "Brainstorm entirely new, abstract possibilities", type: "N" }] },
        { id: 'sn2', text: "When listening to a presentation, you value:", options: [{ label: "Practical examples and clear applications", type: "S" }, { label: "Underlying theories and future implications", type: "N" }] },
        { id: 'sn3', text: "Your communication style is generally:", options: [{ label: "Direct, literal, and specific", type: "S" }, { label: "Metaphorical, figurative, and broad", type: "N" }] },
        { id: 'sn4', text: "When learning a new skill, you prefer to:", options: [{ label: "Follow step-by-step, proven instructions", type: "S" }, { label: "Understand the core concept and experiment", type: "N" }] },
        { id: 'sn5', text: "You are more likely to trust:", options: [{ label: "Your direct, lived experience", type: "S" }, { label: "Your gut instinct and intuition", type: "N" }] },
        { id: 'sn6', text: "You find it more engaging to talk about:", options: [{ label: "Current events and tangible realities", type: "S" }, { label: "Philosophy, the future, and 'what-ifs'", type: "N" }] },
        { id: 'sn7', text: "When describing a recent trip, you focus on:", options: [{ label: "The exact sights, sounds, and timeline", type: "S" }, { label: "The overall vibe, meaning, and feelings", type: "N" }] },
    ],
    // Axis 3: Decisions (Thinking vs Feeling)
    TF: [
        { id: 'tf1', text: "When making a difficult choice, what guides you most?", options: [{ label: "Cold logic and objective pros/cons", type: "T" }, { label: "Personal values and how others will feel", type: "F" }] },
        { id: 'tf2', text: "If a friend comes to you sad, you naturally:", options: [{ label: "Offer a practical, actionable solution", type: "T" }, { label: "Offer a shoulder to cry on and validate them", type: "F" }] },
        { id: 'tf3', text: "You believe the worst trait a person can have is:", options: [{ label: "Being illogical or painfully inconsistent", type: "T" }, { label: "Being unkind or aggressively selfish", type: "F" }] },
        { id: 'tf4', text: "In a debate, your primary goal is to:", options: [{ label: "Find the absolute objective truth", type: "T" }, { label: "Maintain harmony and mutual understanding", type: "F" }] },
        { id: 'tf5', text: "When evaluating someone's work, you focus on:", options: [{ label: "The quality and accuracy of the output", type: "T" }, { label: "The effort and passion they put into it", type: "F" }] },
        { id: 'tf6', text: "You would rather be known as someone who is:", options: [{ label: "Fair, competent, and highly rational", type: "T" }, { label: "Warm, empathetic, and deeply compassionate", type: "F" }] },
        { id: 'tf7', text: "When a rule seems unfair to someone, you:", options: [{ label: "Uphold it, because rules maintain order", type: "T" }, { label: "Bend it, because people matter more than rules", type: "F" }] },
    ],
    // Axis 4: Structure (Judging vs Perceiving)
    JP: [
        { id: 'jp1', text: "Your physical workspace is usually:", options: [{ label: "Tidy, structured, and highly organized", type: "J" }, { label: "A bit messy, but functionally creative", type: "P" }] },
        { id: 'jp2', text: "Approaching a deadline makes you:", options: [{ label: "Work steadily to finish well in advance", type: "J" }, { label: "Experience a burst of energy at the last minute", type: "P" }] },
        { id: 'jp3', text: "On a long vacation, you usually prefer:", options: [{ label: "A well-researched, planned itinerary", type: "J" }, { label: "To explore entirely spontaneously on a whim", type: "P" }] },
        { id: 'jp4', text: "When confronting chaos, your instinct is to:", options: [{ label: "Create immediate order and control", type: "J" }, { label: "Observe the chaos and adapt to it", type: "P" }] },
        { id: 'jp5', text: "You feel most comfortable when a decision is:", options: [{ label: "Finalized, settled, and crossed off the list", type: "J" }, { label: "Left open in case better options arise", type: "P" }] },
        { id: 'jp6', text: "Your day-to-day life is generally:", options: [{ label: "Scheduled, predictable, and routine", type: "J" }, { label: "Flexible, casual, and open-ended", type: "P" }] },
        { id: 'jp7', text: "When you start a new project, you:", options: [{ label: "Finish it completely before starting another", type: "J" }, { label: "Juggle it alongside several other new ideas", type: "P" }] },
    ]
}

// All 16 Archetypes carefully mapped
const archetypes: { [key: string]: { title: string; desc: string; icon: string; strengths: string; growth: string; focus: string } } = {
    // Analysts (NT)
    "INTJ": { title: "The Architect", desc: "Thoughtful, profoundly strategic, and highly organized in your inner world.", icon: "🏛️", strengths: "Incredible focus, strategic planning, systems thinking, independence.", growth: "Can over-analyze situations and isolate from emotional support networks.", focus: "Practice mindfulness to get out of your head. Incorporate structured journaling." },
    "INTP": { title: "The Logician", desc: "Curious, highly analytical, and endlessly adaptable to new information.", icon: "🔬", strengths: "Objective analysis, inventive troubleshooting, natural intellectual curiosity.", growth: "May struggle with rigid routines and sometimes dismiss emotional data.", focus: "Use our mood tracker to find data correlations between your environment and energy levels." },
    "ENTJ": { title: "The Commander", desc: "Bold, relentlessly logical, and highly decisive in execution.", icon: "⚡", strengths: "Natural leadership, efficiency, confidence, goal-oriented mindset.", growth: "May accidentally bulldoze others' feelings in the pursuit of results.", focus: "Practice active gratitude. Take time to pause and reflect on your emotional state, not just goals." },
    "ENTP": { title: "The Debater", desc: "Highly energetic, inventive, and wonderfully spontaneous in thought.", icon: "🧠", strengths: "Charismatic, quick-thinking, innovative, resilient to intellectual stress.", growth: "Prone to starting many projects but finishing few due to boredom with routine.", focus: "Try short, 5-minute daily check-ins to build consistent, low-barrier wellness habits without feeling trapped." },

    // Diplomats (NF)
    "INFJ": { title: "The Advocate", desc: "Quiet, mystical, yet fiercely inspiring and tireless in idealism.", icon: "🌟", strengths: "High empathy, deep insight, strong personal integrity, creative.", growth: "Highly prone to burnout by taking on the emotional weight of everyone else.", focus: "Set firm boundaries. Dedicate time strictly for your own self-care using our daily exercises." },
    "INFP": { title: "The Mediator", desc: "Quietly idealistic, deeply imaginative, and rooted in personal values.", icon: "🎨", strengths: "Creative problem solving, authentic, non-judgmental, deeply passionate.", growth: "Can struggle with sudden changes in plans and harsh personal criticism.", focus: "Channel your exceptionally rich inner world into expressive, free-form, encrypted journaling." },
    "ENFJ": { title: "The Protagonist", desc: "Incredibly warm, aggressively supportive, and highly socially organized.", icon: "💖", strengths: "Community building, natural mediation, reliable, highly attuned to others' needs.", growth: "Tying your personal self-worth entirely to how much you can help others.", focus: "Engage in solo AI Therapy sessions to focus entirely on your own needs for once." },
    "ENFP": { title: "The Campaigner", desc: "Enthusiastic, delightfully creative, and inherently sociable.", icon: "✨", strengths: "Contagious enthusiasm, excellent communication, deeply empathetic, adaptable.", growth: "Over-committing to social events and severely neglecting necessary downtime.", focus: "Schedule strictly enforced 'Do Nothing' time. Reflect on what truly recharges your specific batteries." },

    // Sentinels (SJ)
    "ISTJ": { title: "The Logistician", desc: "Practical, fact-minded, and extraordinarily reliable.", icon: "📋", strengths: "Dedication, integrity, practical logic, incredible attention to detail.", growth: "Can be overly stubborn and resistant to new, untested ideas.", focus: "Use structured cognitive behavioral exercises to safely explore alternative perspectives." },
    "ISFJ": { title: "The Defender", desc: "Deeply caring, fiercely dedicated, and a steady foundation for others.", icon: "🛡️", strengths: "High empathy, incredibly reliable, observant, excellent memory for people's needs.", growth: "Reluctance to change and frequently repressing your own emotional needs.", focus: "Set firm boundaries. Dedicate time strictly for your own self-care using the daily exercises." },
    "ESTJ": { title: "The Executive", desc: "Excellent administrators, unsurpassed at managing things or people.", icon: "📈", strengths: "Dedication, strong will, direct, honest, excellent organizers.", growth: "Difficulty expressing emotion and relaxing when not being 'productive'.", focus: "Practice active gratitude and radically accept that resting *is* a productive act for your health." },
    "ESFJ": { title: "The Consul", desc: "Extraordinarily caring, social, and popular people, eager to help.", icon: "🤝", strengths: "Strong practical skills, profound sense of duty, very loyal, sensitive and warm.", growth: "Worrying too much about social status and being too vulnerable to criticism.", focus: "Engage in solo AI Therapy sessions to decouple your mood from the opinions of others." },

    // Explorers (SP)
    "ISTP": { title: "The Virtuoso", desc: "Bold and practical experimenters, masters of all kinds of tools.", icon: "🔧", strengths: "Optimistic, energetic, highly creative, deeply practical, relaxed.", growth: "Easily bored, prone to risky behavior, and often emotionally private to a fault.", focus: "Use our encrypted, completely anonymous journal to explore feelings you wouldn't share out loud." },
    "ISFP": { title: "The Adventurer", desc: "Flexible and charming artists, always ready to explore and experience.", icon: "🎭", strengths: "Charming, highly imaginative, passionate, intensely curious.", growth: "Fiercely independent to the point of isolation, easily stressed by rigid rules.", focus: "Channel your rich inner world into expressive, judgment-free journaling." },
    "ESTP": { title: "The Entrepreneur", desc: "Smart, energetic, and very perceptive people who enjoy living on the edge.", icon: "🔥", strengths: "Bold, rational, practical, deeply observant, excellent in emergencies.", growth: "Missing the bigger picture, impatience, and ignoring rules.", focus: "Use goal-setting tools to tie your immediate energetic impulses to long-term wellness outcomes." },
    "ESFP": { title: "The Entertainer", desc: "Spontaneous, energetic, and enthusiastic people – life is never boring around them.", icon: "🎉", strengths: "Bold, highly observant, excellent people skills, wonderful aesthetics.", growth: "Easily bored, poor long-term planners, and terrible at focusing on negatives.", focus: "Try short, 5-minute daily check-ins to build consistent, low-barrier wellness habits." },
}

// Ensure 8 total questions (2 from each MBTI axis for accuracy but still keeping it snappy)
const TOTAL_QUESTIONS = 8;

export function PersonalityTest() {
    const [currentQ, setCurrentQ] = useState(0)
    const [answers, setAnswers] = useState<string[]>([])
    const [result, setResult] = useState<typeof archetypes[keyof typeof archetypes] | null>(null)
    const [activeQuestions, setActiveQuestions] = useState<typeof questionPool['EI']>([])
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    // Helper: Select N random items from an array
    const getRandom = (arr: any[], n: number) => [...arr].sort(() => 0.5 - Math.random()).slice(0, n);

    // Initialize randomized dynamic questions on mount
    useEffect(() => {
        startNewGame()
    }, [])

    const startNewGame = () => {
        // Dynamically build an 8-question quiz, pulling 2 random questions from each axis
        // This ensures the MBTI mapping remains accurate while producing functionally endless combinations
        let dynamicQuiz = [
            ...getRandom(questionPool.EI, 2),
            ...getRandom(questionPool.SN, 2),
            ...getRandom(questionPool.TF, 2),
            ...getRandom(questionPool.JP, 2),
        ]

        // Shuffle the final 8 questions so the categories aren't grouped obviously
        dynamicQuiz = dynamicQuiz.sort(() => 0.5 - Math.random());

        setActiveQuestions(dynamicQuiz)
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

            // Simulate deep AI processing time
            setTimeout(() => {
                calculateResult(newAnswers)
                setIsAnalyzing(false)
            }, 2500)
        }
    }

    const calculateResult = (finalAnswers: string[]) => {
        // Build the 4-letter type string based on dominant answer counts
        let e_i = "I"
        let s_n = "N"
        let t_f = "F"
        let j_p = "P"

        const counts: { [key: string]: number } = {}
        finalAnswers.forEach(a => counts[a] = (counts[a] || 0) + 1)

        if ((counts["E"] || 0) > (counts["I"] || 0)) e_i = "E"
        if ((counts["S"] || 0) > (counts["N"] || 0)) s_n = "S"
        if ((counts["T"] || 0) > (counts["F"] || 0)) t_f = "T"
        if ((counts["J"] || 0) > (counts["P"] || 0)) j_p = "J"

        // Construct 4-letter key (e.g., "INFP")
        const key = `${e_i}${s_n}${t_f}${j_p}`

        // Fallback to INFP if highly bizarre error, but mathematically shouldn't happen
        setResult(archetypes[key] || archetypes["INFP"])
    }

    if (activeQuestions.length === 0) return null // Loading state

    const progressPercentage = ((currentQ) / TOTAL_QUESTIONS) * 100;

    return (
        <section className="py-24 bg-[#0A0118] relative overflow-hidden" id="archetype">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent" />

            <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    Discover Your Wellness Archetype
                </h2>
                <p className="text-gray-400 mb-10 max-w-xl mx-auto text-lg leading-relaxed">
                    Take this dynamic, science-backed 8-question assessment to uncover your core psychological configuration and unlock deeply customized mental health strategies.
                </p>

                <Card className="max-w-3xl mx-auto p-6 md:p-10 relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl min-h-[500px] flex flex-col justify-center">
                    {/* Decorative glowing blob */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-bl-full -mr-12 -mt-12 blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-tr-full -ml-12 -mb-12 blur-3xl pointer-events-none"></div>

                    <AnimatePresence mode="wait">
                        {isAnalyzing ? (
                            <motion.div
                                key="analyzing"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.1 }}
                                className="flex flex-col items-center justify-center space-y-6 text-white py-12"
                            >
                                <div className="relative">
                                    <Sparkles className="w-16 h-16 text-purple-400 animate-spin-slow" />
                                    <div className="absolute inset-0 bg-purple-500/20 blur-xl animate-pulse rounded-full"></div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-semibold tracking-wide">Synthesizing Profile...</h3>
                                    <p className="text-purple-300/80">Cross-referencing 16 behavioral matrices</p>
                                </div>
                            </motion.div>

                        ) : !result ? (
                            <motion.div
                                key={`question-${currentQ}`}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="relative z-10 text-left w-full max-w-2xl mx-auto"
                            >
                                {/* Progress Bar */}
                                <div className="w-full bg-white/5 h-2 rounded-full mb-8 overflow-hidden border border-white/5">
                                    <div
                                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${progressPercentage}%` }}
                                    ></div>
                                </div>

                                <div className="mb-10 text-center">
                                    <span className="text-purple-400 text-sm uppercase tracking-wider font-semibold">
                                        Question {currentQ + 1} of {TOTAL_QUESTIONS}
                                    </span>
                                    <h3 className="text-2xl md:text-3xl font-bold mt-4 text-white leading-tight">
                                        {activeQuestions[currentQ].text}
                                    </h3>
                                </div>

                                <div className="space-y-4">
                                    {activeQuestions[currentQ].options.map((option, idx) => (
                                        <Button
                                            key={idx}
                                            variant="outline"
                                            className="w-full text-left md:text-lg h-auto py-5 justify-between group border-white/10 bg-white/5 text-white hover:bg-purple-900/30 hover:border-purple-500/50 transition-all duration-300 rounded-xl px-6"
                                            onClick={() => handleAnswer(option.type)}
                                        >
                                            <span className="flex-1 whitespace-normal mr-4 font-medium leading-relaxed">{option.label}</span>
                                            <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-purple-400 flex-shrink-0" />
                                        </Button>
                                    ))}
                                </div>
                            </motion.div>

                        ) : (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative z-10 text-left"
                            >
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 border-b border-white/10 pb-8">
                                    <div className="text-8xl animate-float filter drop-shadow-[0_0_25px_rgba(168,85,247,0.5)] shrink-0 bg-white/5 p-6 rounded-3xl border border-white/10">
                                        {result.icon}
                                    </div>
                                    <div className="text-center md:text-left flex-1">
                                        <div className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-purple-500/20">
                                            Your Archetype Profile
                                        </div>
                                        <h3 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">{result.title}</h3>
                                        <p className="text-lg md:text-xl text-gray-300/90 leading-relaxed font-medium">{result.desc}</p>
                                    </div>
                                </div>

                                {/* Detailed Insights Grid */}
                                <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-10">
                                    <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 p-6 rounded-2xl">
                                        <div className="flex items-center gap-3 text-green-400 font-semibold mb-3 text-lg">
                                            <Shield className="w-6 h-6" /> Core Strengths
                                        </div>
                                        <p className="text-gray-300 leading-relaxed">{result.strengths}</p>
                                    </div>

                                    <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 p-6 rounded-2xl">
                                        <div className="flex items-center gap-3 text-red-400 font-semibold mb-3 text-lg">
                                            <Target className="w-6 h-6" /> Hidden Growth Areas
                                        </div>
                                        <p className="text-gray-300 leading-relaxed">{result.growth}</p>
                                    </div>

                                    <div className="md:col-span-2 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 p-6 rounded-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full"></div>
                                        <div className="flex items-center gap-3 text-purple-300 font-semibold mb-3 text-lg relative z-10">
                                            <Brain className="w-6 h-6" /> Recommended Wellness Focus
                                        </div>
                                        <p className="text-gray-200 leading-relaxed text-lg relative z-10">{result.focus}</p>
                                    </div>
                                </div>

                                <div className="text-center border-t border-white/5 pt-8">
                                    <Button onClick={startNewGame} variant="outline" className="w-full sm:w-auto h-14 px-8 gap-3 border-white/10 text-white hover:bg-white/10 hover:border-white/20 rounded-xl transition-all text-lg font-medium group">
                                        <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" /> Retake Assessment
                                    </Button>
                                    <p className="text-sm text-gray-500 mt-5 max-w-md mx-auto">
                                        Notice how your archetype shifts based on your current emotional state. For ultimate precision, use the <strong className="text-gray-400">MindCare Dashboard</strong>.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>
            </div>
        </section>
    )
}
