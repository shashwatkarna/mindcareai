"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronRight, Loader2 } from "lucide-react"

const assessments = {
  depression: {
    name: "Mood & Energy",
    description: "Check if you've been feeling low or tired lately. Understanding your mood is the first step to feeling better.",
    questions: [
      "I have little interest or joy in things I usually like",
      "I feel down, sad, or like there is no hope",
      "I struggle to sleep well or I sleep too much",
      "I feel tired and have very little energy",
      "I have a poor appetite or I am eating too much",
      "I feel bad about myself or like I have failed",
      "I find it hard to focus on simple things like reading",
      "I move or speak much slower or faster than usual",
      "I have thoughts about hurting myself or not being here",
    ],
  },
  anxiety: {
    name: "Calmness Check",
    description: "See if you've been feeling worried or nervous. This helps you find ways to feel more relaxed.",
    questions: [
      "I feel nervous, worried, or on edge",
      "I find it hard to stop or control my worrying",
      "I worry too much about many different things",
      "I find it very difficult to relax",
      "I am so restless that I can't sit still",
      "I get annoyed or angry very easily",
      "I feel afraid that something bad might happen",
    ],
  },
  stress: {
    name: "Daily Pressure",
    description: "Check how much stress you are carrying. Knowing your stress level helps you protect your health.",
    questions: [
      "I feel like I have too much to do and can't cope",
      "I find it hard to relax even when I have time",
      "I feel tightness in my chest or muscles from stress",
      "I can't stop thinking about my problems at night",
      "I lose my patience easily with people around me",
      "I get headaches or body pain when I am Busy",
      "I feel like I have no control over my life right now",
      "I feel sure that I can handle the pressure I'm under",
    ],
  },
  sleep: {
    name: "Sleep Quality",
    description: "Assess how well you are sleeping. Good sleep helps your brain stay sharp and your mood stay steady.",
    questions: [
      "It takes me more than 30 minutes to fall asleep",
      "I wake up often during the night",
      "I feel sleepy and tired during the day",
      "I need extra coffee or energy drinks to stay awake",
      "I can't sleep because I'm worrying too much",
      "I feel like my sleep has been poor lately",
    ],
  },
  social: {
    name: "Connection Check",
    description: "See how connected you feel to others. Having people to talk to is a great way to stay strong.",
    questions: [
      "I have people I can really lean on when things get hard",
      "I feel lonely even when I am with other people",
      "I feel like I belong to a group that cares for me",
      "I talk to friends or family about my feelings often",
      "I feel that people around me value who I am",
    ],
  },
  focus: {
    name: "Focus & Clarity",
    description: "Check if your mind feels clear or 'foggy.' This helps you know when you need a mental break.",
    questions: [
      "I find it hard to stay focused on one task",
      "I get distracted very easily by things around me",
      "My brain feels 'foggy' or slow today",
      "I struggle to make simple choices or plan my day",
      "I start many things but find it hard to finish them",
    ],
  },
}

interface AssessmentFormProps {
  userId: string
}

export function AssessmentForm({ userId }: AssessmentFormProps) {
  const [selectedAssessment, setSelectedAssessment] = useState<keyof typeof assessments | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<{ [key: number]: number }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [isAdvancing, setIsAdvancing] = useState(false)
  const router = useRouter()

  if (!selectedAssessment) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(assessments).map(([key, assessment]) => (
          <Card
            key={key}
            className="group relative overflow-hidden border-border hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer cursor-pointer"
            onClick={() => setSelectedAssessment(key as keyof typeof assessments)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                {assessment.name}
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardTitle>
              <CardDescription>{assessment.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 p-2 rounded-md w-fit">
                <CheckCircle2 className="w-4 h-4" />
                {assessment.questions.length} questions
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const currentAssessment = assessments[selectedAssessment]
  const totalQuestions = currentAssessment.questions.length
  const currentQuestion = currentAssessment.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex) / totalQuestions) * 100

  const handleResponseChange = (value: number) => {
    // Update local response state
    setResponses((prev) => ({
      ...prev,
      [currentQuestionIndex]: value,
    }))

    // If already advancing, don't trigger another jump
    if (isAdvancing) return
    setIsAdvancing(true)

    // Auto-advance with a slight delay for better feedback
    setTimeout(() => {
      setCurrentQuestionIndex(prev => {
        const nextIndex = prev + 1
        if (nextIndex < totalQuestions) {
          setIsAdvancing(false)
          return nextIndex
        } else {
          // Last question answered
          handleSubmit()
          return prev
        }
      })
    }, 400)
  }

  const handleNext = () => {
    if (responses[currentQuestionIndex] === undefined) return

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    } else {
      setSelectedAssessment(null)
      setResponses({})
      setCurrentQuestionIndex(0)
    }
  }

  const calculateScore = () => {
    const values = Object.values(responses)
    return values.reduce((sum, val) => sum + val, 0)
  }

  const getScore = () => {
    const values = Object.values(responses)
    if (values.length === 0) return 0
    const score = values.reduce((sum, val) => sum + val, 0)
    const maxPossibleScore = values.length * 3
    return Math.round((score / maxPossibleScore) * 100)
  }

  const getRiskLevel = (score: number) => {
    // Simplified risk logic for demo
    if (score >= 70) return "high"
    if (score >= 40) return "moderate"
    return "low"
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const score = getScore()
      const riskLevel = getRiskLevel(score)

      const response = await fetch("/api/assessments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assessment_type: selectedAssessment,
          responses,
          score,
          risk_level: riskLevel,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit assessment")
      }

      //   setShowResults(true)
      //   setTimeout(() => {
      router.push(`/dashboard/assessments/${result.data.id}`)
      //   }, 1000)
    } catch (error) {
      console.error("Error submitting assessment:", error)
      alert("Failed to save assessment")
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-border shadow-lg max-w-2xl mx-auto overflow-hidden flex flex-col max-h-[90vh]">
      <div className="w-full bg-secondary h-1.5 sticky top-0">
        <div
          className="bg-primary h-full transition-all duration-500 ease-in-out"
          style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      <CardHeader className="py-4 px-6 shrink-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium bg-secondary/50 px-2 py-0.5 rounded-full">
            {currentAssessment.name}
          </span>
        </div>
        <CardTitle className="text-lg md:text-xl font-bold leading-tight">
          {currentQuestion}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6 py-2 flex-1 overflow-y-auto">
        <RadioGroup
          value={responses[currentQuestionIndex]?.toString() || ""}
          className="space-y-2"
        >
          {[
            { value: 0, label: "Not at all" },
            { value: 1, label: "Several days" },
            { value: 2, label: "More than half the days" },
            { value: 3, label: "Nearly every day" },
          ].map((option) => (
            <div key={option.value}
              className={`flex items-center space-x-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${responses[currentQuestionIndex] === option.value
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-transparent bg-white/50 dark:bg-black/5 hover:border-primary/30 hover:bg-secondary/30"
                }`}
              onClick={() => handleResponseChange(option.value)}
            >
              <RadioGroupItem value={option.value.toString()} id={`opt-${option.value}`} className="border-primary" />
              <Label htmlFor={`opt-${option.value}`} className="font-semibold text-sm cursor-pointer flex-1 py-0.5">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>

      <CardFooter className="flex justify-between border-t bg-secondary/10 px-6 py-3 shrink-0">
        <Button variant="ghost" size="sm" onClick={handlePrevious} disabled={isLoading} className="text-xs font-bold">
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          Back
        </Button>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter opacity-50">
            Auto-Advance Enabled
          </span>
          <Button
            size="sm"
            onClick={handleNext}
            disabled={isLoading || responses[currentQuestionIndex] === undefined}
            className="min-w-[100px] text-xs font-bold"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : currentQuestionIndex === totalQuestions - 1 ? (
              <>Finish Results <Check className="w-3.5 h-3.5 ml-1.5" /></>
            ) : (
              <>Next <ArrowRight className="w-3.5 h-3.5 ml-1.5" /></>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
