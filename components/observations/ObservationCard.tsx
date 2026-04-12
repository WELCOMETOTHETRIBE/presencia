import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { formatRelative } from "@/lib/utils"

const contextLabels: Record<string, string> = {
  FREE_PLAY: "Free Play",
  CARE_ROUTINE: "Care Routine",
  FEEDING: "Feeding",
  TRANSITION: "Transition",
  PEER_INTERACTION: "Peer Interaction",
  EMOTIONAL_MOMENT: "Emotional Moment",
  OUTDOOR: "Outdoor",
  GROUP: "Group",
}

interface ObservationCardProps {
  content: string
  context: string
  tags: string[]
  loggedAt: string | Date
  childName?: string
}

export function ObservationCard({
  content,
  context,
  tags,
  loggedAt,
  childName,
}: ObservationCardProps) {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-2">
        {childName && (
          <span className="text-sm font-medium text-ink">{childName}</span>
        )}
        <Badge variant="sand">
          {contextLabels[context] || context}
        </Badge>
        <span className="text-xs text-ink-faint ml-auto">
          {formatRelative(loggedAt)}
        </span>
      </div>
      <p className="text-sm text-ink leading-relaxed">{content}</p>
      {tags.length > 0 && (
        <div className="flex gap-1 mt-2 flex-wrap">
          {tags.map((tag) => (
            <Badge key={tag} variant="muted">{tag}</Badge>
          ))}
        </div>
      )}
    </Card>
  )
}
