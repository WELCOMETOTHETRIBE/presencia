import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
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

  const { situation, childId, stage } = await request.json()

  if (!situation) {
    return NextResponse.json(
      { error: "Situation description required" },
      { status: 400 }
    )
  }

  const brainContext = getBrainContext(
    FEATURE_BRAIN_SECTIONS.SCENARIO_HELP as (keyof typeof import("@/lib/brain").SHEET_MAP)[]
  )
  const childContext = childId ? await buildChildContext(childId) : ""

  const systemPrompt = [
    RIE_SYSTEM_CORE,
    FEATURE_PROMPTS.SCENARIO_HELP,
    brainContext,
    childContext,
  ]
    .filter(Boolean)
    .join("\n\n")

  const prompt = stage
    ? `Stage: ${stage}\n\nSituation: ${situation}`
    : situation

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 500,
    system: systemPrompt,
    messages: [{ role: "user", content: prompt }],
  })

  const responseText =
    response.content[0].type === "text" ? response.content[0].text : ""

  return NextResponse.json({ response: responseText })
}
