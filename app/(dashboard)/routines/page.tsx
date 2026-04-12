import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Topbar } from "@/components/layout/Topbar"
import { RoutinesClient } from "./client"

export default async function RoutinesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const children = await prisma.child.findMany({
    where: { educarerId: session.user.id, isActive: true },
    select: { id: true, name: true, avatarColor: true },
    orderBy: { createdAt: "desc" },
  })

  const routines = children.length > 0
    ? await prisma.routine.findMany({
        where: { childId: { in: children.map((c) => c.id) } },
        orderBy: { order: "asc" },
      })
    : []

  return (
    <div>
      <Topbar
        title="Routines"
        subtitle="Daily rhythms for every child in your care"
      />
      <RoutinesClient
        children={children}
        initialRoutines={routines.map((r) => ({
          ...r,
        }))}
      />
    </div>
  )
}
