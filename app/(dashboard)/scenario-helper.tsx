import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ScenarioHelper } from "@/components/ai/ScenarioHelper"

export async function ScenarioHelperWrapper() {
  const session = await auth()
  if (!session?.user?.id) return null

  const children = await prisma.child.findMany({
    where: { educarerId: session.user.id, isActive: true },
    select: { id: true, name: true, stage: true },
  })

  return <ScenarioHelper children={children} />
}
