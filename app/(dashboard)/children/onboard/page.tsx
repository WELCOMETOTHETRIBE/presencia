import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { loadBrain } from "@/lib/brain"
import { OnboardWizard } from "./wizard"

export default async function OnboardChildPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const brain = loadBrain()

  // Parse onboarding questions from Brain by section
  const questions = brain.onboardingQs
    .filter((row) => row["Question / Item"])
    .map((row) => ({
      section: String(row["Section"] || "").trim(),
      question: String(row["Question / Item"] || "").trim(),
      askWho: String(row["Ask: Who"] || "").trim(),
      stage: String(row["Stage"] || "All").trim(),
      rieRelevance: String(row["RIE Relevance"] || "").trim(),
      followUp: String(row["Follow-up if needed"] || "").trim(),
    }))

  return <OnboardWizard questions={questions} />
}
