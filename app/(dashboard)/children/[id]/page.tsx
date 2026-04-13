import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import { getAgeDisplay } from "@/lib/utils"
import { Topbar } from "@/components/layout/Topbar"
import { Avatar } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import { Card } from "@/components/ui/Card"
import { ChildProfileClient, ShareButton } from "./client"

export default async function ChildProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const { id } = await params

  const child = await prisma.child.findFirst({
    where: { id, educarerId: session.user.id },
    include: {
      observations: {
        orderBy: { loggedAt: "desc" },
        take: 20,
      },
      milestones: {
        include: { milestone: true },
        orderBy: { seenAt: "desc" },
      },
      routines: {
        orderBy: { order: "asc" },
      },
    },
  })

  if (!child) notFound()

  const stageVariant = {
    INFANT: "blush" as const,
    TODDLER: "clay" as const,
    PRESCHOOL: "sky" as const,
  }

  return (
    <div>
      <Topbar
        title={child.name}
        subtitle={getAgeDisplay(child.dob)}
        action={<ShareButton childId={child.id} />}
      />

      {/* Profile header */}
      <Card className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
        <Avatar name={child.name} color={child.avatarColor} size="lg" />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="sage">{child.relationship || "Care receiver"}</Badge>
            <Badge variant={stageVariant[child.stage]}>
              {child.stage.charAt(0) + child.stage.slice(1).toLowerCase()}
            </Badge>
            {child.temperament && <Badge variant="sand">{child.temperament}</Badge>}
          </div>
          {child.allergies && (
            <p className="text-sm text-ink-muted mt-2">
              Allergies: {child.allergies}
            </p>
          )}
          {child.familyNotes && (
            <p className="text-sm text-ink-muted mt-1">{child.familyNotes}</p>
          )}
        </div>
      </Card>

      {/* Tabs (client component) */}
      <ChildProfileClient
        childId={child.id}
        childStage={child.stage}
        observations={child.observations.map((o) => ({
          ...o,
          loggedAt: o.loggedAt.toISOString(),
          createdAt: o.createdAt.toISOString(),
        }))}
        milestones={child.milestones.map((m) => ({
          id: m.id,
          seenAt: m.seenAt.toISOString(),
          notes: m.notes,
          milestone: m.milestone,
        }))}
        routines={child.routines}
      />
    </div>
  )
}
