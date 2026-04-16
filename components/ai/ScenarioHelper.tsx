"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"
import { Markdown } from "@/components/ai/Markdown"

interface ScenarioHelperProps {
  children?: { id: string; name: string; stage: string }[]
}

export function ScenarioHelper({ children = [] }: ScenarioHelperProps) {
  const [open, setOpen] = useState(false)
  const [situation, setSituation] = useState("")
  const [childId, setChildId] = useState(children[0]?.id || "")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!situation.trim()) return
    setLoading(true)
    setResponse("")

    const res = await fetch("/api/ai/scenario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        situation,
        childId: childId || undefined,
        stage: children.find((c) => c.id === childId)?.stage,
      }),
    })

    if (res.ok) {
      const data = await res.json()
      setResponse(data.response)
    } else {
      setResponse("Something went wrong. Please try again.")
    }
    setLoading(false)
  }

  function handleClose() {
    setOpen(false)
    setSituation("")
    setResponse("")
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-40 bg-sage text-white px-4 py-3 rounded-full shadow-lg hover:bg-sage-dark transition-all hover:scale-105 flex items-center gap-2 text-sm font-medium"
      >
        <span>🌿</span>
        <span className="hidden sm:inline">Need help?</span>
      </button>

      <Modal open={open} onClose={handleClose} title="Live Scenario Help">
        <div className="space-y-4">
          <p className="text-sm text-ink-muted">
            Describe what&apos;s happening right now. I&apos;ll give you one clear action
            grounded in RIE.
          </p>

          {children.length > 0 && (
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => setChildId(child.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    childId === child.id
                      ? "bg-sage text-white"
                      : "bg-white border border-border text-ink-muted"
                  }`}
                >
                  {child.name}
                </button>
              ))}
            </div>
          )}

          <textarea
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder='e.g., "Two toddlers are fighting over a toy and one is screaming..."'
            className="w-full px-3 py-2.5 rounded-[var(--radius-md)] border border-border-md bg-white text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage min-h-[100px] resize-y text-sm"
          />

          {!response && (
            <Button
              onClick={handleSubmit}
              loading={loading}
              disabled={!situation.trim()}
              className="w-full"
              size="lg"
            >
              Get help now
            </Button>
          )}

          {response && (
            <div className="bg-sage-light rounded-[var(--radius-lg)] p-4">
              <Markdown className="text-sm text-ink">{response}</Markdown>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setResponse("")
                    setSituation("")
                  }}
                >
                  Ask another
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}
