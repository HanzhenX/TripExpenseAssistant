"use client"

import { useState } from "react"
import { TopBar } from "@/components/top-bar" // or use SiteHeader if preferred
import { GroupCard } from "@/components/group-card"
import { AddGroupCard } from "@/components/add-group-card"

const mockGroups = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  name: `Group ${i + 1}`,
  members: [
    { name: "Alice", avatar: `https://api.dicebear.com/7.x/lorelei/png?seed=alice${i}` },
    { name: "Bob", avatar: `https://api.dicebear.com/7.x/lorelei/png?seed=bob${i}` },
    { name: "Carol", avatar: `https://api.dicebear.com/7.x/lorelei/png?seed=carol${i}` },
    { name: "Dan", avatar: `https://api.dicebear.com/7.x/lorelei/png?seed=dan${i}` },
  ],
}))


export default function Page() {
  const [showAll, setShowAll] = useState(false)
  const visibleGroups = showAll ? mockGroups : mockGroups.slice(0, 7)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopBar /> {/* Replace with <SiteHeader /> if you're using that instead */}
      <main className="flex flex-1 flex-col p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {visibleGroups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
          <AddGroupCard />
        </div>
        {!showAll && mockGroups.length > 7 && (
          <div className="mt-6 flex justify-center">
            <button
              className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
              onClick={() => setShowAll(true)}
            >
              Show more
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
