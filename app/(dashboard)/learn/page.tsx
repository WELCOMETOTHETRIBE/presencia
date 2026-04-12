import { Topbar } from "@/components/layout/Topbar"
import { Card } from "@/components/ui/Card"

export default function LearnPage() {
  return (
    <div>
      <Topbar
        title="Learn"
        subtitle="The 7 RIE Principles and your onboarding path"
      />
      <Card className="text-center py-16">
        <div className="text-4xl mb-4">📚</div>
        <h3 className="font-heading text-xl text-ink mb-2">Coming soon</h3>
        <p className="text-sm text-ink-muted max-w-md mx-auto">
          Explore the 7 RIE Principles and work through your 8-module
          educarer onboarding curriculum.
        </p>
      </Card>
    </div>
  )
}
