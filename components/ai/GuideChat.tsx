"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface GuideChatProps {
  children: { id: string; name: string }[]
}

const FEATURES = [
  { value: "GUIDE_CHAT", label: "Ask RIE" },
  { value: "SCENARIO_HELP", label: "Live Help" },
  { value: "PARENT_COMM_DRAFT", label: "Family Draft" },
]

export function GuideChat({ children }: GuideChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [childId, setChildId] = useState(children[0]?.id || "")
  const [feature, setFeature] = useState("GUIDE_CHAT")
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [streaming, setStreaming] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  async function handleSend() {
    const text = input.trim()
    if (!text || streaming) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setStreaming(true)

    const assistantId = (Date.now() + 1).toString()
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "" },
    ])

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationId,
          childId: childId || undefined,
          feature,
        }),
      })

      if (!res.ok) throw new Error("Failed to send message")

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error("No reader")

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue
          const data = JSON.parse(line.slice(6))

          if (data.text) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: m.content + data.text }
                  : m
              )
            )
          }

          if (data.done && data.conversationId) {
            setConversationId(data.conversationId)
          }
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "I'm sorry, something went wrong. Please try again." }
            : m
        )
      )
    } finally {
      setStreaming(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleNewChat() {
    setMessages([])
    setConversationId(null)
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-8rem)] md:h-[calc(100dvh-6rem)]">
      {/* Top bar: child + feature selectors */}
      <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-border">
        {children.length > 0 && (
          <div className="flex gap-1.5 overflow-x-auto">
            <button
              onClick={() => setChildId("")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                !childId
                  ? "bg-sage text-white"
                  : "bg-white border border-border text-ink-muted"
              }`}
            >
              General
            </button>
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

        <div className="flex gap-1.5 ml-auto">
          {FEATURES.map((f) => (
            <button
              key={f.value}
              onClick={() => setFeature(f.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                feature === f.value
                  ? "bg-clay text-white"
                  : "bg-white border border-border text-ink-muted"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🌿</div>
            <h3 className="font-heading text-xl text-ink mb-2">
              Your RIE Guide
            </h3>
            <p className="text-sm text-ink-muted max-w-sm mx-auto">
              Ask about RIE principles, get help with a situation, or draft a
              message to a family. Grounded in the Presencia Brain.
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-6">
              {[
                "What is RIE?",
                "Toddler hitting — what do I say?",
                "How is RIE different from Montessori?",
                "Help me narrate a diaper change",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setInput(q)
                    textareaRef.current?.focus()
                  }}
                  className="px-3 py-2 bg-white border border-border rounded-[var(--radius-md)] text-xs text-ink-muted hover:border-sage/30 transition-colors text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[70%] px-4 py-3 rounded-[var(--radius-lg)] text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-sage text-white rounded-br-sm"
                  : "bg-white border border-border text-ink rounded-bl-sm"
              }`}
            >
              {msg.role === "assistant" ? (
                <div className="whitespace-pre-wrap">
                  {msg.content || (
                    <span className="inline-flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-ink-faint animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-ink-faint animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-ink-faint animate-bounce [animation-delay:300ms]" />
                    </span>
                  )}
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-border pt-3 pb-1">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                feature === "SCENARIO_HELP"
                  ? "Describe what's happening right now..."
                  : feature === "PARENT_COMM_DRAFT"
                    ? "Describe the situation for the family message..."
                    : "Ask your RIE question..."
              }
              rows={1}
              className="w-full px-4 py-3 pr-12 rounded-[var(--radius-lg)] border border-border-md bg-white text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage resize-none text-sm min-h-[48px] max-h-[120px]"
              style={{ height: "48px" }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement
                target.style.height = "48px"
                target.style.height = Math.min(target.scrollHeight, 120) + "px"
              }}
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!input.trim() || streaming}
            size="md"
            className="shrink-0 h-12 w-12 !p-0"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-[10px] text-ink-faint">
            Grounded in the Presencia Brain &middot; {feature === "GUIDE_CHAT" ? "RIE Guide" : feature === "SCENARIO_HELP" ? "Live Help" : "Family Draft"}
          </p>
          {messages.length > 0 && (
            <button
              onClick={handleNewChat}
              className="text-[10px] text-ink-faint hover:text-ink-muted"
            >
              New conversation
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
