"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

export function GroupSidebar({
  group,
}: {
  group: {
    id: string;
    name: string;
    members: {
      user: {
        name: string;
        image: string | null;
      };
    }[];
  };
}) {
  const memberUsers = group.members.map((m) => m.user);

  return (
    <Card className="w-64 h-full border-r rounded-none">
      <CardHeader>
        <CardTitle>Group Members</CardTitle>
      </CardHeader>
      <ScrollArea className="px-4 pb-4">
        {memberUsers.map((m, i) => (
          <div key={i} className="flex items-center gap-3 py-2">
            <Avatar>
              <AvatarImage src={m.image ?? ""} />
              <AvatarFallback>{m.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{m.name}</span>
          </div>
        ))}
      </ScrollArea>
    </Card>
  );
}
