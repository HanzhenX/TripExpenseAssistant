import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

export function GroupSidebar({ groupId }: { groupId: string }) {
  const members = [
    { name: "Alice", avatar: "..." },
    { name: "Bob", avatar: "..." },
  ]

  return (
    <Card className="w-64 h-full border-r rounded-none">
      <CardHeader>
        <CardTitle>Group Members</CardTitle>
      </CardHeader>
      <ScrollArea className="px-4 pb-4">
        {members.map((m, i) => (
          <div key={i} className="flex items-center gap-3 py-2">
            <Avatar>
              <AvatarImage src={m.avatar} />
              <AvatarFallback>{m.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{m.name}</span>
          </div>
        ))}
      </ScrollArea>
    </Card>
  )
}
