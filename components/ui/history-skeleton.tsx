"use client"

import { Card, CardContent } from "@/components/ui/card"

export function HistorySkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="bg-card/50 border-border/50 animate-pulse overflow-hidden">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/4 bg-muted rounded" />
              <div className="h-3 w-1/2 bg-muted rounded" />
            </div>
            <div className="w-20 h-4 bg-muted rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
