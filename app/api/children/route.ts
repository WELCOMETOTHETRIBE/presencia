import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const children = await prisma.child.findMany({
    where: { educarerId: session.user.id, isActive: true },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(children)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { name, dob, stage, avatarColor, allergies, notes, temperament, familyNotes } = body

  if (!name || !dob || !stage) {
    return NextResponse.json(
      { error: "Name, date of birth, and stage are required" },
      { status: 400 }
    )
  }

  const child = await prisma.child.create({
    data: {
      name,
      dob: new Date(dob),
      stage,
      avatarColor: avatarColor || "sage",
      allergies,
      notes,
      temperament,
      familyNotes,
      educarerId: session.user.id,
    },
  })

  return NextResponse.json(child, { status: 201 })
}
