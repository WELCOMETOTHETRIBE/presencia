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

  const { childId, situation, tone = "warm" } = await request.json()

  if (!childId || !situation) {
    return NextResponse.json(
      { error: "childId and situation required" },
      { status: 400 }
    )
  }

  const brainContext = getBrainContext(
    FEATURE_BRAIN_SECTIONS.PARENT_COMM_DRAFT as (keyof typeof import("@/lib/brain").SHEET_MAP)[]
  )
  const childContext = await buildChildContext(childId)

  const systemPrompt = [
    RIE_SYSTEM_CORE,
    FEATURE_PROMPTS.PARENT_COMM_DRAFT,
    brainContext,
    childContext,
  ]
    .filter(Boolean)
    .join("\n\n")

  const prompt = `Tone: ${tone}\n\nSituation: ${situation}`

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 600,
    system: systemPrompt,
    messages: [{ role: "user", content: prompt }],
  })

  const responseText =
    response.content[0].type === "text" ? response.content[0].text : ""

  return NextResponse.json({ draft: responseText })
}
