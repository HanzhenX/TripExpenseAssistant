"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

export function GroupCard({
  group,
}: {
  group: { id: number; name: string; members: { name: string; avatar: string }[] }
}) {
  const router = useRouter()
  const avatars = group.members.slice(0, 3)
  const extraCount = group.members.length - 3

  return (
    <Card
    className="cursor-pointer transition hover:shadow-md w-full h-64 p-6"
    onClick={() => router.push(`/groups/${group.id}`)}
    >

      <CardHeader>
        <CardTitle>{group.name}</CardTitle>
        <div className="mt-2 flex items-center -space-x-2">
          {avatars.map((member, idx) => (
            <Image
              key={idx}
              src={member.avatar}
              alt={member.name}
              width={32}
              height={32}
              className="rounded-full border-2 border-white"
            />
          ))}
          {extraCount > 0 && (
            <div className="w-8 h-8 rounded-full bg-muted text-sm flex items-center justify-center border-2 border-white">
              +{extraCount}
            </div>
          )}
        </div>
      </CardHeader>
    </Card>
  )
}
