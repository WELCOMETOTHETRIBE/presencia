import { Card } from "@/components/ui/Card"

interface MetricCardProps {
  label: string
  value: string | number
  sublabel?: string
}

export function MetricCard({ label, value, sublabel }: MetricCardProps) {
  return (
    <Card>
      <p className="text-xs font-medium text-ink-faint uppercase tracking-wider">{label}</p>
      <p className="font-heading text-2xl text-ink mt-1">{value}</p>
      {sublabel && <p className="text-xs text-ink-muted mt-0.5">{sublabel}</p>}
    </Card>
  )
}
