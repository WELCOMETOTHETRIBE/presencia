"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Textarea } from "@/components/ui/Textarea"

interface ChildFormProps {
  onSubmit: (data: ChildFormData) => Promise<void>
  initial?: Partial<ChildFormData>
  submitLabel?: string
}

export interface ChildFormData {
  name: string
  dob: string
  stage: string
  avatarColor: string
  allergies: string
  notes: string
  temperament: string
  familyNotes: string
}

const STAGES = [
  { value: "INFANT", label: "Infant (0-12 months)" },
  { value: "TODDLER", label: "Toddler (1-3 years)" },
  { value: "PRESCHOOL", label: "Preschool (3-6 years)" },
]

const COLORS = [
  { value: "sage", label: "Sage" },
  { value: "clay", label: "Clay" },
  { value: "sky", label: "Sky" },
  { value: "blush", label: "Blush" },
  { value: "sand", label: "Sand" },
]

export function ChildForm({ onSubmit, initial, submitLabel = "Add child" }: ChildFormProps) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<ChildFormData>({
    name: initial?.name || "",
    dob: initial?.dob || "",
    stage: initial?.stage || "INFANT",
    avatarColor: initial?.avatarColor || "sage",
    allergies: initial?.allergies || "",
    notes: initial?.notes || "",
    temperament: initial?.temperament || "",
    familyNotes: initial?.familyNotes || "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await onSubmit(data)
    setLoading(false)
  }

  function update(field: keyof ChildFormData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Child's first name"
        value={data.name}
        onChange={(e) => update("name", e.target.value)}
        placeholder="First name only"
        required
      />
      <Input
        label="Date of birth"
        type="date"
        value={data.dob}
        onChange={(e) => update("dob", e.target.value)}
        required
      />
      <Select
        label="Stage"
        value={data.stage}
        onChange={(e) => update("stage", e.target.value)}
        options={STAGES}
      />
      <Select
        label="Avatar color"
        value={data.avatarColor}
        onChange={(e) => update("avatarColor", e.target.value)}
        options={COLORS}
      />
      <Input
        label="Temperament notes"
        value={data.temperament}
        onChange={(e) => update("temperament", e.target.value)}
        placeholder="e.g., Cautious, curious, active"
      />
      <Input
        label="Allergies"
        value={data.allergies}
        onChange={(e) => update("allergies", e.target.value)}
        placeholder="Any known allergies"
      />
      <Textarea
        label="Family notes"
        value={data.familyNotes}
        onChange={(e) => update("familyNotes", e.target.value)}
        placeholder="Family context, preferences, routines at home..."
      />
      <Textarea
        label="Additional notes"
        value={data.notes}
        onChange={(e) => update("notes", e.target.value)}
        placeholder="Anything else relevant..."
      />
      <Button type="submit" loading={loading} className="w-full" size="lg">
        {submitLabel}
      </Button>
    </form>
  )
}
