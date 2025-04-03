"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createGroupAction } from "./actions";
import { useRequireSession } from "@/lib/hooks/use-require-session";

export default function Page() {
  // Check if user is logged in on client side
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const { session, authLoading } = useRequireSession();
  if (authLoading || !session) {
    return <p>Loading...</p>;
  }

  const handleAction = async (formData: FormData) => {
    startTransition(async () => {
      try {
        const groupName = formData.get("name") as string;
        await createGroupAction(groupName);
        setMessage("Group created successfully!");
        setTimeout(() => router.push("/dashboard"), 2000);
      } catch (err) {
        setMessage(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
      }
    });
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Create a New Group</h1>
      <form action={handleAction} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Group Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? "Creating..." : "Create Group"}
        </Button>
        {message && <p className="text-sm text-blue-600 mt-2">{message}</p>}
      </form>
    </div>
  );
}
