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
    name: "Depression Screening (PHQ-9)",
    description: "Screen for symptoms of depression",
    questions: [
      "Little interest or pleasure in doing things",
      "Feeling down, depressed, or hopeless",
      "Trouble falling or staying asleep, or sleeping too much",
      "Feeling tired or having little energy",
      "Poor appetite or overeating",
      "Feeling bad about yourself or that you are a failure",
      "Trouble concentrating on things",
      "Moving or speaking so slowly that others have noticed",
      "Thoughts that you would be better off dead",
    ],
  },
  anxiety: {
    name: "Anxiety Screening (GAD-7)",
    description: "Screen for symptoms of anxiety disorder",
    questions: [
      "Feeling nervous, anxious, or on edge",
      "Not being able to stop or control worrying",
      "Worrying too much about different things",
      "Trouble relaxing",
      "Being so restless that it is hard to sit still",
      "Becoming easily annoyed or irritable",
      "Feeling afraid as if something awful might happen",
    ],
  },
  stress: {
    name: "Stress Assessment",
    description: "Assess your current stress levels",
    questions: [
      "I feel overwhelmed by my responsibilities",
      "I have difficulty sleeping due to stress",
      "I feel tense and anxious most of the time",
      "I have trouble concentrating at work or home",
      "I feel irritable and impatient with others",
      "I have physical symptoms of stress (headaches, muscle tension)",
      "I feel unable to control important things in my life",
      "I feel confident in my ability to handle stress",
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
    setResponses((prev) => ({
      ...prev,
      [currentQuestionIndex]: value,
    }))
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
    const score = calculateScore()
    const maxScore = totalQuestions * 3
    return Math.round((score / maxScore) * 100)
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
    <Card className="border-border shadow-lg max-w-2xl mx-auto overflow-hidden">
      <div className="w-full bg-secondary h-2 sticky top-0">
        <div
          className="bg-primary h-full transition-all duration-500 ease-in-out"
          style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <span className="text-xs text-muted-foreground">
            {currentAssessment.name}
          </span>
        </div>
        <CardTitle className="text-xl md:text-2xl leading-relaxed">
          {currentQuestion}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 pt-4 min-h-[300px] flex flex-col justify-center">
        <RadioGroup
          value={responses[currentQuestionIndex]?.toString() || ""}
          onValueChange={(value) => handleResponseChange(Number.parseInt(value))}
          className="space-y-3"
        >
          {[
            { value: 0, label: "Not at all" },
            { value: 1, label: "Several days" },
            { value: 2, label: "More than half the days" },
            { value: 3, label: "Nearly every day" },
          ].map((option) => (
            <div key={option.value}
              className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${responses[currentQuestionIndex] === option.value
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-muted hover:border-primary/50 hover:bg-secondary/50"
                }`}
              onClick={() => handleResponseChange(option.value)}
            >
              <RadioGroupItem value={option.value.toString()} id={`opt-${option.value}`} />
              <Label htmlFor={`opt-${option.value}`} className="font-medium cursor-pointer flex-1">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>

      <CardFooter className="flex justify-between border-t bg-secondary/20 p-6">
        <Button variant="ghost" onClick={handlePrevious} disabled={isLoading}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={isLoading || responses[currentQuestionIndex] === undefined}
          className="min-w-[120px]"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : currentQuestionIndex === totalQuestions - 1 ? (
            <>Finish <Check className="w-4 h-4 ml-2" /></>
          ) : (
            <>Next <ArrowRight className="w-4 h-4 ml-2" /></>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
