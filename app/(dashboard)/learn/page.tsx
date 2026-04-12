import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { loadBrain } from "@/lib/brain"
import { Topbar } from "@/components/layout/Topbar"
import { LearnClient } from "./client"

export default async function LearnPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const brain = loadBrain()

  const principles = brain.principles.map((row, i) => ({
    number: Number(row["#"]) || i + 1,
    name: row["Principle"] || "",
    description: row["Core Description"] || "",
    examples: row["In Practice — 3 Daily Examples"] || "",
    mistakes: row["Common Mistakes to Avoid"] || "",
    script: row["What It Sounds Like (Script)"] || "",
    infant: row["What It Looks Like for Infant"] || "",
    toddler: row["What It Looks Like for Toddler"] || "",
    preschool: row["What It Looks Like for Preschooler"] || "",
  }))

  const modules = await prisma.onboardingModule.findMany({
    orderBy: { moduleNumber: "asc" },
  })

  const progress = await prisma.onboardingProgress.findUnique({
    where: { userId: session.user.id },
  })

  return (
    <div>
      <Topbar
        title="Learn"
        subtitle="The 7 RIE Principles and your onboarding path"
      />
      <LearnClient
        principles={principles}
        modules={modules}
        completedModules={progress?.completedIds || []}
        userId={session.user.id}
      />
    </div>
  )
}
