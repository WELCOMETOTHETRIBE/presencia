import { cn } from "@/lib/utils"

type BadgeVariant = "sage" | "clay" | "sky" | "blush" | "sand" | "muted"

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  sage: "bg-sage-light text-sage-dark",
  clay: "bg-clay-light text-clay",
  sky: "bg-sky-light text-sky",
  blush: "bg-blush-light text-blush",
  sand: "bg-sand text-ink-muted",
  muted: "bg-cream text-ink-faint",
}

export function Badge({ children, variant = "sage", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-[var(--radius-full)] text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
