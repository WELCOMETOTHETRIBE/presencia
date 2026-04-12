"use client"

import { useState } from "react"
import { Tabs } from "@/components/ui/Tabs"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
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
              </Card>
            ))
          )}
        </div>
      )}

      {tab === "milestones" && (
        <div className="space-y-3">
          {milestones.length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-ink-faint text-sm">
                No milestones observed yet
              </p>
            </Card>
          ) : (
            milestones.map((m) => (
              <Card key={m.id}>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="sage">{m.milestone.category}</Badge>
                  <span className="text-xs text-ink-faint">
                    {formatRelative(m.seenAt)}
                  </span>
                </div>
                <h4 className="font-medium text-ink text-sm">
                  {m.milestone.title}
                </h4>
                <p className="text-xs text-ink-muted mt-1">
                  {m.milestone.description}
                </p>
                {m.milestone.rieNote && (
                  <p className="text-xs text-sage-dark mt-1 italic">
                    {m.milestone.rieNote}
                  </p>
                )}
                {m.notes && (
                  <p className="text-xs text-ink-muted mt-1">Note: {m.notes}</p>
                )}
              </Card>
            ))
          )}
        </div>
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
