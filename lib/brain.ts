import * as XLSX from "xlsx"
import * as fs from "fs"
import * as path from "path"

export type BrainSheet = Record<string, string>[]

export interface PresenciaBrain {
  onboardingQs: BrainSheet
  stages: BrainSheet
  milestones: BrainSheet
  observationFramework: BrainSheet
  principles: BrainSheet
  careScripts: BrainSheet
  playEnvironment: BrainSheet
  emotionalGuidance: BrainSheet
  limitSetting: BrainSheet
  parentComms: BrainSheet
  dailyIntentions: BrainSheet
  redFlags: BrainSheet
  modules: BrainSheet
  assessmentQs: BrainSheet
  faq: BrainSheet
  vocabulary: BrainSheet
  methodologies: BrainSheet
  specialTopics: BrainSheet
  research: BrainSheet
  misconceptions: BrainSheet
  groupCare: BrainSheet
  culturalAdaptations: BrainSheet
  professionalPractice: BrainSheet
  crisisSafeguarding: BrainSheet
}

export const SHEET_MAP: Record<keyof PresenciaBrain, string> = {
  onboardingQs: "Child Onboarding",
  stages: "Developmental Stages",
  milestones: "Milestones Matrix",
  observationFramework: "Observation Framework",
  principles: "RIE 7 Principles",
  careScripts: "Care Routine Scripts",
  playEnvironment: "Play Environment",
  emotionalGuidance: "Emotional Guidance",
  limitSetting: "Limit Setting",
  parentComms: "Parent Communication",
  dailyIntentions: "Daily Intentions",
  redFlags: "Red Flags & Referrals",
  modules: "Onboarding Modules",
  assessmentQs: "Assessment Questions",
  faq: "FAQ — 80 Q&As",
  vocabulary: "RIE Vocabulary",
  methodologies: "Methodology Comparisons",
  specialTopics: "Special Topics",
  research: "Research Backing",
  misconceptions: "Common Misconceptions",
  groupCare: "Group Care & Classroom",
  culturalAdaptations: "Cultural Adaptations",
  professionalPractice: "Professional Practice",
  crisisSafeguarding: "Crisis & Safeguarding",
}

let _brain: PresenciaBrain | null = null

function parseSheet(ws: XLSX.WorkSheet): BrainSheet {
  const rawRows = XLSX.utils.sheet_to_json<Record<string, string>>(ws, {
    defval: "",
  })
  if (rawRows.length < 2) return []

  const headerRow = rawRows[0]
  const rawKeys = Object.keys(headerRow)
  const colNames = rawKeys.map((k) => String(headerRow[k]).trim()).filter(Boolean)

  return rawRows.slice(1).map((rawRow) => {
    const mapped: Record<string, string> = {}
    rawKeys.forEach((rawKey, i) => {
      if (i < colNames.length && colNames[i]) {
        mapped[colNames[i]] = String(rawRow[rawKey] ?? "").trim()
      }
    })
    return mapped
  })
}

function findBrainFile(): string {
  // Try multiple possible locations
  const candidates = [
    path.join(process.cwd(), "raw", "PRESENCIA_Brain_v2.xlsx"),
    path.resolve("raw", "PRESENCIA_Brain_v2.xlsx"),
    path.join("/app", "raw", "PRESENCIA_Brain_v2.xlsx"),
    path.resolve(__dirname, "..", "raw", "PRESENCIA_Brain_v2.xlsx"),
  ]
  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) return candidate
    } catch {
      // continue
    }
  }
  throw new Error(
    `Cannot find PRESENCIA_Brain_v2.xlsx. Tried: ${candidates.join(", ")}`
  )
}

export function loadBrain(): PresenciaBrain {
  if (_brain) return _brain
  const filePath = findBrainFile()
  const buffer = fs.readFileSync(filePath)
  const wb = XLSX.read(buffer, { type: "buffer" })
  const brain = {} as PresenciaBrain
  for (const [key, sheetName] of Object.entries(SHEET_MAP)) {
    const ws = wb.Sheets[sheetName]
    brain[key as keyof PresenciaBrain] = ws ? parseSheet(ws) : []
  }
  _brain = brain
  return brain
}

export function getBrainContext(sections: (keyof PresenciaBrain)[]): string {
  const brain = loadBrain()
  return sections
    .map((key) => {
      const rows = brain[key]
      if (!rows.length) return ""
      const header = `\n## ${SHEET_MAP[key]}\n`
      const content = rows
        .map((row) =>
          Object.entries(row)
            .filter(([, v]) => v)
            .map(([k, v]) => `${k}: ${v}`)
            .join(" | ")
        )
        .join("\n")
      return header + content
    })
    .join("\n")
}
