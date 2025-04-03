"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
// import your action: e.g. createGroup
import { createGroupAction } from "./actions";

export default function Page() {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAction = async (formData: FormData) => {
    startTransition(async () => {
      try {
        const groupName = formData.get("name") as string;

        const group = await createGroupAction(groupName);

        setMessage("Group created successfully!");
        setTimeout(() => router.push("/dashboard"), 2000);
      } catch (err) {
        if (err instanceof Error) {
          setMessage(err.message);
        } else {
          setMessage("An unknown error occurred.");
        }
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

        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create Group"}
        </Button>

        {message && <p className="text-sm text-blue-600 mt-2">{message}</p>}
      </form>
    </div>
  );
}
