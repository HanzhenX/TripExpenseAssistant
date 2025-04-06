"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TopBarProps {
  user: {
    name: string;
    image?: string | null | undefined;
  };
}

export function TopBar({ user }: TopBarProps) {
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center justify-between p-4 border-b bg-background">
      {/* Left: Logo + Company Name */}
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src="/tripmate-logo.png" alt="Company Logo" />
          <AvatarFallback>TM</AvatarFallback>
        </Avatar>
        <span className="text-xl font-bold text-primary">TripMate</span>
      </div>

      {/* Right: User Avatar (mocked for now) */}
      <Avatar className="h-10 w-10">
        {user.image && <AvatarImage src={user.image} alt={user.name} />}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
    </div>
  );
}
