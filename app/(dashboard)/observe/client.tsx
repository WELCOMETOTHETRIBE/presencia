"use client"

import { useRouter } from "next/navigation"
import { ObservationForm } from "@/components/observations/ObservationForm"
import { useToast } from "@/components/ui/Toast"

interface ObserveClientProps {
  children: { id: string; name: string; avatarColor: string }[]
}

export function ObserveClient({ children }: ObserveClientProps) {
  const router = useRouter()
  const { toast } = useToast()

  async function handleSave(data: {
    childId: string
    content: string
    context: string
    tags: string[]
    isPrivate: boolean
  }) {
    const res = await fetch("/api/observations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      toast("Observation saved")
      router.refresh()
    } else {
      toast("Failed to save observation", "error")
    }
  }

  if (children.length === 0) {
    return (
      <div className="bg-white rounded-[var(--radius-lg)] border border-border p-8 text-center">
        <p className="text-ink-muted text-sm">
          Add a child first to start logging observations
        </p>
        <a
          href="/children"
          className="text-sage-dark text-sm font-medium hover:underline mt-2 inline-block"
        >
          Go to Children
        </a>
      </div>
    )
  }

  return <ObservationForm children={children} onSave={handleSave} />
}
