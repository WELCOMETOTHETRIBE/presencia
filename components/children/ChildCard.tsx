import Link from "next/link"
import { Card } from "@/components/ui/Card"
import { Avatar } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import { getAgeDisplay } from "@/lib/utils"

interface ChildCardProps {
  id: string
  name: string
  dob: string | Date
  stage: string
  relationship?: string
  avatarColor: string
  observationCount?: number
}

const stageVariant = {
  INFANT: "blush" as const,
  TODDLER: "clay" as const,
  PRESCHOOL: "sky" as const,
}

export function ChildCard({
  id,
  name,
  dob,
  stage,
  relationship,
  avatarColor,
  observationCount,
}: ChildCardProps) {
  return (
    <Link href={`/children/${id}`}>
      <Card hover className="flex items-center gap-4">
        <Avatar name={name} color={avatarColor} size="lg" />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-ink">{name}</h3>
          <p className="text-sm text-ink-muted">
            {getAgeDisplay(dob)}
            {relationship && (
              <span className="text-ink-faint"> &middot; {relationship}</span>
            )}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <Badge variant={stageVariant[stage as keyof typeof stageVariant] || "sage"}>
              {stage.charAt(0) + stage.slice(1).toLowerCase()}
            </Badge>
            {observationCount !== undefined && (
              <span className="text-xs text-ink-faint">
                {observationCount} observation{observationCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}
