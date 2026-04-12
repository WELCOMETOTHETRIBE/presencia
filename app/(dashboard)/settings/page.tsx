import { Topbar } from "@/components/layout/Topbar"
import { Card } from "@/components/ui/Card"

export default function SettingsPage() {
  return (
    <div>
      <Topbar title="Settings" subtitle="Manage your account and preferences" />
      <Card className="text-center py-16">
        <div className="text-4xl mb-4">⚙️</div>
        <h3 className="font-heading text-xl text-ink mb-2">Coming soon</h3>
        <p className="text-sm text-ink-muted max-w-md mx-auto">
          Profile, subscription, AI usage, and notification settings.
        </p>
      </Card>
    </div>
  )
}
