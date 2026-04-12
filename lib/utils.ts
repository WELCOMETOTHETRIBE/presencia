import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

export function formatTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date))
}

export function formatRelative(date: Date | string): string {
  const now = Date.now()
  const then = new Date(date).getTime()
  const diff = now - then
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return formatDate(date)
}

export function getAgeMonths(dob: Date | string): number {
  return Math.floor(
    (Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 30.44)
  )
}

export function getAgeDisplay(dob: Date | string): string {
  const months = getAgeMonths(dob)
  if (months < 12) return `${months}mo`
  const years = Math.floor(months / 12)
  const rem = months % 12
  return rem > 0 ? `${years}y ${rem}mo` : `${years}y`
}

export function stageFromAge(months: number): "INFANT" | "TODDLER" | "PRESCHOOL" {
  if (months < 12) return "INFANT"
  if (months < 36) return "TODDLER"
  return "PRESCHOOL"
}

export const OBS_CONTEXTS = [
  { value: "FREE_PLAY", label: "Free Play", icon: "🎈" },
  { value: "CARE_ROUTINE", label: "Care Routine", icon: "🛁" },
  { value: "FEEDING", label: "Feeding", icon: "🍽" },
  { value: "TRANSITION", label: "Transition", icon: "🚶" },
  { value: "PEER_INTERACTION", label: "Peer Interaction", icon: "👫" },
  { value: "EMOTIONAL_MOMENT", label: "Emotional Moment", icon: "💛" },
  { value: "OUTDOOR", label: "Outdoor", icon: "🌿" },
  { value: "GROUP", label: "Group", icon: "👥" },
] as const

export const AVATAR_COLORS: Record<string, string> = {
  sage: "#8FAF8B",
  clay: "#C17F5A",
  sky: "#7AA8C4",
  blush: "#C4849A",
  sand: "#E8E0D5",
}
