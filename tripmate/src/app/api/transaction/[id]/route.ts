import { prisma } from "@/lib/prisma"
import { getLoggedInUser } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getLoggedInUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const transaction = await prisma.transaction.findUnique({
    where: { id: params.id },
    include: {
      group: {
        include: {
          members: true,
        },
      },
    },
  })

  if (!transaction) {
    return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
  }

  const isMember = transaction.group.members.some((m) => m.userId === user.id)
  if (!isMember) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return NextResponse.json(transaction)
}
