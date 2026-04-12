import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Topbar } from "@/components/layout/Topbar"
import { DailyIntention } from "@/components/dashboard/DailyIntention"
import { MetricCard } from "@/components/dashboard/MetricCard"
import { RecentObservations } from "@/components/dashboard/RecentObservations"
import { DashboardClient } from "./client"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true },
  })

  const children = await prisma.child.findMany({
    where: { educarerId: session.user.id, isActive: true },
    select: { id: true, name: true, avatarColor: true },
    orderBy: { createdAt: "desc" },
  })

  const observations = await prisma.observation.findMany({
    where: { educarerId: session.user.id },
    include: { child: { select: { name: true, avatarColor: true } } },
    orderBy: { loggedAt: "desc" },
    take: 10,
  })

  const obsCount = await prisma.observation.count({
    where: { educarerId: session.user.id },
  })

  // Get today's daily intention (rotate by day of year)
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  )
  const intentionDay = ((dayOfYear - 1) % 30) + 1
  const intention = await prisma.dailyIntention.findUnique({
    where: { day: intentionDay },
  })

  const firstName = user?.name?.split(" ")[0] || "there"
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

  return (
    <div>
      <Topbar
        title={`${greeting}, ${firstName}`}
        subtitle="Here's what's happening in your practice today"
      />

      {/* Mobile: stacked; Desktop: two-column */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Daily intention */}
          {intention && (
            <DailyIntention
              text={intention.text}
              principle={intention.principle}
              category={intention.category}
            />
          )}

          {/* Children horizontal scroll on mobile */}
          {children.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-ink-muted mb-3">
                Children in your care
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:overflow-visible">
                {children.map((child) => (
                  <a
                    key={child.id}
                    href={`/children/${child.id}`}
                    className="flex items-center gap-2 px-4 py-3 bg-white rounded-[var(--radius-md)] border border-border min-w-[160px] shrink-0 hover:border-sage/30 transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium shrink-0"
                      style={{
                        backgroundColor:
                          {
                            sage: "#8FAF8B",
                            clay: "#C17F5A",
                            sky: "#7AA8C4",
                            blush: "#C4849A",
                            sand: "#E8E0D5",
                          }[child.avatarColor] || "#8FAF8B",
                      }}
                    >
                      {child.name[0]}
                    </div>
                    <span className="text-sm font-medium text-ink truncate">
                      {child.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Observations"
              value={obsCount}
              sublabel="total logged"
            />
            <MetricCard
              label="Children"
              value={children.length}
              sublabel="in your care"
            />
          </div>
        </div>

        <div className="space-y-6">
          {/* Quick log (client component) */}
          <DashboardClient
            children={children.map((c) => ({ id: c.id, name: c.name }))}
          />

          {/* Recent observations */}
          <RecentObservations
            observations={observations.map((o) => ({
              ...o,
              loggedAt: o.loggedAt.toISOString(),
            }))}
          />
        </div>
      </div>
    </div>
  )
}
