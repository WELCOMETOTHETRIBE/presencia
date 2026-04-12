import { cn, AVATAR_COLORS } from "@/lib/utils"

interface AvatarProps {
  name: string
  color?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
}

export function Avatar({ name, color = "sage", size = "md", className }: AvatarProps) {
  const bgColor = AVATAR_COLORS[color] || AVATAR_COLORS.sage
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-medium text-white shrink-0",
        sizeMap[size],
        className
      )}
      style={{ backgroundColor: bgColor }}
    >
      {initials}
    </div>
  )
}
