"use client"

import { createContext, useCallback, useContext, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

type ToastType = "success" | "error" | "info"

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => {
      setToasts((t) => t.filter((item) => item.id !== id))
    }, 3000)
  }, [])

  return (
    <ToastContext value={{ toast }}>
      {children}
      <div className="fixed bottom-20 md:bottom-6 right-4 z-[100] space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "px-4 py-3 rounded-[var(--radius-md)] shadow-[var(--shadow-md)] text-sm font-medium",
              "animate-in slide-in-from-right duration-300",
              t.type === "success" && "bg-sage-light text-sage-dark",
              t.type === "error" && "bg-red-50 text-red-700",
              t.type === "info" && "bg-sky-light text-sky"
            )}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext>
  )
}
