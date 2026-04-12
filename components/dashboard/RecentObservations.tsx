import { Card } from "@/components/ui/Card"
import { Avatar } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import { formatRelative } from "@/lib/utils"

interface Observation {
  id: string
  content: string
  context: string
  tags: string[]
  loggedAt: string | Date
  child: { name: string; avatarColor: string }
}

interface RecentObservationsProps {
  observations: Observation[]
}

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

export function RecentObservations({ observations }: RecentObservationsProps) {
  if (observations.length === 0) {
    return (
      <Card className="text-center py-8">
        <p className="text-ink-faint text-sm italic">
          &ldquo;Observe more, do less.&rdquo;
        </p>
        <p className="text-ink-faint text-xs mt-2">
          Your observations will appear here
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-ink-muted">Recent observations</h3>
      {observations.map((obs) => (
        <Card key={obs.id} hover className="cursor-pointer">
          <div className="flex gap-3">
            <Avatar name={obs.child.name} color={obs.child.avatarColor} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-ink">{obs.child.name}</span>
                <span className="text-xs text-ink-faint">{formatRelative(obs.loggedAt)}</span>
              </div>
              <p className="text-sm text-ink-muted line-clamp-2">{obs.content}</p>
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <Badge variant="sand">{contextLabels[obs.context] || obs.context}</Badge>
                {obs.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="muted">{tag}</Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
