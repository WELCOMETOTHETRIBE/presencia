"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"

interface QuickLogWidgetProps {
  children: { id: string; name: string }[]
  onSave: (childId: string, content: string) => Promise<void>
}

export function QuickLogWidget({ children, onSave }: QuickLogWidgetProps) {
  const [childId, setChildId] = useState(children[0]?.id || "")
  const [content, setContent] = useState("")
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!content.trim() || !childId) return
    setSaving(true)
    await onSave(childId, content)
    setContent("")
    setSaving(false)
  }

  if (children.length === 0) {
    return (
      <Card className="text-center py-8">
        <p className="text-ink-muted text-sm">
          Add a child to start logging observations
        </p>
      </Card>
    )
  }

  return (
    <Card>
      <p className="text-sm font-medium text-ink-muted mb-3">Quick observation</p>
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
        {children.map((child) => (
          <button
            key={child.id}
            onClick={() => setChildId(child.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              childId === child.id
                ? "bg-sage text-white"
                : "bg-sage-light text-sage-dark"
            }`}
          >
            {child.name}
          </button>
        ))}
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What did you observe?"
        className="w-full px-3 py-2.5 rounded-[var(--radius-md)] border border-border-md bg-white text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage min-h-[80px] resize-y text-sm"
      />
      <Button
        onClick={handleSave}
        loading={saving}
        disabled={!content.trim()}
        className="w-full mt-3"
        size="lg"
      >
        Save observation
      </Button>
    </Card>
  )
}
