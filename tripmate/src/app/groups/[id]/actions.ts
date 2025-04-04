"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function deleteTransactionAction(transactionId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  // Optional: Check that the user is authorized to delete this transaction
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
    select: { groupId: true, paidByUserId: true },
  });

  if (!transaction) throw new Error("Transaction not found");
  if (transaction.paidByUserId !== user.id) {
    throw new Error("Only the payer can delete the transaction");
  }
  // Optional: add authorization check here

  await prisma.transaction.delete({
    where: { id: transactionId },
  });

  return { success: true };
}

import { addUserToGroupByEmail } from "@/lib/db/group";

export async function addMemberAction({
  groupId,
  inviteeEmail,
}: {
  groupId: string;
  inviteeEmail: string;
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  return await addUserToGroupByEmail({
    inviterId: user.id,
    groupId,
    inviteeEmail,
  });
}
