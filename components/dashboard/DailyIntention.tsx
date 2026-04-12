import { Card } from "@/components/ui/Card"

interface DailyIntentionProps {
  text: string
  principle: string
  category: string
}

export function DailyIntention({ text, principle, category }: DailyIntentionProps) {
  return (
    <Card className="bg-clay-light border-clay/20">
      <p className="text-xs font-medium text-clay uppercase tracking-wider mb-2">
        {category} &middot; {principle}
      </p>
      <p className="font-heading text-lg md:text-xl text-ink leading-relaxed">
        {text}
      </p>
    </Card>
  )
}
