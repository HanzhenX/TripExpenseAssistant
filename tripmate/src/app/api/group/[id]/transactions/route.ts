import { prisma } from "@/lib/prisma";
import { getLoggedInUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { groupId: string } }
) {
  const user = await getLoggedInUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const membership = await prisma.userGroup.findFirst({
    where: { userId: user.id, groupId: params.groupId },
  });

  if (!membership)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const transactions = await prisma.transaction.findMany({
    where: { groupId: params.groupId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(transactions);
}
