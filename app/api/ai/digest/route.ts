import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import {
  anthropic,
  RIE_SYSTEM_CORE,
  FEATURE_BRAIN_SECTIONS,
  FEATURE_PROMPTS,
  buildChildContext,
} from "@/lib/ai"
import { getBrainContext } from "@/lib/brain"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { childId } = await request.json()

  if (!childId) {
    return NextResponse.json({ error: "childId required" }, { status: 400 })
  }

  // Get last 7 days of observations
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  const observations = await prisma.observation.findMany({
    where: {
      childId,
      educarerId: session.user.id,
      isPrivate: false,
      loggedAt: { gte: weekAgo },
    },
    orderBy: { loggedAt: "desc" },
  })

  const milestoneChecks = await prisma.milestoneCheck.findMany({
    where: {
      childId,
      seenAt: { gte: weekAgo },
    },
    include: { milestone: true },
  })

  const brainContext = getBrainContext(
    FEATURE_BRAIN_SECTIONS.WEEKLY_DIGEST as (keyof typeof import("@/lib/brain").SHEET_MAP)[]
  )
  const childContext = await buildChildContext(childId)

  const systemPrompt = [
    RIE_SYSTEM_CORE,
    FEATURE_PROMPTS.WEEKLY_DIGEST,
    brainContext,
    childContext,
  ]
    .filter(Boolean)
    .join("\n\n")

  const obsText = observations
    .map((o) => `[${o.context}] ${o.content}`)
    .join("\n")
  const milestoneText = milestoneChecks
    .map((m) => `${m.milestone.category}: ${m.milestone.title}`)
    .join(", ")

  const prompt = `Generate a weekly family update based on this week's observations and milestones.\n\nObservations this week (${observations.length}):\n${obsText || "No observations this week."}\n\nMilestones observed this week:\n${milestoneText || "None this week."}`

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 600,
    system: systemPrompt,
    messages: [{ role: "user", content: prompt }],
  })

  const responseText =
    response.content[0].type === "text" ? response.content[0].text : ""

  return NextResponse.json({ digest: responseText })
}
