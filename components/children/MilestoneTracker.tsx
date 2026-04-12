"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { useToast } from "@/components/ui/Toast"

interface Milestone {
  id: string
  stage: string
  category: string
  title: string
  description: string
  rieNote: string | null
  typicalWindow: string | null
}

interface MilestoneCheck {
  milestoneId: string
  seenAt: string
}

interface MilestoneTrackerProps {
  childId: string
  childStage: string
  existingChecks: MilestoneCheck[]
}

export function MilestoneTracker({
  childId,
  childStage,
  existingChecks,
}: MilestoneTrackerProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [checks, setChecks] = useState<Set<string>>(
    new Set(existingChecks.map((c) => c.milestoneId))
  )
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetch(`/api/milestones?stage=${childStage}`)
      .then((r) => r.json())
      .then((data) => {
        setMilestones(data)
        setLoading(false)
      })
  }, [childStage])

  const categories = Array.from(new Set(milestones.map((m) => m.category)))

  async function toggleMilestone(milestoneId: string) {
    if (checks.has(milestoneId)) return // Don't uncheck

    const res = await fetch("/api/milestones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ childId, milestoneId }),
    })

    if (res.ok) {
      setChecks((prev) => new Set([...prev, milestoneId]))
      toast("Milestone observed")
    }
  }

  if (loading) {
    return (
      <div className="py-8 text-center text-sm text-ink-faint">
        Loading milestones...
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-ink-muted">
        {checks.size} of {milestones.length} milestones observed
      </p>
      <div className="w-full bg-sand rounded-full h-2">
        <div
          className="bg-sage rounded-full h-2 transition-all duration-500"
          style={{
            width: `${milestones.length > 0 ? (checks.size / milestones.length) * 100 : 0}%`,
          }}
        />
      </div>

      {categories.map((cat) => {
        const catMilestones = milestones.filter((m) => m.category === cat)
        const catChecked = catMilestones.filter((m) => checks.has(m.id)).length
        const isExpanded = expandedCategory === cat

        return (
          <Card key={cat}>
            <button
              onClick={() => setExpandedCategory(isExpanded ? null : cat)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-ink text-sm">{cat}</h4>
                <Badge variant="muted">
                  {catChecked}/{catMilestones.length}
                </Badge>
              </div>
              <svg
                className={`w-4 h-4 text-ink-faint transition-transform ${isExpanded ? "rotate-90" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {isExpanded && (
              <div className="mt-3 space-y-2 border-t border-border pt-3">
                {catMilestones.map((m) => {
                  const isChecked = checks.has(m.id)
                  return (
                    <button
                      key={m.id}
                      onClick={() => toggleMilestone(m.id)}
                      className={`w-full text-left flex items-start gap-3 p-2 rounded-[var(--radius-sm)] transition-colors ${
                        isChecked ? "bg-sage-light/50" : "hover:bg-cream"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                          isChecked
                            ? "bg-sage border-sage"
                            : "border-border-md"
                        }`}
                      >
                        {isChecked && (
                          <svg
                            className="w-3 h-3 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${isChecked ? "text-ink-muted" : "text-ink"}`}>
                          {m.title}
                        </p>
                        {m.typicalWindow && (
                          <p className="text-xs text-ink-faint">
                            {m.typicalWindow}
                          </p>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}
