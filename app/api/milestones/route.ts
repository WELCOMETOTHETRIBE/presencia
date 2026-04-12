import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const stage = searchParams.get("stage")
  const category = searchParams.get("category")

  const milestones = await prisma.milestone.findMany({
    where: {
      ...(stage ? { stage: stage as "INFANT" | "TODDLER" | "PRESCHOOL" } : {}),
      ...(category ? { category } : {}),
    },
    orderBy: [{ stage: "asc" }, { category: "asc" }, { order: "asc" }],
  })

  return NextResponse.json(milestones)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { childId, milestoneId, notes } = await request.json()

  if (!childId || !milestoneId) {
    return NextResponse.json(
      { error: "childId and milestoneId required" },
      { status: 400 }
    )
  }

  const child = await prisma.child.findFirst({
    where: { id: childId, educarerId: session.user.id },
  })
  if (!child) {
    return NextResponse.json({ error: "Child not found" }, { status: 404 })
  }

  const check = await prisma.milestoneCheck.upsert({
    where: { childId_milestoneId: { childId, milestoneId } },
    update: { notes },
    create: { childId, milestoneId, notes },
  })

  return NextResponse.json(check, { status: 201 })
}
