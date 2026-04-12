"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Tabs } from "@/components/ui/Tabs"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { useToast } from "@/components/ui/Toast"

interface SettingsUser {
  id: string
  name: string | null
  email: string
  role: string
  plan: string
  bio: string | null
  credentials: string | null
  schoolAffil: string | null
  _count: {
    observations: number
    children: number
    aiConversations: number
    aiInsights: number
  }
}

const TABS = [
  { value: "profile", label: "Profile" },
  { value: "usage", label: "AI Usage" },
  { value: "account", label: "Account" },
]

export function SettingsClient({ user }: { user: SettingsUser }) {
  const [tab, setTab] = useState("profile")
  const [name, setName] = useState(user.name || "")
  const [bio, setBio] = useState(user.bio || "")
  const [credentials, setCredentials] = useState(user.credentials || "")
  const [schoolAffil, setSchoolAffil] = useState(user.schoolAffil || "")
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function handleSaveProfile() {
    setSaving(true)
    const res = await fetch("/api/settings/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, bio, credentials, schoolAffil }),
    })
    if (res.ok) {
      toast("Profile updated")
      router.refresh()
    } else {
      toast("Failed to update profile", "error")
    }
    setSaving(false)
  }

  const planLabel = { FREE: "Seedling", PRO: "Cultivate", STUDIO: "Studio" }[
    user.plan
  ] || user.plan

  return (
    <div>
      <Tabs tabs={TABS} value={tab} onChange={setTab} className="mb-6" />

      {tab === "profile" && (
        <div className="max-w-lg space-y-6">
          <Card>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-sage flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {(user.name || user.email)[0].toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-ink">{user.name || "Set your name"}</h3>
                <p className="text-sm text-ink-muted">{user.email}</p>
                <div className="flex gap-1.5 mt-1">
                  <Badge variant="sage">{planLabel}</Badge>
                  <Badge variant="sand">{user.role}</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Textarea
                label="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="A few words about your practice..."
                className="min-h-[80px]"
              />
              <Input
                label="Credentials"
                value={credentials}
                onChange={(e) => setCredentials(e.target.value)}
                placeholder="e.g., RIE Associate, ECE Degree"
              />
              <Input
                label="School / Organization"
                value={schoolAffil}
                onChange={(e) => setSchoolAffil(e.target.value)}
                placeholder="e.g., Independent, Center name"
              />
              <Button onClick={handleSaveProfile} loading={saving} className="w-full">
                Save profile
              </Button>
            </div>
          </Card>
        </div>
      )}

      {tab === "usage" && (
        <div className="max-w-lg space-y-4">
          <Card>
            <h3 className="font-heading text-lg text-ink mb-4">Your practice at a glance</h3>
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Observations" value={user._count.observations} />
              <Stat label="Children" value={user._count.children} />
              <Stat label="AI Conversations" value={user._count.aiConversations} />
              <Stat label="AI Insights" value={user._count.aiInsights} />
            </div>
          </Card>

          <Card>
            <h3 className="font-heading text-lg text-ink mb-2">Plan: {planLabel}</h3>
            <p className="text-sm text-ink-muted mb-4">
              {user.plan === "FREE"
                ? "5 AI chats/day, 3 scenario helps/day, 1 child, 30 obs/month"
                : user.plan === "PRO"
                  ? "Unlimited AI, children, and observations"
                  : "Everything in Cultivate plus team features"}
            </p>
            {user.plan === "FREE" && (
              <Button variant="secondary" className="w-full">
                Upgrade to Cultivate
              </Button>
            )}
          </Card>
        </div>
      )}

      {tab === "account" && (
        <div className="max-w-lg space-y-4">
          <Card>
            <h3 className="font-heading text-lg text-ink mb-2">Account</h3>
            <p className="text-sm text-ink-muted mb-4">
              Signed in as {user.email}
            </p>
            <Button
              variant="danger"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Sign out
            </Button>
          </Card>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-cream rounded-[var(--radius-md)] p-3">
      <p className="text-xs text-ink-faint uppercase tracking-wider">{label}</p>
      <p className="font-heading text-2xl text-ink">{value}</p>
    </div>
  )
}
