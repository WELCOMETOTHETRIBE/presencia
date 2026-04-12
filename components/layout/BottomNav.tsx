"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const TABS = [
  { href: "/dashboard", label: "Home", icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" },
  { href: "/children", label: "Children", icon: "M12 4a4 4 0 100 8 4 4 0 000-8zM4 21a8 8 0 0116 0" },
  { href: "/observe", label: "Observe", icon: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" },
  { href: "/guide", label: "Guide", icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
  { href: "/more", label: "More", icon: "M12 13a1 1 0 100-2 1 1 0 000 2zM19 13a1 1 0 100-2 1 1 0 000 2zM5 13a1 1 0 100-2 1 1 0 000 2z" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex h-16">
        {TABS.map((tab) => {
          const active =
            tab.href === "/more"
              ? ["/learn", "/routines", "/settings"].some((p) => pathname.startsWith(p))
              : pathname.startsWith(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href === "/more" ? "/settings" : tab.href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
                active ? "text-sage-dark" : "text-ink-faint"
              )}
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={tab.icon} />
              </svg>
              {active && <span>{tab.label}</span>}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
