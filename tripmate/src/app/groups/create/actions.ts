"use server";

import { createGroup } from "@/lib/db/group";
import { getCurrentUser } from "@/lib/auth";

export async function createGroupAction(groupName: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("You must be logged in.");

  return await createGroup(user.id, groupName);
}
