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
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "moderate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const formatType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  if (assessments.length === 0) {
    return (
      <Card className="p-12 border-dashed border-2 text-center shadow-none bg-muted/20">
        <p className="text-muted-foreground">No assessments yet. Start your first assessment to begin tracking.</p>
        <Link href="/dashboard/assessments/new">
          <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">Start Now</button>
        </Link>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {assessments.map((assessment) => (
        <Link key={assessment.id} href={`/dashboard/assessments/${assessment.id}`}>
          <Card className="p-5 border-border shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer bg-card/50 backdrop-blur-sm">
            <div className="flex flex-col h-full justify-between gap-4">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="capitalize text-muted-foreground">
                    {formatType(assessment.assessment_type)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{new Date(assessment.created_at).toLocaleDateString()}</span>
                </div>
                {/* <h3 className="font-semibold text-foreground text-lg">{formatType(assessment.assessment_type)}</h3> */}
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-primary">{assessment.score ?? "-"}</p>
                  <p className="text-xs text-muted-foreground mt-1">Score</p>
                </div>
                {assessment.risk_level && (
                  <Badge className={getRiskColor(assessment.risk_level)} variant="secondary">{assessment.risk_level}</Badge>
                )}
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
