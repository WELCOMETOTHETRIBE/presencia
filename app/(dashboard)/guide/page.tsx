import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { GuideChat } from "@/components/ai/GuideChat"

export default async function GuidePage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const children = await prisma.child.findMany({
    where: { educarerId: session.user.id, isActive: true },
    select: { id: true, name: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <GuideChat children={children} />
    </div>
  )
}
