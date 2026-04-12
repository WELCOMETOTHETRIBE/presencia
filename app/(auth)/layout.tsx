export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-dvh bg-cream flex">
      {/* Left brand panel — desktop only */}
      <div className="hidden md:flex md:w-1/2 bg-sage-light items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-sage flex items-center justify-center mx-auto mb-8">
            <span className="text-white text-2xl font-bold">P</span>
          </div>
          <h1 className="font-heading text-4xl text-ink mb-4">Presencia</h1>
          <p className="text-ink-muted text-lg leading-relaxed">
            See more. Do less. Trust the child.
          </p>
          <div className="mt-12 p-6 bg-white/60 rounded-[var(--radius-lg)] text-left">
            <p className="text-ink-muted italic text-sm leading-relaxed">
              &ldquo;When you teach a child something, you take away forever
              his chance of discovering it for himself.&rdquo;
            </p>
            <p className="text-ink-faint text-xs mt-3">
              &mdash; Jean Piaget
            </p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="md:hidden text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-sage flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-lg font-bold">P</span>
            </div>
            <h1 className="font-heading text-2xl text-ink">Presencia</h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
