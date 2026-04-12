import * as XLSX from "xlsx"
import path from "path"

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

/**
 * Parse a sheet where row 0 is the title row (used as xlsx "headers")
 * and the actual column names are in the first data row (index 0).
 * Data starts from row index 1 onward.
 */
function parseSheet(ws: XLSX.WorkSheet): BrainSheet {
  const rawRows = XLSX.utils.sheet_to_json<Record<string, string>>(ws, {
    defval: "",
  })
  if (rawRows.length < 2) return []

  // Row 0 contains the real column names as values
  const headerRow = rawRows[0]
  const rawKeys = Object.keys(headerRow)
  const colNames = rawKeys.map((k) => String(headerRow[k]).trim()).filter(Boolean)

  // Rows 1+ are the actual data
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

export function loadBrain(): PresenciaBrain {
  if (_brain) return _brain
  const filePath = path.join(process.cwd(), "raw", "PRESENCIA_Brain_v2.xlsx")
  const wb = XLSX.readFile(filePath)
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
