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

  const observations = await prisma.observation.findMany({
    where: {
      educarerId: session.user.id,
      ...(childId ? { childId } : {}),
    },
    include: { child: { select: { name: true, avatarColor: true } } },
    orderBy: { loggedAt: "desc" },
    take: 50,
  })

  return NextResponse.json(observations)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { childId, content, context, tags, isPrivate } = body

  if (!childId || !content || !context) {
    return NextResponse.json(
      { error: "childId, content, and context are required" },
      { status: 400 }
    )
  }

  // Verify the child belongs to this user
  const child = await prisma.child.findFirst({
    where: { id: childId, educarerId: session.user.id },
  })
  if (!child) {
    return NextResponse.json({ error: "Child not found" }, { status: 404 })
  }

  const observation = await prisma.observation.create({
    data: {
      childId,
      educarerId: session.user.id,
      content,
      context,
      tags: tags || [],
      isPrivate: isPrivate || false,
    },
  })

  return NextResponse.json(observation, { status: 201 })
}
