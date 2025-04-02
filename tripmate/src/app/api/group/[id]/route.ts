import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getLoggedInUser } from "@/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getLoggedInUser();

    if (!user) {
      return NextResponse.json(
        { error: "An authorised user is not found" },
        { status: 401 }
      );
    }

    const membership = await prisma.userGroup.findFirst({
      where: {
        userId: user.id,
        groupId: params.id,
      },
    });

    if (!membership) {
      return NextResponse.json(
        {
          error:
            "Forbidden. You can only view the group dashboard if you are a member of the group.",
        },
        { status: 403 }
      );
    }

    const group = await prisma.group.findUnique({
      where: { id: params.id },
      include: {
        members: {
          include: { user: true },
        },
        transactions: true,
      },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    return NextResponse.json(group);
  } catch (error) {
    console.error("Failed to fetch group:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
