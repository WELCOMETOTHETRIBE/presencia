"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Modal } from "@/components/ui/Modal"
import { useToast } from "@/components/ui/Toast"

interface Routine {
  id: string
  childId: string
  label: string
  time: string
  type: string
  notes: string | null
  order: number
}

interface RoutinesClientProps {
  children: { id: string; name: string; avatarColor: string }[]
  initialRoutines: Routine[]
}

const TYPES = [
  { value: "CARE", label: "Care Routine" },
  { value: "PLAY", label: "Play" },
  { value: "REST", label: "Rest" },
  { value: "TRANSITION", label: "Transition" },
  { value: "FEEDING", label: "Feeding" },
]

const typeColors: Record<string, string> = {
  CARE: "clay",
  PLAY: "sage",
  REST: "blush",
  TRANSITION: "sky",
  FEEDING: "sand",
}

export function RoutinesClient({ children, initialRoutines }: RoutinesClientProps) {
  const [selectedChild, setSelectedChild] = useState(children[0]?.id || "")
  const [showAdd, setShowAdd] = useState(false)
  const [label, setLabel] = useState("")
  const [time, setTime] = useState("08:00")
  const [type, setType] = useState("CARE")
  const [notes, setNotes] = useState("")
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const routines = initialRoutines
    .filter((r) => r.childId === selectedChild)
    .sort((a, b) => a.time.localeCompare(b.time))

  async function handleAdd() {
    if (!label || !selectedChild) return
    setSaving(true)
    const res = await fetch("/api/routines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        childId: selectedChild,
        label,
        time,
        type,
        notes: notes || null,
        order: routines.length,
      }),
    })
    if (res.ok) {
      toast("Routine added")
      setShowAdd(false)
      setLabel("")
      setNotes("")
      router.refresh()
    } else {
      toast("Failed to add routine", "error")
    }
    setSaving(false)
  }

  if (children.length === 0) {
    return (
      <Card className="text-center py-12">
        <div className="text-3xl mb-3">🕐</div>
        <p className="text-ink-muted text-sm">
          Add a child first to build their daily routine
        </p>
        <Button
          variant="secondary"
          size="sm"
          className="mt-4"
          onClick={() => (window.location.href = "/children")}
        >
          Go to Children
        </Button>
      </Card>
    )
  }

  return (
    <div>
      {/* Child selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {children.map((child) => (
          <button
            key={child.id}
            onClick={() => setSelectedChild(child.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedChild === child.id
                ? "bg-sage text-white"
                : "bg-white border border-border text-ink-muted"
            }`}
          >
            {child.name}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {routines.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-ink-muted text-sm mb-4">
            No routines set up yet for this child
          </p>
          <Button onClick={() => setShowAdd(true)}>Add first routine</Button>
        </Card>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[51px] top-0 bottom-0 w-px bg-border" />

          <div className="space-y-3">
            {routines.map((r) => (
              <div key={r.id} className="flex items-start gap-4 relative">
                <div className="text-sm font-mono text-ink-muted w-12 text-right shrink-0 pt-3">
                  {r.time}
                </div>
                <div className="w-3 h-3 rounded-full bg-white border-2 border-sage mt-4 shrink-0 z-10" />
                <Card className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-ink text-sm">{r.label}</h4>
                    <Badge variant={(typeColors[r.type] || "sand") as "sage" | "clay" | "sky" | "blush" | "sand"}>
                      {TYPES.find((t) => t.value === r.type)?.label || r.type}
                    </Badge>
                  </div>
                  {r.notes && (
                    <p className="text-xs text-ink-muted mt-1">{r.notes}</p>
                  )}
                </Card>
              </div>
            ))}
          </div>

          <div className="mt-6 ml-[67px]">
            <Button variant="secondary" onClick={() => setShowAdd(true)}>
              + Add routine block
            </Button>
          </div>
        </div>
      )}

      {/* Add Modal */}
      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="Add routine block"
      >
        <div className="space-y-4">
          <Input
            label="Label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g., Morning greeting, Diaper change"
            required
          />
          <Input
            label="Time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
          <Select
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={TYPES}
          />
          <Input
            label="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="RIE narration cues, reminders..."
          />
          <Button onClick={handleAdd} loading={saving} className="w-full" size="lg">
            Add to routine
          </Button>
        </div>
      </Modal>
    </div>
  )
}
