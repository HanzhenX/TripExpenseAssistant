import { GroupSidebar } from "@/components/group-sidebar";
import { GroupExpensePanel } from "@/components/group-expense-panel";
import { createTransaction } from "@/lib/db/transactions";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function GroupPage({
  params,
  expenses,
}: {
  params: { id: string };
  expenses: {
    id: string;
    description: string;
    imageurl?: string;
    amount: number;
    paidBy: string;
    timestamp: string;
  }[];
}) {
  const groupId = params.id;

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const group = await prisma.group.findUnique({
    where: { id: groupId },
    select: {
      id: true,
      name: true,
      members: {
        select: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });

  const fetchedExpenses = await prisma.transaction.findMany({
    where: { groupId },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      description: true,
      imageUrl: true, 
      amount: true,
      createdAt: true,
      paidBy: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });

  if (!group) {
    return <div>Group not found</div>;
  }

  return (
    <div className="flex h-screen">
      {/* Left Panel: Group Members */}
      <GroupSidebar group={group} />

      {/* Right Panel: Expenses & Controls */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        <GroupExpensePanel
          expenses={fetchedExpenses.map((e) => ({
            id: e.id,
            description: e.description ?? "",
            imageUrl: e.imageUrl ?? "",
            amount: e.amount,
            paidBy: e.paidBy.name,
            paidById: e.paidBy.id,
            timestamp: e.createdAt.toISOString(),
          }))}
        />
      </div>
    </div>
  );
}
