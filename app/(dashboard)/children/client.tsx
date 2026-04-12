"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"
import { ChildForm, type ChildFormData } from "@/components/children/ChildForm"
import { useToast } from "@/components/ui/Toast"

export function ChildrenClient() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function handleCreate(data: ChildFormData) {
    const res = await fetch("/api/children", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      toast("Child added")
      setOpen(false)
      router.refresh()
    } else {
      toast("Failed to add child", "error")
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add child</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Add a new child">
        <ChildForm onSubmit={handleCreate} />
      </Modal>
    </>
  )
}
