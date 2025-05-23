"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function createTransaction(data: {
  groupId: string;
  amount: number;
  description?: string;
  imageUrl?:    string;
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  // Check user is a member of the group
  const membership = await prisma.userGroup.findFirst({
    where: {
      groupId: data.groupId,
      userId: user.id,
    },
  });

  if (!membership) throw new Error("Forbidden");

  const transaction = await prisma.transaction.create({
    data: {
      groupId: data.groupId,
      paidByUserId: user.id,
      amount: data.amount,
      description: data.description,
      imageUrl: data.imageUrl,
    },
  });
  console.log("✅ Successfully created transaction: ", transaction);
  return transaction;
}
