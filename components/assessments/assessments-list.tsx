"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Assessment {
  id: string
  assessment_type: string
  score: number | null
  risk_level: string | null
  created_at: string
}

export function AssessmentsList({ assessments }: { assessments: Assessment[] }) {
  const getRiskColor = (level: string | null) => {
    switch (level) {
      case "high":
        return "bg-red-100 text-red-800"
      case "moderate":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  if (assessments.length === 0) {
    return (
      <Card className="p-12 border-[#e0d9d3] bg-white text-center">
        <p className="text-[#6b6b6b]">No assessments yet. Start your first assessment to begin tracking.</p>
        <Link href="/dashboard/assessments/new">
          <button className="mt-4 px-4 py-2 bg-[#8b7355] text-white rounded-md hover:bg-[#6b5344]">Start Now</button>
        </Link>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {assessments.map((assessment) => (
        <Link key={assessment.id} href={`/dashboard/assessments/${assessment.id}`}>
          <Card className="p-6 border-[#e0d9d3] bg-white hover:shadow-md cursor-pointer transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-[#3d3d3d]">{formatType(assessment.assessment_type)}</h3>
                <p className="text-sm text-[#6b6b6b] mt-1">{new Date(assessment.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-4">
                {assessment.score !== null && (
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#8b7355]">{assessment.score}</p>
                    <p className="text-xs text-[#6b6b6b]">Score</p>
                  </div>
                )}
                {assessment.risk_level && (
                  <Badge className={getRiskColor(assessment.risk_level)}>{assessment.risk_level}</Badge>
                )}
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
