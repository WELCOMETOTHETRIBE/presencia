import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export default async function HomePage() {
  const session = await auth()

  if (session?.user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-dvh bg-cream flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <div className="w-16 h-16 rounded-full bg-sage flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-2xl font-bold">P</span>
        </div>
        <h1 className="font-heading text-4xl md:text-5xl text-ink mb-4">
          The art of being present.
        </h1>
        <p className="text-ink-muted text-lg leading-relaxed mb-8">
          Presencia helps RIE educators, nannies, and parents bring structure,
          beauty, and intention to every moment with children.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/signup"
            className="inline-flex items-center justify-center px-6 py-3 bg-sage text-white rounded-[var(--radius-md)] font-medium hover:bg-sage-dark transition-colors min-h-[44px]"
          >
            Start free
          </a>
          <a
            href="/login"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-ink border border-border-md rounded-[var(--radius-md)] font-medium hover:bg-sage-light transition-colors min-h-[44px]"
          >
            Sign in
          </a>
        </div>
        <p className="text-xs text-ink-faint mt-8">
          Created with Rebecca Suazo &middot; Larchmont Charter School, Los Angeles
        </p>
        <p className="text-xs text-ink-faint mt-1 italic">
          See more. Do less. Trust the child.
        </p>
      </div>
    </div>
  )
}
