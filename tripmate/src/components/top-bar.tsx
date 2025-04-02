"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function TopBar() {
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
      <AvatarImage src="https://api.dicebear.com/7.x/lorelei/png?seed=tripmate-user" />
        <AvatarFallback>TS</AvatarFallback>
      </Avatar>
    </div>
  )
}
