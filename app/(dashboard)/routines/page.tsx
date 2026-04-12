import { Topbar } from "@/components/layout/Topbar"
import { Card } from "@/components/ui/Card"

export default function RoutinesPage() {
  return (
    <div>
      <Topbar
        title="Routines"
        subtitle="Daily rhythms for every child in your care"
      />
      <Card className="text-center py-16">
        <div className="text-4xl mb-4">🕐</div>
        <h3 className="font-heading text-xl text-ink mb-2">Coming soon</h3>
        <p className="text-sm text-ink-muted max-w-md mx-auto">
          Build visual daily routines with drag-and-drop, grounded in
          RIE care routine scripts from the Brain.
        </p>
      </Card>
    </div>
  )
}
