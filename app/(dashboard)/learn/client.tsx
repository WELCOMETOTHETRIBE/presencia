"use client"

import { useState } from "react"
import { Tabs } from "@/components/ui/Tabs"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"

interface Principle {
  number: number
  name: string
  description: string
  examples: string
  mistakes: string
  script: string
  infant: string
  toddler: string
  preschool: string
}

interface Module {
  id: string
  moduleNumber: number
  title: string
  duration: string
  objectives: string
  keyConcepts: string
  exercise: string
  reflection: string
  unlocks: string
}

const TABS = [
  { value: "principles", label: "7 Principles" },
  { value: "modules", label: "Onboarding" },
]

export function LearnClient({
  principles,
  modules,
  completedModules,
}: {
  principles: Principle[]
  modules: Module[]
  completedModules: number[]
  userId: string
}) {
  const [tab, setTab] = useState("principles")
  const [selectedPrinciple, setSelectedPrinciple] = useState<Principle | null>(null)
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)

  return (
    <div>
      <Tabs tabs={TABS} value={tab} onChange={setTab} className="mb-6" />

      {tab === "principles" && (
        <div className="space-y-4">
          {principles.map((p) => (
            <Card
              key={p.number}
              hover
              className="cursor-pointer"
              onClick={() => setSelectedPrinciple(p)}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-sage-light flex items-center justify-center shrink-0">
                  <span className="font-heading text-lg text-sage-dark">
                    {p.number}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-lg text-ink mb-1">
                    {p.name}
                  </h3>
                  <p className="text-sm text-ink-muted line-clamp-2">
                    {p.description}
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-ink-faint shrink-0 mt-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "modules" && (
        <div className="space-y-4">
          <p className="text-sm text-ink-muted">
            8-module educarer curriculum. Work through each module to build your
            RIE foundation.
          </p>
          {modules.map((m, i) => {
            const isCompleted = completedModules.includes(m.moduleNumber)
            const isLocked = i > 0 && !completedModules.includes(modules[i - 1].moduleNumber) && !isCompleted
            return (
              <Card
                key={m.id}
                hover={!isLocked}
                className={`cursor-pointer ${isLocked ? "opacity-60" : ""}`}
                onClick={() => !isLocked && setSelectedModule(m)}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      isCompleted
                        ? "bg-sage text-white"
                        : isLocked
                          ? "bg-sand text-ink-faint"
                          : "bg-clay-light text-clay"
                    }`}
                  >
                    {isCompleted ? (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : isLocked ? (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                    ) : (
                      <span className="font-heading text-sm">{m.moduleNumber}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-ink text-sm">
                      Module {m.moduleNumber}: {m.title}
                    </h3>
                    <p className="text-xs text-ink-muted">{m.duration}</p>
                  </div>
                  {isCompleted && <Badge variant="sage">Complete</Badge>}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Principle Detail Modal */}
      <Modal
        open={!!selectedPrinciple}
        onClose={() => setSelectedPrinciple(null)}
        title={selectedPrinciple ? `Principle ${selectedPrinciple.number}` : ""}
      >
        {selectedPrinciple && (
          <div className="space-y-5">
            <div>
              <h3 className="font-heading text-xl text-ink mb-2">
                {selectedPrinciple.name}
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                {selectedPrinciple.description}
              </p>
            </div>

            {selectedPrinciple.examples && (
              <div>
                <h4 className="text-sm font-medium text-ink mb-1">
                  In Practice
                </h4>
                <p className="text-sm text-ink-muted leading-relaxed whitespace-pre-wrap">
                  {selectedPrinciple.examples}
                </p>
              </div>
            )}

            {selectedPrinciple.script && (
              <div className="bg-sage-light rounded-[var(--radius-md)] p-4">
                <h4 className="text-sm font-medium text-sage-dark mb-1">
                  What It Sounds Like
                </h4>
                <p className="text-sm text-ink leading-relaxed italic">
                  {selectedPrinciple.script}
                </p>
              </div>
            )}

            {selectedPrinciple.mistakes && (
              <div className="bg-clay-light rounded-[var(--radius-md)] p-4">
                <h4 className="text-sm font-medium text-clay mb-1">
                  Common Mistakes
                </h4>
                <p className="text-sm text-ink-muted leading-relaxed">
                  {selectedPrinciple.mistakes}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {selectedPrinciple.infant && (
                <div className="bg-blush-light rounded-[var(--radius-md)] p-3">
                  <p className="text-xs font-medium text-blush mb-1">Infant</p>
                  <p className="text-xs text-ink-muted">{selectedPrinciple.infant}</p>
                </div>
              )}
              {selectedPrinciple.toddler && (
                <div className="bg-clay-light rounded-[var(--radius-md)] p-3">
                  <p className="text-xs font-medium text-clay mb-1">Toddler</p>
                  <p className="text-xs text-ink-muted">{selectedPrinciple.toddler}</p>
                </div>
              )}
              {selectedPrinciple.preschool && (
                <div className="bg-sky-light rounded-[var(--radius-md)] p-3">
                  <p className="text-xs font-medium text-sky mb-1">Preschool</p>
                  <p className="text-xs text-ink-muted">{selectedPrinciple.preschool}</p>
                </div>
              )}
            </div>

            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                setSelectedPrinciple(null)
                window.location.href = `/guide`
              }}
            >
              Ask the Guide about this principle
            </Button>
          </div>
        )}
      </Modal>

      {/* Module Detail Modal */}
      <Modal
        open={!!selectedModule}
        onClose={() => setSelectedModule(null)}
        title={selectedModule ? `Module ${selectedModule.moduleNumber}` : ""}
      >
        {selectedModule && (
          <div className="space-y-5">
            <div>
              <h3 className="font-heading text-xl text-ink mb-1">
                {selectedModule.title}
              </h3>
              <p className="text-xs text-ink-faint">{selectedModule.duration}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-ink mb-1">
                Learning Objectives
              </h4>
              <p className="text-sm text-ink-muted leading-relaxed whitespace-pre-wrap">
                {selectedModule.objectives}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-ink mb-1">
                Key Concepts
              </h4>
              <p className="text-sm text-ink-muted leading-relaxed whitespace-pre-wrap">
                {selectedModule.keyConcepts}
              </p>
            </div>

            <div className="bg-sage-light rounded-[var(--radius-md)] p-4">
              <h4 className="text-sm font-medium text-sage-dark mb-1">
                In-Practice Exercise
              </h4>
              <p className="text-sm text-ink leading-relaxed">
                {selectedModule.exercise}
              </p>
            </div>

            <div className="bg-clay-light rounded-[var(--radius-md)] p-4">
              <h4 className="text-sm font-medium text-clay mb-1">
                Reflection Prompt
              </h4>
              <p className="text-sm text-ink leading-relaxed italic">
                {selectedModule.reflection}
              </p>
            </div>

            {selectedModule.unlocks && (
              <p className="text-xs text-ink-faint">
                Unlocks: {selectedModule.unlocks}
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
