import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { name, bio, credentials, schoolAffil } = await request.json()

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(bio !== undefined ? { bio } : {}),
      ...(credentials !== undefined ? { credentials } : {}),
      ...(schoolAffil !== undefined ? { schoolAffil } : {}),
    },
  })

  return NextResponse.json({ id: updated.id })
}
