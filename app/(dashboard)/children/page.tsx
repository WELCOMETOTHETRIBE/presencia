import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Topbar } from "@/components/layout/Topbar"
import { ChildCard } from "@/components/children/ChildCard"
import { ChildrenClient } from "./client"

export default async function ChildrenPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const children = await prisma.child.findMany({
    where: { educarerId: session.user.id, isActive: true },
    include: {
      _count: { select: { observations: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <Topbar
        title="Children"
        subtitle={`${children.length} ${children.length === 1 ? "child" : "children"} in your care`}
        action={<ChildrenClient />}
      />

      {children.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🌱</div>
          <h2 className="font-heading text-2xl text-ink mb-2">
            Your care begins here
          </h2>
          <p className="text-sm text-ink-muted max-w-sm mx-auto mb-6">
            Welcome your first child with a guided RIE intake &mdash;
            8 sections designed to help you see the whole child from day one.
          </p>
          <ChildrenClient />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {children.map((child) => (
            <ChildCard
              key={child.id}
              id={child.id}
              name={child.name}
              dob={child.dob.toISOString()}
              stage={child.stage}
              relationship={child.relationship}
              avatarColor={child.avatarColor}
              observationCount={child._count.observations}
            />
          ))}
        </div>
      )}
    </div>
  )
}
