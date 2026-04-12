import { Sidebar } from "@/components/layout/Sidebar"
import { BottomNav } from "@/components/layout/BottomNav"
import { ToastProvider } from "@/components/ui/Toast"
import { ScenarioHelperWrapper } from "./scenario-helper"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ToastProvider>
      <div className="min-h-dvh bg-cream">
        <Sidebar />
        <main className="md:ml-60 pb-20 md:pb-0">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-8">
            {children}
          </div>
        </main>
        <BottomNav />
        <ScenarioHelperWrapper />
      </div>
    </ToastProvider>
  )
}
