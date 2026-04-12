"use client"

import { useRouter } from "next/navigation"
import { QuickLogWidget } from "@/components/dashboard/QuickLogWidget"
import { useToast } from "@/components/ui/Toast"

interface DashboardClientProps {
  children: { id: string; name: string }[]
}

export function DashboardClient({ children }: DashboardClientProps) {
  const router = useRouter()
  const { toast } = useToast()

  async function handleQuickLog(childId: string, content: string) {
    const res = await fetch("/api/observations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        childId,
        content,
        context: "FREE_PLAY",
        tags: [],
      }),
    })

    if (res.ok) {
      toast("Observation saved")
      router.refresh()
    } else {
      toast("Failed to save observation", "error")
    }
  }

  return <QuickLogWidget children={children} onSave={handleQuickLog} />
}
