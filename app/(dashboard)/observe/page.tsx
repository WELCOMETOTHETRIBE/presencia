import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Topbar } from "@/components/layout/Topbar"
import { ObserveClient } from "./client"

export default async function ObservePage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const children = await prisma.child.findMany({
    where: { educarerId: session.user.id, isActive: true },
    select: { id: true, name: true, avatarColor: true },
    orderBy: { createdAt: "desc" },
  })

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const todayObs = await prisma.observation.findMany({
    where: {
      educarerId: session.user.id,
      loggedAt: { gte: todayStart },
    },
    include: { child: { select: { name: true } } },
    orderBy: { loggedAt: "desc" },
  })

  return (
    <div>
      <Topbar
        title="Observe"
        subtitle="Document what you see, not what you interpret"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <ObserveClient children={children} />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-ink-muted">
            Today&apos;s observations ({todayObs.length})
          </h3>
          {todayObs.length === 0 ? (
            <div className="bg-white rounded-[var(--radius-lg)] border border-border p-8 text-center">
              <p className="text-ink-faint text-sm italic">
                &ldquo;What you see depends on what you&apos;re looking for.&rdquo;
              </p>
              <p className="text-ink-faint text-xs mt-2">
                Your observations from today will appear here
              </p>
            </div>
          ) : (
            todayObs.map((obs) => (
              <div
                key={obs.id}
                className="bg-white rounded-[var(--radius-lg)] border border-border p-4"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-ink">
                    {obs.child.name}
                  </span>
                  <span className="text-xs text-ink-faint">
                    {obs.loggedAt.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm text-ink-muted line-clamp-3">
                  {obs.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
