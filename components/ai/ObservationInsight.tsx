"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Markdown } from "@/components/ai/Markdown"

interface ObservationInsightProps {
  observationId: string
  childId: string
}

export function ObservationInsight({
  observationId,
  childId,
}: ObservationInsightProps) {
  const [insight, setInsight] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)

  async function generateInsight() {
    setLoading(true)
    const res = await fetch("/api/ai/insight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ observationId, childId }),
    })

    if (res.ok) {
      const data = await res.json()
      setInsight(data.response)
      setExpanded(true)
    }
    setLoading(false)
  }

  if (insight && expanded) {
    return (
      <Card className="bg-sage-light/50 border-sage/20 mt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-sage-dark flex items-center gap-1">
            <span>🌿</span> AI Insight
          </span>
          <button
            onClick={() => setExpanded(false)}
            className="text-xs text-ink-faint hover:text-ink-muted"
          >
            Hide
          </button>
        </div>
        <Markdown className="text-sm text-ink">{insight}</Markdown>
      </Card>
    )
  }

  if (insight && !expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="mt-2 text-xs text-sage-dark hover:underline flex items-center gap-1"
      >
        <span>🌿</span> Show AI insight
      </button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={generateInsight}
      loading={loading}
      className="mt-2 text-xs"
    >
      <span className="mr-1">🌿</span> Generate insight
    </Button>
  )
}
