import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const child = await prisma.child.findFirst({
    where: { id, educarerId: session.user.id },
  })
  if (!child) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // Generate token if not exists
  let token = child.shareToken
  if (!token) {
    token = randomBytes(16).toString("hex")
    await prisma.child.update({
      where: { id },
      data: { shareToken: token },
    })
  }

  return NextResponse.json({ token, url: `/portal/${token}` })
}
