import { Topbar } from "@/components/layout/Topbar"
import { Card } from "@/components/ui/Card"

export default function GuidePage() {
  return (
    <div>
      <Topbar
        title="AI Guide"
        subtitle="Your RIE mentor, available when you need it"
      />
      <Card className="text-center py-16">
        <div className="text-4xl mb-4">🌿</div>
        <h3 className="font-heading text-xl text-ink mb-2">Coming soon</h3>
        <p className="text-sm text-ink-muted max-w-md mx-auto">
          The AI Guide will be your Brain-grounded RIE mentor — offering observation
          insights, scenario help, and family communication drafts.
        </p>
      </Card>
    </div>
  )
}
