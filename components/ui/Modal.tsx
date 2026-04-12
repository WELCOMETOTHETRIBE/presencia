"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
    >
      <div className="absolute inset-0 bg-ink/30 animate-in fade-in duration-200" />
      <div
        className={cn(
          "relative z-10 bg-white w-full max-h-[85vh] overflow-y-auto",
          "md:max-w-lg md:rounded-[var(--radius-lg)]",
          "rounded-t-[var(--radius-xl)] shadow-[var(--shadow-lg)]",
          "animate-in slide-in-from-bottom duration-300 md:slide-in-from-bottom-4 md:fade-in",
          className
        )}
      >
        {title && (
          <div className="sticky top-0 bg-white border-b border-border px-5 py-4 flex items-center justify-between">
            <h2 className="font-heading text-lg">{title}</h2>
            <button
              onClick={onClose}
              className="text-ink-faint hover:text-ink p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
