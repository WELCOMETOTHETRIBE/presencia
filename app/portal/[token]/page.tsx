import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { getAgeDisplay, formatRelative } from "@/lib/utils"

export default async function ParentPortalPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  const child = await prisma.child.findUnique({
    where: { shareToken: token },
    include: {
      educarer: {
        select: { name: true, credentials: true, bio: true },
      },
      observations: {
        where: { isPrivate: false },
        orderBy: { loggedAt: "desc" },
        take: 10,
      },
      milestones: {
        include: { milestone: true },
        orderBy: { seenAt: "desc" },
        take: 10,
      },
      routines: {
        orderBy: { order: "asc" },
      },
    },
  })

  if (!child) notFound()

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

  return (
    <div className="min-h-dvh bg-cream">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="max-w-2xl mx-auto px-6 py-6 text-center">
          <div className="w-12 h-12 rounded-full bg-sage flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-lg font-bold">P</span>
          </div>
          <h1 className="font-heading text-2xl text-ink">{child.name}&apos;s Journal</h1>
          <p className="text-sm text-ink-muted mt-1">
            {getAgeDisplay(child.dob)} &middot;{" "}
            {child.stage.charAt(0) + child.stage.slice(1).toLowerCase()}
          </p>
          <p className="text-xs text-ink-faint mt-2">
            Shared by {child.educarer.name || "your educarer"} via Presencia
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        {/* Educarer info */}
        {child.educarer.name && (
          <div className="bg-white rounded-[var(--radius-lg)] border border-border p-5">
            <h2 className="font-heading text-lg text-ink mb-2">Your Educarer</h2>
            <p className="text-sm font-medium text-ink">{child.educarer.name}</p>
            {child.educarer.credentials && (
              <p className="text-xs text-ink-muted">{child.educarer.credentials}</p>
            )}
            {child.educarer.bio && (
              <p className="text-sm text-ink-muted mt-2">{child.educarer.bio}</p>
            )}
          </div>
        )}

        {/* Recent Observations */}
        <div>
          <h2 className="font-heading text-lg text-ink mb-4">
            Recent Observations
          </h2>
          {child.observations.length === 0 ? (
            <div className="bg-white rounded-[var(--radius-lg)] border border-border p-8 text-center">
              <p className="text-ink-faint text-sm">
                Observations will appear here as they are logged
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {child.observations.map((obs) => (
                <div
                  key={obs.id}
                  className="bg-white rounded-[var(--radius-lg)] border border-border p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-sand text-ink-muted text-xs rounded-full font-medium">
                      {contextLabels[obs.context] || obs.context}
                    </span>
                    <span className="text-xs text-ink-faint">
                      {formatRelative(obs.loggedAt)}
                    </span>
                  </div>
                  <p className="text-sm text-ink leading-relaxed">
                    {obs.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Milestones */}
        {child.milestones.length > 0 && (
          <div>
            <h2 className="font-heading text-lg text-ink mb-4">
              Milestones Observed
            </h2>
            <div className="bg-white rounded-[var(--radius-lg)] border border-border p-5">
              <div className="flex flex-wrap gap-2">
                {child.milestones.map((m) => (
                  <span
                    key={m.id}
                    className="px-2.5 py-1 bg-sage-light text-sage-dark text-xs rounded-full font-medium"
                  >
                    {m.milestone.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Routine */}
        {child.routines.length > 0 && (
          <div>
            <h2 className="font-heading text-lg text-ink mb-4">
              Daily Routine
            </h2>
            <div className="space-y-2">
              {child.routines.map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-[var(--radius-lg)] border border-border p-3 flex items-center gap-3"
                >
                  <span className="text-sm font-mono text-ink-muted w-14 shrink-0">
                    {r.time}
                  </span>
                  <span className="text-sm text-ink">{r.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-8">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-xs text-ink-faint">
            Shared via Presencia &middot; See more. Do less. Trust the child.
          </p>
        </div>
      </footer>
    </div>
  )
}
