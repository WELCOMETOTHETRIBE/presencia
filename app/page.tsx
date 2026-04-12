import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import Link from "next/link"

export default async function HomePage() {
  const session = await auth()
  if (session?.user) redirect("/dashboard")

  return (
    <div className="min-h-dvh bg-cream">
      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-sage flex items-center justify-center">
            <span className="text-white text-sm font-bold">P</span>
          </div>
          <span className="font-heading text-xl text-ink">Presencia</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-ink-muted hover:text-ink transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 bg-sage text-white text-sm font-medium rounded-[var(--radius-md)] hover:bg-sage-dark transition-colors"
          >
            Start free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28 text-center">
        <h1 className="font-heading text-4xl md:text-6xl text-ink leading-tight mb-6">
          The art of being present.
        </h1>
        <p className="text-ink-muted text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
          Presencia helps RIE educators, nannies, and parents bring structure,
          beauty, and intention to every moment with children.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-sage text-white rounded-[var(--radius-md)] font-medium hover:bg-sage-dark transition-colors text-lg min-h-[48px]"
          >
            Start free
          </Link>
          <a
            href="#features"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-ink border border-border-md rounded-[var(--radius-md)] font-medium hover:bg-sage-light transition-colors text-lg min-h-[48px]"
          >
            See how it works
          </a>
        </div>
        <p className="text-sm text-ink-faint mt-6 italic">
          See more. Do less. Trust the child.
        </p>
      </section>

      {/* Features */}
      <section id="features" className="bg-white py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-heading text-3xl md:text-4xl text-ink text-center mb-4">
            Everything you need to practice with intention
          </h2>
          <p className="text-ink-muted text-center max-w-2xl mx-auto mb-16">
            Designed for the daily rhythm of RIE-informed care &mdash; from
            observation to reflection to family communication.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="📝"
              title="Observation Logs"
              description="Document what you see, not what you interpret. Voice input for hands-free logging during care sessions."
            />
            <FeatureCard
              icon="👶"
              title="Child Profiles"
              description="Track real development at its own pace. 157 milestones across 8 domains, grounded in RIE principles."
            />
            <FeatureCard
              icon="🌿"
              title="AI Guide"
              description="Your RIE mentor, available the moment you need it. Grounded in 25 sheets of RIE knowledge."
            />
            <FeatureCard
              icon="💛"
              title="Scenario Help"
              description="Mid-situation? Get one clear RIE-grounded action with exact words to say. No preamble."
            />
            <FeatureCard
              icon="📬"
              title="Family Communication"
              description="Draft warm, observation-based messages for families. AI helps, Rebecca reviews before sending."
            />
            <FeatureCard
              icon="📚"
              title="Learn &amp; Grow"
              description="7 RIE principles, 8 onboarding modules, 80+ FAQ answers. Your professional development path."
            />
          </div>
        </div>
      </section>

      {/* AI Showcase */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl text-ink mb-4">
              Your RIE mentor, in your pocket.
            </h2>
            <p className="text-ink-muted text-lg">
              The AI Guide is grounded in the Presencia Brain &mdash; 25 sheets
              of RIE knowledge including 180+ milestones, 75+ emotional
              scenarios, 80+ FAQ answers, and research backing from Pikler,
              Bowlby, and more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-[var(--radius-lg)] border border-border p-6">
              <div className="text-2xl mb-3">🔍</div>
              <h3 className="font-heading text-lg text-ink mb-2">
                Observation Insights
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                Log an observation and get an AI reflection naming the RIE
                principle at work, the developmental significance, and a
                deepening question.
              </p>
            </div>
            <div className="bg-white rounded-[var(--radius-lg)] border border-border p-6">
              <div className="text-2xl mb-3">🆘</div>
              <h3 className="font-heading text-lg text-ink mb-2">
                Live Scenario Help
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                Two toddlers fighting over a toy? Get one clear action and exact
                words to say, grounded in RIE limit-setting principles.
              </p>
            </div>
            <div className="bg-white rounded-[var(--radius-lg)] border border-border p-6">
              <div className="text-2xl mb-3">💌</div>
              <h3 className="font-heading text-lg text-ink mb-2">
                Family Drafts
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                Draft warm, observation-based messages for families. Lead with
                what was seen, never judged. Always reviewed before sending.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-white py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-heading text-3xl md:text-4xl text-ink text-center mb-4">
            Simple, honest pricing
          </h2>
          <p className="text-ink-muted text-center mb-16">
            Start free. Upgrade when you&apos;re ready.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PricingCard
              name="Seedling"
              price="Free"
              description="For getting started"
              features={[
                "1 child profile",
                "30 observations/month",
                "RIE principles library",
                "5 AI Guide chats/day",
                "3 scenario helps/day",
              ]}
              cta="Start free"
              href="/signup"
            />
            <PricingCard
              name="Cultivate"
              price="$19"
              period="/mo"
              description="For working educarer"
              features={[
                "Unlimited children",
                "Unlimited observations",
                "Voice input",
                "Unlimited AI Guide",
                "Family portal",
                "Milestone tracking",
                "Weekly AI digests",
              ]}
              cta="Start free trial"
              href="/signup"
              featured
            />
            <PricingCard
              name="Studio"
              price="$49"
              period="/mo"
              description="For teams & schools"
              features={[
                "Everything in Cultivate",
                "Up to 10 team members",
                "Group care features",
                "PDF reports",
                "Priority support",
              ]}
              cta="Contact us"
              href="/signup"
            />
          </div>
        </div>
      </section>

      {/* Testimonial / Quote */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="bg-clay-light rounded-[var(--radius-xl)] p-8 md:p-12">
            <p className="font-heading text-xl md:text-2xl text-ink leading-relaxed italic mb-6">
              &ldquo;Do less. Observe more. Enjoy most.&rdquo;
            </p>
            <p className="text-ink-muted text-sm">
              &mdash; Magda Gerber, founder of RIE
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-sage flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">P</span>
            </div>
            <span className="text-sm text-ink-muted">
              Presencia &middot; Built by Rebecca Suazo &middot; Los Angeles
            </span>
          </div>
          <p className="text-xs text-ink-faint">
            &copy; {new Date().getFullYear()} Presencia. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string
  title: string
  description: string
}) {
  return (
    <div className="bg-cream rounded-[var(--radius-lg)] p-6 border border-border">
      <div className="text-2xl mb-3">{icon}</div>
      <h3 className="font-heading text-lg text-ink mb-2">{title}</h3>
      <p className="text-sm text-ink-muted leading-relaxed">{description}</p>
    </div>
  )
}

function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  href,
  featured,
}: {
  name: string
  price: string
  period?: string
  description: string
  features: string[]
  cta: string
  href: string
  featured?: boolean
}) {
  return (
    <div
      className={`rounded-[var(--radius-lg)] p-6 border ${
        featured
          ? "border-sage bg-sage-light/30 ring-2 ring-sage/20"
          : "border-border bg-cream"
      }`}
    >
      {featured && (
        <span className="inline-block px-2.5 py-0.5 bg-sage text-white text-xs font-medium rounded-full mb-3">
          Most popular
        </span>
      )}
      <h3 className="font-heading text-xl text-ink">{name}</h3>
      <p className="text-sm text-ink-muted mb-4">{description}</p>
      <div className="mb-6">
        <span className="font-heading text-3xl text-ink">{price}</span>
        {period && <span className="text-ink-muted text-sm">{period}</span>}
      </div>
      <ul className="space-y-2 mb-6">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-ink-muted">
            <svg
              className="w-4 h-4 text-sage mt-0.5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={`block text-center py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-colors ${
          featured
            ? "bg-sage text-white hover:bg-sage-dark"
            : "bg-white border border-border-md text-ink hover:bg-sage-light"
        }`}
      >
        {cta}
      </Link>
    </div>
  )
}
