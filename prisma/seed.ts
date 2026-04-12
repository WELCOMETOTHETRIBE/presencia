import { PrismaClient } from "@prisma/client"
import { loadBrain } from "../lib/brain"

const prisma = new PrismaClient()

function stageFromString(s: string): "INFANT" | "TODDLER" | "PRESCHOOL" {
  const upper = s.toUpperCase().trim()
  if (upper.includes("INFANT") || upper.includes("BIRTH") || upper.includes("0-")) return "INFANT"
  if (upper.includes("TODDLER") || upper.includes("1-") || upper.includes("12-")) return "TODDLER"
  return "PRESCHOOL"
}

async function main() {
  console.log("Loading Brain v2...")
  const brain = loadBrain()

  // Seed milestones
  console.log(`Seeding ${brain.milestones.length} milestones...`)
  let milestoneCount = 0
  for (const row of brain.milestones) {
    const title = row["Milestone"]
    if (!title) continue
    await prisma.milestone.upsert({
      where: { title },
      update: {},
      create: {
        stage: stageFromString(String(row["Stage"] || "")),
        category: String(row["Domain"] || "General"),
        title,
        description: String(row["What to Look For"] || ""),
        rieNote: String(row["RIE Note"] || "") || null,
        typicalWindow: String(row["Typical Window"] || "") || null,
        flagNote: String(row["Flag If Not Seen By"] || "") || null,
        principle: String(row["Related Principle"] || "") || null,
        order: milestoneCount,
      },
    })
    milestoneCount++
  }
  console.log(`Seeded ${milestoneCount} milestones`)

  // Seed daily intentions
  console.log(`Seeding ${brain.dailyIntentions.length} daily intentions...`)
  let intentionCount = 0
  for (const row of brain.dailyIntentions) {
    const text = row["Daily Intention (exact text for app)"]
    const dayNum = Number(row["Day"])
    if (!text || !dayNum) continue
    await prisma.dailyIntention.upsert({
      where: { day: dayNum },
      update: {},
      create: {
        day: dayNum,
        category: String(row["Category"] || ""),
        principle: String(row["Principle"] || ""),
        text,
        whoFor: String(row["Who It's For"] || ""),
        stageFit: String(row["Stage Best-Fit"] || ""),
      },
    })
    intentionCount++
  }
  console.log(`Seeded ${intentionCount} daily intentions`)

  // Seed onboarding modules
  console.log(`Seeding ${brain.modules.length} onboarding modules...`)
  let moduleCount = 0
  for (const row of brain.modules) {
    const title = row["Title"]
    const moduleNum = Number(row["Module"])
    if (!title || !moduleNum) continue
    await prisma.onboardingModule.upsert({
      where: { moduleNumber: moduleNum },
      update: {},
      create: {
        moduleNumber: moduleNum,
        title,
        duration: String(row["Duration"] || ""),
        objectives: String(row["Learning Objectives (3-5)"] || ""),
        keyConcepts: String(row["Key Concepts"] || ""),
        exercise: String(row["In-Practice Exercise"] || ""),
        reflection: String(row["Reflection Prompt"] || ""),
        unlocks: String(row["Unlocks"] || ""),
      },
    })
    moduleCount++
  }
  console.log(`Seeded ${moduleCount} onboarding modules`)

  console.log("Seed complete!")
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
