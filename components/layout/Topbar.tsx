"use client"

import { cn } from "@/lib/utils"

interface TopbarProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  className?: string
}

export function Topbar({ title, subtitle, action, className }: TopbarProps) {
  return (
    <header className={cn("flex items-center justify-between mb-6", className)}>
      <div>
        <h1 className="font-heading text-2xl md:text-3xl text-ink">{title}</h1>
        {subtitle && (
          <p className="text-sm text-ink-muted mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </header>
  )
}
