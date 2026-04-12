"use client"

import { useState } from "react"
import { Tabs } from "@/components/ui/Tabs"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { ObservationInsight } from "@/components/ai/ObservationInsight"
import { MilestoneTracker } from "@/components/children/MilestoneTracker"
import { useToast } from "@/components/ui/Toast"
import { formatRelative } from "@/lib/utils"

const TABS = [
  { value: "observations", label: "Observations" },
  { value: "milestones", label: "Milestones" },
  { value: "routines", label: "Routines" },
]

const contextLabels: Record<string, string> = {
  FREE_PLAY: "Free Play",
  CARE_ROUTINE: "Care Routine",
  FEEDING: "Feeding",
  TRANSITION: "Transition",
  PEER_INTERACTION: "Peer Interaction",
  EMOTIONAL_MOMENT: "Emotional Moment",
  OUTDOOR: "Outdoor",
  GROUP: "Group",
}

interface ChildProfileClientProps {
  childId: string
  childStage: string
  observations: {
    id: string
    content: string
    context: string
    tags: string[]
    loggedAt: string
    isPrivate: boolean
  }[]
  milestones: {
    id: string
    seenAt: string
    notes: string | null
    milestone: {
      id: string
      title: string
      category: string
      description: string
      rieNote: string | null
    }
  }[]
  routines: {
    id: string
    label: string
    time: string
    type: string
    notes: string | null
  }[]
}

export function ChildProfileClient({
  childId,
  childStage,
  observations,
  milestones,
  routines,
}: ChildProfileClientProps) {
  const [tab, setTab] = useState("observations")

  return (
    <div>
      <Tabs tabs={TABS} value={tab} onChange={setTab} className="mb-6" />

      {tab === "observations" && (
        <div className="space-y-3">
          {observations.length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-ink-faint text-sm">No observations yet</p>
            </Card>
          ) : (
            observations.map((obs) => (
              <Card key={obs.id}>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="sand">
                    {contextLabels[obs.context] || obs.context}
                  </Badge>
                  <span className="text-xs text-ink-faint">
                    {formatRelative(obs.loggedAt)}
                  </span>
                  {obs.isPrivate && <Badge variant="blush">Private</Badge>}
                </div>
                <p className="text-sm text-ink leading-relaxed">{obs.content}</p>
                {obs.tags.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {obs.tags.map((tag) => (
                      <Badge key={tag} variant="muted">{tag}</Badge>
                    ))}
                  </div>
                )}
                <ObservationInsight observationId={obs.id} childId={childId} />
              </Card>
            ))
          )}
        </div>
      )}

      {tab === "milestones" && (
        <MilestoneTracker
          childId={childId}
          childStage={childStage}
          existingChecks={milestones.map((m) => ({
            milestoneId: m.milestone.id,
            seenAt: m.seenAt,
          }))}
        />
      )}

      {tab === "routines" && (
        <div className="space-y-3">
          {routines.length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-ink-faint text-sm">No routines set up yet</p>
            </Card>
          ) : (
            routines.map((r) => (
              <Card key={r.id} className="flex items-center gap-3">
                <div className="text-sm font-mono text-ink-muted w-16 shrink-0">
                  {r.time}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink">{r.label}</p>
                  {r.notes && (
                    <p className="text-xs text-ink-muted">{r.notes}</p>
                  )}
                </div>
                <Badge variant="sand">{r.type}</Badge>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export function ShareButton({ childId }: { childId: string }) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  async function handleShare() {
    setLoading(true)
    const res = await fetch(`/api/children/${childId}/share`, {
      method: "POST",
    })
    if (res.ok) {
      const { url } = await res.json()
      const fullUrl = window.location.origin + url

      if (navigator.share) {
        navigator.share({
          title: "Child's Presencia Journal",
          url: fullUrl,
        })
      } else {
        await navigator.clipboard.writeText(fullUrl)
        toast("Portal link copied to clipboard")
      }
    } else {
      toast("Failed to generate share link", "error")
    }
    setLoading(false)
  }

  return (
    <Button variant="secondary" size="sm" onClick={handleShare} loading={loading}>
      <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
      </svg>
      Share with family
    </Button>
  )
}
