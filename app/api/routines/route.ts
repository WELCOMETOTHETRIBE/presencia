import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const childId = searchParams.get("childId")

  if (!childId) {
    return NextResponse.json({ error: "childId required" }, { status: 400 })
  }

  const routines = await prisma.routine.findMany({
    where: { childId },
    orderBy: { order: "asc" },
  })

  return NextResponse.json(routines)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { childId, label, time, type, notes, order } = await request.json()

  if (!childId || !label || !time || !type) {
    return NextResponse.json(
      { error: "childId, label, time, and type required" },
      { status: 400 }
    )
  }

  const child = await prisma.child.findFirst({
    where: { id: childId, educarerId: session.user.id },
  })
  if (!child) {
    return NextResponse.json({ error: "Child not found" }, { status: 404 })
  }

  const routine = await prisma.routine.create({
    data: { childId, label, time, type, notes, order: order || 0 },
  })

  return NextResponse.json(routine, { status: 201 })
}
