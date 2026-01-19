"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

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
  const [responses, setResponses] = useState<{ [key: number]: number }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()

  if (!selectedAssessment) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        {Object.entries(assessments).map(([key, assessment]) => (
          <Card
            key={key}
            className="p-6 border-[#e0d9d3] bg-white cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedAssessment(key as keyof typeof assessments)}
          >
            <h3 className="font-semibold text-[#3d3d3d]">{assessment.name}</h3>
            <p className="text-sm text-[#6b6b6b] mt-2">{assessment.description}</p>
            <p className="text-xs text-[#8b7355] mt-4 font-medium">{assessment.questions.length} questions</p>
          </Card>
        ))}
      </div>
    )
  }

  const currentAssessment = assessments[selectedAssessment]
  const totalQuestions = currentAssessment.questions.length
  const answeredQuestions = Object.keys(responses).length

  const handleResponseChange = (questionIndex: number, value: number) => {
    setResponses((prev) => ({
      ...prev,
      [questionIndex]: value,
    }))
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
    if (selectedAssessment === "depression" || selectedAssessment === "anxiety") {
      if (score >= 70) return "high"
      if (score >= 40) return "moderate"
      return "low"
    }
    if (score >= 70) return "high"
    if (score >= 40) return "moderate"
    return "low"
  }

  const handleSubmit = async () => {
    if (answeredQuestions !== totalQuestions) {
      alert("Please answer all questions before submitting")
      return
    }

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

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit assessment")
      }

      setShowResults(true)
      setTimeout(() => {
        router.push("/dashboard/assessments")
      }, 3000)
    } catch (error) {
      console.error("Error submitting assessment:", error)
      alert("Failed to save assessment")
    } finally {
      setIsLoading(false)
    }
  }

  if (showResults) {
    const score = getScore()
    const riskLevel = getRiskLevel(score)

    return (
      <Card className="p-8 border-[#e0d9d3] bg-white text-center max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-[#3d3d3d]">Assessment Complete</h2>
        <div className="mt-6 space-y-4">
          <div>
            <p className="text-[#6b6b6b]">Your Score</p>
            <p className="text-4xl font-bold text-[#8b7355]">{score}</p>
          </div>
          <div>
            <p className="text-[#6b6b6b]">Risk Level</p>
            <p
              className={`text-lg font-semibold ${riskLevel === "high" ? "text-red-600" : riskLevel === "moderate" ? "text-yellow-600" : "text-green-600"
                }`}
            >
              {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
            </p>
          </div>
          <p className="text-sm text-[#6b6b6b] mt-6">Redirecting to assessments...</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="border-[#e0d9d3] bg-white max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{currentAssessment.name}</CardTitle>
            <CardDescription>{currentAssessment.description}</CardDescription>
          </div>
          <button
            onClick={() => setSelectedAssessment(null)}
            className="text-[#8b7355] hover:underline text-sm font-medium"
          >
            Change
          </button>
        </div>
        <div className="mt-4 bg-[#f5f3f0] rounded-full h-2 w-full">
          <div
            className="bg-[#8b7355] h-2 rounded-full transition-all"
            style={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
          />
        </div>
        <p className="text-xs text-[#6b6b6b] mt-2">
          Question {answeredQuestions + 1} of {totalQuestions}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {currentAssessment.questions.map((question, index) => (
          <div key={index} className="space-y-3">
            <p className="font-medium text-[#3d3d3d]">{question}</p>
            <RadioGroup
              value={responses[index]?.toString() || ""}
              onValueChange={(value) => handleResponseChange(index, Number.parseInt(value))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id={`q${index}-0`} />
                <Label htmlFor={`q${index}-0`} className="font-normal text-[#6b6b6b] cursor-pointer">
                  Not at all
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id={`q${index}-1`} />
                <Label htmlFor={`q${index}-1`} className="font-normal text-[#6b6b6b] cursor-pointer">
                  Several days
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id={`q${index}-2`} />
                <Label htmlFor={`q${index}-2`} className="font-normal text-[#6b6b6b] cursor-pointer">
                  More than half the days
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id={`q${index}-3`} />
                <Label htmlFor={`q${index}-3`} className="font-normal text-[#6b6b6b] cursor-pointer">
                  Nearly every day
                </Label>
              </div>
            </RadioGroup>
          </div>
        ))}

        <Button
          onClick={handleSubmit}
          disabled={isLoading || answeredQuestions !== totalQuestions}
          className="w-full bg-[#8b7355] hover:bg-[#6b5344] text-white mt-6"
        >
          {isLoading ? "Submitting..." : "Submit Assessment"}
        </Button>
      </CardContent>
    </Card>
  )
}
