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
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    })
  }

  const { message, conversationId, childId, feature = "GUIDE_CHAT" } =
    await request.json()

  if (!message) {
    return new Response(JSON.stringify({ error: "Message required" }), {
      status: 400,
    })
  }

  // Build system prompt with Brain context
  const brainSections =
    FEATURE_BRAIN_SECTIONS[feature] || FEATURE_BRAIN_SECTIONS.GUIDE_CHAT
  const brainContext = getBrainContext(brainSections as (keyof typeof import("@/lib/brain").SHEET_MAP)[])
  const featurePrompt = FEATURE_PROMPTS[feature] || FEATURE_PROMPTS.GUIDE_CHAT
  const childContext = childId ? await buildChildContext(childId) : ""

  const systemPrompt = [
    RIE_SYSTEM_CORE,
    featurePrompt,
    brainContext,
    childContext,
  ]
    .filter(Boolean)
    .join("\n\n")

  // Get or create conversation
  let conversation
  if (conversationId) {
    conversation = await prisma.aIConversation.findFirst({
      where: { id: conversationId, userId: session.user.id },
      include: { messages: { orderBy: { createdAt: "asc" }, take: 50 } },
    })
  }

  if (!conversation) {
    conversation = await prisma.aIConversation.create({
      data: {
        userId: session.user.id,
        childId: childId || null,
        feature: feature as "GUIDE_CHAT" | "OBSERVATION_INSIGHT" | "PARENT_COMM_DRAFT" | "SCENARIO_HELP" | "ONBOARDING_TUTOR" | "WEEKLY_DIGEST",
      },
      include: { messages: true },
    })
  }

  // Save user message
  await prisma.aIMessage.create({
    data: {
      conversationId: conversation.id,
      role: "user",
      content: message,
    },
  })

  // Build message history for API
  const apiMessages = [
    ...conversation.messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user" as const, content: message },
  ]

  // Stream response
  const stream = await anthropic.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: systemPrompt,
    messages: apiMessages,
  })

  const encoder = new TextEncoder()
  let fullResponse = ""

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            const text = event.delta.text
            fullResponse += text
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
            )
          }
        }

        // Save assistant message
        await prisma.aIMessage.create({
          data: {
            conversationId: conversation!.id,
            role: "assistant",
            content: fullResponse,
          },
        })

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ done: true, conversationId: conversation!.id })}\n\n`
          )
        )
        controller.close()
      } catch (error) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ error: "Stream error" })}\n\n`
          )
        )
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
