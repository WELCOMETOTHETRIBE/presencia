"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useToast } from "@/components/ui/Toast"

interface Question {
  section: string
  question: string
  askWho: string
  stage: string
  rieRelevance: string
  followUp: string
}

interface OnboardWizardProps {
  questions: Question[]
}

// Map section letters to friendly names, icons, descriptions
const SECTIONS: Record<
  string,
  { title: string; icon: string; description: string; color: string }
> = {
  A: {
    title: "Child Identity",
    icon: "🌱",
    description: "Let\u2019s get to know this child.",
    color: "sage",
  },
  B: {
    title: "Medical & Physical",
    icon: "🩺",
    description: "Health, sensory, and motor details that shape daily care.",
    color: "sky",
  },
  C: {
    title: "Sleep & Rest",
    icon: "🌙",
    description: "Every child finds rest in their own way.",
    color: "blush",
  },
  D: {
    title: "Feeding",
    icon: "🍽",
    description: "Mealtimes are care moments \u2014 not just nutrition.",
    color: "clay",
  },
  E: {
    title: "Temperament",
    icon: "💛",
    description: "The way this child moves through the world.",
    color: "clay",
  },
  F: {
    title: "Attachment & Separation",
    icon: "🤲",
    description: "Understanding the bonds that matter most.",
    color: "blush",
  },
  G: {
    title: "Home Environment",
    icon: "🏡",
    description: "The world they come from shapes the world they explore.",
    color: "sage",
  },
  H: {
    title: "Family Goals",
    icon: "✨",
    description: "What does this family hope for?",
    color: "clay",
  },
}

// Step 0 is the basic info step (name, DOB, stage)
const TOTAL_EXTRA_STEPS = 1 // basic info step

const AVATAR_COLORS = [
  { value: "sage", label: "Sage", hex: "#8FAF8B" },
  { value: "clay", label: "Clay", hex: "#C17F5A" },
  { value: "sky", label: "Sky", hex: "#7AA8C4" },
  { value: "blush", label: "Blush", hex: "#C4849A" },
  { value: "sand", label: "Sand", hex: "#E8E0D5" },
]

export function OnboardWizard({ questions }: OnboardWizardProps) {
  const router = useRouter()
  const { toast } = useToast()

  // Group questions by section letter
  const sectionKeys = Array.from(
    new Set(questions.map((q) => q.section.charAt(0)))
  ).filter((k) => SECTIONS[k])

  const totalSteps = sectionKeys.length + TOTAL_EXTRA_STEPS + 1 // +1 for welcome, +1 for basic info
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)

  // Basic child info
  const [name, setName] = useState("")
  const [dob, setDob] = useState("")
  const [stage, setStage] = useState("")
  const [avatarColor, setAvatarColor] = useState("sage")

  // Answers keyed by question text
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const setAnswer = useCallback((question: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [question]: value }))
  }, [])

  const progress = Math.round((step / (totalSteps - 1)) * 100)

  // Auto-detect stage from DOB
  function handleDobChange(value: string) {
    setDob(value)
    if (value) {
      const months = Math.floor(
        (Date.now() - new Date(value).getTime()) / (1000 * 60 * 60 * 24 * 30.44)
      )
      if (months < 12) setStage("INFANT")
      else if (months < 36) setStage("TODDLER")
      else setStage("PRESCHOOL")
    }
  }

  async function handleComplete() {
    if (!name || !dob || !stage) {
      toast("Please complete the child's basic info", "error")
      setStep(1)
      return
    }

    setSaving(true)

    // Build notes from all answers
    const allNotes = sectionKeys
      .map((key) => {
        const sectionQs = questions.filter((q) => q.section.charAt(0) === key)
        const sectionAnswers = sectionQs
          .filter((q) => answers[q.question]?.trim())
          .map((q) => `${q.question}: ${answers[q.question]}`)
        if (sectionAnswers.length === 0) return ""
        return `## ${SECTIONS[key]?.title || key}\n${sectionAnswers.join("\n")}`
      })
      .filter(Boolean)
      .join("\n\n")

    // Extract specific fields from answers
    const allergies = answers["Known allergies (food, environmental, skin)"] || ""
    const temperament =
      answers["Activity level (highly active / calm / variable by time of day)"] || ""
    const familyNotes =
      answers["What are the family\u2019s main hopes for this care arrangement?"] || ""

    const res = await fetch("/api/children", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        dob,
        stage,
        avatarColor,
        allergies,
        temperament,
        familyNotes,
        notes: allNotes,
      }),
    })

    if (res.ok) {
      const child = await res.json()
      toast(`${name} has been welcomed into your care`)
      router.push(`/children/${child.id}`)
    } else {
      toast("Something went wrong. Please try again.", "error")
    }
    setSaving(false)
  }

  function next() {
    if (step < totalSteps - 1) setStep(step + 1)
  }
  function prev() {
    if (step > 0) setStep(step - 1)
  }

  return (
    <div className="min-h-[calc(100dvh-8rem)] flex flex-col">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-ink-faint">
            Step {step + 1} of {totalSteps}
          </p>
          <p className="text-xs text-ink-faint">{progress}%</p>
        </div>
        <div className="w-full bg-sand rounded-full h-1.5">
          <div
            className="bg-sage rounded-full h-1.5 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 max-w-2xl mx-auto w-full">
        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="text-center py-8 md:py-16 animate-in fade-in duration-500">
            <div className="text-5xl mb-6">🌿</div>
            <h1 className="font-heading text-3xl md:text-4xl text-ink mb-4">
              Welcome a new child
            </h1>
            <p className="text-ink-muted text-lg leading-relaxed max-w-md mx-auto mb-3">
              This intake is grounded in RIE principles. Each question helps you
              see the whole child &mdash; not just what they can do, but who they
              are.
            </p>
            <p className="text-ink-faint text-sm italic max-w-sm mx-auto">
              Take your time. You can always come back and add more later.
            </p>
          </div>
        )}

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="mb-8">
              <span className="text-3xl">🌱</span>
              <h2 className="font-heading text-2xl text-ink mt-3 mb-1">
                The basics
              </h2>
              <p className="text-sm text-ink-muted">
                Just enough to begin. Everything else unfolds through
                observation.
              </p>
            </div>

            <div className="space-y-5">
              <Input
                label="Child's first name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First name only \u2014 privacy matters"
                required
              />
              <Input
                label="Date of birth"
                type="date"
                value={dob}
                onChange={(e) => handleDobChange(e.target.value)}
                required
              />
              {stage && (
                <div className="bg-sage-light rounded-[var(--radius-md)] px-4 py-3">
                  <p className="text-sm text-sage-dark">
                    Stage:{" "}
                    <strong>
                      {stage === "INFANT"
                        ? "Infant (0\u201312 months)"
                        : stage === "TODDLER"
                          ? "Toddler (1\u20133 years)"
                          : "Preschool (3\u20136 years)"}
                    </strong>
                  </p>
                </div>
              )}

              <div>
                <p className="block text-sm font-medium text-ink-muted mb-2">
                  Choose a color for {name || "this child"}
                </p>
                <div className="flex gap-3">
                  {AVATAR_COLORS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setAvatarColor(c.value)}
                      className={`w-12 h-12 rounded-full transition-all ${
                        avatarColor === c.value
                          ? "ring-2 ring-offset-2 ring-sage scale-110"
                          : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.label}
                    >
                      {avatarColor === c.value && (
                        <svg
                          className="w-5 h-5 mx-auto text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Steps 2+: Brain onboarding sections */}
        {step >= 2 &&
          step < 2 + sectionKeys.length &&
          (() => {
            const sectionKey = sectionKeys[step - 2]
            const section = SECTIONS[sectionKey]
            const sectionQs = questions.filter(
              (q) => q.section.charAt(0) === sectionKey
            )

            return (
              <div
                key={sectionKey}
                className="animate-in fade-in slide-in-from-right-4 duration-300"
              >
                <div className="mb-8">
                  <span className="text-3xl">{section?.icon}</span>
                  <h2 className="font-heading text-2xl text-ink mt-3 mb-1">
                    {section?.title}
                  </h2>
                  <p className="text-sm text-ink-muted">
                    {section?.description}
                  </p>
                </div>

                <div className="space-y-6">
                  {sectionQs.map((q, i) => (
                    <div key={i}>
                      <label className="block text-sm font-medium text-ink mb-1.5">
                        {q.question}
                      </label>
                      {q.rieRelevance && (
                        <p className="text-xs text-sage-dark mb-2 italic">
                          {q.rieRelevance}
                        </p>
                      )}
                      <textarea
                        value={answers[q.question] || ""}
                        onChange={(e) => setAnswer(q.question, e.target.value)}
                        placeholder="Your observation or the family\u2019s answer..."
                        className="w-full px-3 py-2.5 rounded-[var(--radius-md)] border border-border-md bg-white text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage resize-y text-sm min-h-[72px]"
                        rows={2}
                      />
                      {q.followUp && (
                        <p className="text-[11px] text-ink-faint mt-1">
                          Follow-up: {q.followUp}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}

        {/* Final step: Review & Complete */}
        {step === totalSteps - 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 text-center py-8">
            <div
              className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold"
              style={{
                backgroundColor:
                  AVATAR_COLORS.find((c) => c.value === avatarColor)?.hex ||
                  "#8FAF8B",
              }}
            >
              {name ? name[0].toUpperCase() : "?"}
            </div>
            <h2 className="font-heading text-2xl text-ink mb-2">
              Welcome, {name || "little one"}.
            </h2>
            <p className="text-ink-muted text-sm max-w-md mx-auto mb-2">
              {Object.values(answers).filter((a) => a.trim()).length} questions
              answered across {sectionKeys.length} sections.
            </p>
            <p className="text-ink-faint text-xs italic max-w-sm mx-auto mb-8">
              You can always update this information later from {name || "the child"}&apos;s profile.
            </p>

            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 text-left">
              {sectionKeys.map((key) => {
                const section = SECTIONS[key]
                const sectionQs = questions.filter(
                  (q) => q.section.charAt(0) === key
                )
                const answered = sectionQs.filter(
                  (q) => answers[q.question]?.trim()
                ).length
                return (
                  <div
                    key={key}
                    className="bg-white rounded-[var(--radius-md)] border border-border p-3"
                  >
                    <span className="text-lg">{section?.icon}</span>
                    <p className="text-xs font-medium text-ink mt-1">
                      {section?.title}
                    </p>
                    <p className="text-[11px] text-ink-faint">
                      {answered}/{sectionQs.length} answered
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="sticky bottom-0 bg-cream pt-4 pb-2 border-t border-border mt-8">
        <div className="max-w-2xl mx-auto w-full flex items-center justify-between gap-3">
          {step > 0 ? (
            <Button variant="ghost" onClick={prev}>
              Back
            </Button>
          ) : (
            <div />
          )}

          {step === 0 && (
            <Button onClick={next} size="lg">
              Begin intake
            </Button>
          )}

          {step > 0 && step < totalSteps - 1 && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => setStep(totalSteps - 1)}>
                Skip to end
              </Button>
              <Button onClick={next}>Continue</Button>
            </div>
          )}

          {step === totalSteps - 1 && (
            <Button
              onClick={handleComplete}
              loading={saving}
              disabled={!name || !dob}
              size="lg"
            >
              Welcome {name || "child"} into care
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
