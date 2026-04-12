"use client"

import { cn } from "@/lib/utils"

interface Tab {
  value: string
  label: string
}

interface TabsProps {
  tabs: Tab[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export function Tabs({ tabs, value, onChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        "flex border-b border-border overflow-x-auto scrollbar-hide",
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors",
            "min-h-[44px] border-b-2 -mb-px",
            value === tab.value
              ? "border-sage text-sage-dark"
              : "border-transparent text-ink-muted hover:text-ink hover:border-border-md"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
