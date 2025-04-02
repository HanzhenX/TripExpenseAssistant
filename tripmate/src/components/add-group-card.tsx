"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { PlusIcon } from "lucide-react"

export function AddGroupCard() {
  const router = useRouter()

  return (
    <Card
      onClick={() => router.push("/groups/create")}
      className="flex h-full cursor-pointer items-center justify-center text-muted-foreground hover:text-primary hover:shadow-md transition"
    >
      <PlusIcon className="h-10 w-10" strokeWidth={2.5} />
    </Card>
  )
}
