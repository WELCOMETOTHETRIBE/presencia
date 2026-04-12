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

  const { observationId, childId } = await request.json()

  if (!observationId || !childId) {
    return NextResponse.json(
      { error: "observationId and childId required" },
      { status: 400 }
    )
  }

  const observation = await prisma.observation.findFirst({
    where: { id: observationId, educarerId: session.user.id },
  })
  if (!observation) {
    return NextResponse.json({ error: "Observation not found" }, { status: 404 })
  }

  // Check for existing insight
  const existing = await prisma.aIInsight.findUnique({
    where: { observationId },
  })
  if (existing) {
    return NextResponse.json(existing)
  }

  const brainContext = getBrainContext(
    FEATURE_BRAIN_SECTIONS.OBSERVATION_INSIGHT as (keyof typeof import("@/lib/brain").SHEET_MAP)[]
  )
  const childContext = await buildChildContext(childId)

  const systemPrompt = [
    RIE_SYSTEM_CORE,
    FEATURE_PROMPTS.OBSERVATION_INSIGHT,
    brainContext,
    childContext,
  ]
    .filter(Boolean)
    .join("\n\n")

  const prompt = `Here is the observation:\n\nContext: ${observation.context}\nTags: ${observation.tags.join(", ")}\n\n"${observation.content}"`

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 800,
    system: systemPrompt,
    messages: [{ role: "user", content: prompt }],
  })

  const responseText =
    response.content[0].type === "text" ? response.content[0].text : ""

  const insight = await prisma.aIInsight.create({
    data: {
      userId: session.user.id,
      childId,
      observationId,
      feature: "OBSERVATION_INSIGHT",
      prompt,
      response: responseText,
    },
  })

  return NextResponse.json(insight)
}
