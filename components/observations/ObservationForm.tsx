"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { OBS_CONTEXTS } from "@/lib/utils"

interface ObservationFormProps {
  children: { id: string; name: string; avatarColor: string }[]
  onSave: (data: {
    childId: string
    content: string
    context: string
    tags: string[]
    isPrivate: boolean
  }) => Promise<void>
}

const COMMON_TAGS = [
  "focused", "exploring", "social", "language", "motor",
  "emotional", "independent", "cooperative", "creative", "calm",
  "frustrated", "curious", "gentle", "assertive", "joyful",
]

export function ObservationForm({ children, onSave }: ObservationFormProps) {
  const [childId, setChildId] = useState(children[0]?.id || "")
  const [content, setContent] = useState("")
  const [context, setContext] = useState("FREE_PLAY")
  const [tags, setTags] = useState<string[]>([])
  const [isPrivate, setIsPrivate] = useState(false)
  const [saving, setSaving] = useState(false)
  const [recording, setRecording] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const startVoiceInput = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any
    const SpeechRecognitionAPI = win.SpeechRecognition || win.webkitSpeechRecognition
    if (!SpeechRecognitionAPI) {
      alert("Voice input is not supported in this browser")
      return
    }

    const recognition = new SpeechRecognitionAPI()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onresult = (event: { results: { [index: number]: { 0: { transcript: string } }; length: number } }) => {
      const transcript = Array.from({ length: event.results.length }, (_, i) => event.results[i])
        .map((result) => result[0].transcript)
        .join("")
      setContent(transcript)
    }

    recognition.onerror = () => {
      setRecording(false)
    }

    recognition.onend = () => {
      setRecording(false)
    }

    recognitionRef.current = recognition
    recognition.start()
    setRecording(true)
  }, [])

  const stopVoiceInput = useCallback(() => {
    recognitionRef.current?.stop()
    setRecording(false)
  }, [])

  async function handleSave() {
    if (!content.trim() || !childId) return
    setSaving(true)
    await onSave({ childId, content, context, tags, isPrivate })
    setContent("")
    setTags([])
    setSaving(false)
  }

  return (
    <div className="space-y-5">
      {/* Child selector */}
      <div>
        <p className="text-sm font-medium text-ink-muted mb-2">Child</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => setChildId(child.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                childId === child.id
                  ? "bg-sage text-white"
                  : "bg-white border border-border text-ink-muted hover:border-sage/30"
              }`}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                style={{
                  backgroundColor:
                    childId === child.id
                      ? "rgba(255,255,255,0.3)"
                      : { sage: "#8FAF8B", clay: "#C17F5A", sky: "#7AA8C4", blush: "#C4849A", sand: "#E8E0D5" }[child.avatarColor] || "#8FAF8B",
                }}
              >
                {child.name[0]}
              </div>
              {child.name}
            </button>
          ))}
        </div>
      </div>

      {/* Context selector — icon grid */}
      <div>
        <p className="text-sm font-medium text-ink-muted mb-2">Context</p>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {OBS_CONTEXTS.map((ctx) => (
            <button
              key={ctx.value}
              onClick={() => setContext(ctx.value)}
              className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-[var(--radius-md)] text-center transition-colors ${
                context === ctx.value
                  ? "bg-sage-light border border-sage/30"
                  : "bg-white border border-border hover:border-sage/20"
              }`}
            >
              <span className="text-lg">{ctx.icon}</span>
              <span className="text-[10px] leading-tight text-ink-muted">
                {ctx.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Observation text + voice input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-ink-muted">Observation</p>
          <button
            onClick={recording ? stopVoiceInput : startVoiceInput}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              recording
                ? "bg-red-50 text-red-600 border border-red-200"
                : "bg-white border border-border text-ink-muted hover:border-sage/30"
            }`}
          >
            {recording && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
              <path d="M19 10v2a7 7 0 01-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
            {recording ? "Stop" : "Voice"}
          </button>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Describe what you observed — objective language, no interpretation..."
          className="w-full px-3 py-2.5 rounded-[var(--radius-md)] border border-border-md bg-white text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage min-h-[120px] resize-y text-sm"
        />
      </div>

      {/* Tags */}
      <div>
        <p className="text-sm font-medium text-ink-muted mb-2">Tags</p>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                tags.includes(tag)
                  ? "bg-sage text-white"
                  : "bg-white border border-border text-ink-muted hover:border-sage/30"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Private toggle */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={isPrivate}
          onChange={(e) => setIsPrivate(e.target.checked)}
          className="w-4 h-4 rounded border-border-md text-sage focus:ring-sage/30"
        />
        <span className="text-sm text-ink-muted">Private (not shared with families)</span>
      </label>

      {/* Save */}
      <Button
        onClick={handleSave}
        loading={saving}
        disabled={!content.trim() || !childId}
        className="w-full"
        size="lg"
      >
        Save observation
      </Button>
    </div>
  )
}
