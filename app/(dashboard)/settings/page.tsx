import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Topbar } from "@/components/layout/Topbar"
import { SettingsClient } from "./client"

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      bio: true,
      credentials: true,
      schoolAffil: true,
      _count: {
        select: {
          observations: true,
          children: true,
          aiConversations: true,
          aiInsights: true,
        },
      },
    },
  })

  if (!user) redirect("/login")

  return (
    <div>
      <Topbar title="Settings" subtitle="Manage your account and practice" />
      <SettingsClient user={user} />
    </div>
  )
}
