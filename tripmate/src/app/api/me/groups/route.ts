import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const groups = await prisma.userGroup.findMany({
    where: {
      userId: user.id,
      group: {
        state: {
          not: "hidden", // exclude hidden
        },
      },
    },
    include: {
      group: true,
    },
    orderBy: [
      {
        group: {
          state: "asc", // active < settled
        },
      },
      {
        group: {
          createdAt: "desc", // newest first within same state
        },
      },
    ],
  });

  return NextResponse.json(groups.map((g) => g.group));
}
