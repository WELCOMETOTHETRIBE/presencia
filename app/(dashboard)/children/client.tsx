"use client"

import Link from "next/link"
import { Button } from "@/components/ui/Button"

export function ChildrenClient() {
  return (
    <Link href="/children/onboard">
      <Button>Welcome a new child</Button>
    </Link>
  )
}
