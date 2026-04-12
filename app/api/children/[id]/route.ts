import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
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

  if (!child) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(child)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()

  const child = await prisma.child.findFirst({
    where: { id, educarerId: session.user.id },
  })
  if (!child) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const updated = await prisma.child.update({
    where: { id },
    data: {
      name: body.name,
      dob: body.dob ? new Date(body.dob) : undefined,
      stage: body.stage,
      avatarColor: body.avatarColor,
      allergies: body.allergies,
      notes: body.notes,
      temperament: body.temperament,
      familyNotes: body.familyNotes,
    },
  })

  return NextResponse.json(updated)
}
