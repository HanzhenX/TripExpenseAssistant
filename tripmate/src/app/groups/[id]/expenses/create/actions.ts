"use server";

import { createTransaction } from "@/lib/db/transactions";
import { getCurrentUser } from "@/lib/auth";

export async function createExpenseAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("You must be logged in.");

  const groupId = formData.get("groupId") as string;
  const descriptionInput = formData.get("description") as string;
  const category = formData.get("category") as string;
  const amount = parseFloat(formData.get("amount") as string);

  const combinedDescription = `${descriptionInput} Category: ${category}`;

  return await createTransaction({
    groupId,
    amount,
    description: combinedDescription,
  });
}
