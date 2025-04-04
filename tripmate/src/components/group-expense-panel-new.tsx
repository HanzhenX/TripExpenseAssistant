"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react";

import { useRouter } from "next/navigation";

export function GroupExpensePanel({
  expenses,
}: {
  expenses: Array<{
    id: number;
    name: string;
    amount: number;
    paidBy: string;
    participants: string[];
    timestamp: string;
  }>;
}) {
  const router = useRouter();

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Expenses</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/expenses/create`)}
        >
          <PlusIcon className="w-4 h-4 mr-1" />
          Add Expense
        </Button>
      </div>

      <div className="space-y-4">
        {expenses.map((exp) => (
          <Card key={exp.id}>
            <CardHeader className="flex justify-between items-center">
              <div>
                <CardTitle>{exp.name}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Paid by {exp.paidBy} · {exp.timestamp}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <PencilIcon className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                Total: <strong>${exp.amount.toFixed(2)}</strong>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {exp.participants.map((p, i) => (
                  <Badge key={i} variant="outline">
                    {p} owes $
                    {(exp.amount / (exp.participants.length + 1)).toFixed(2)}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Group Controls */}
      <div className="mt-6 flex flex-col gap-4">
        {/* <Button variant="default">Submit New Expense</Button> */}
        <Button variant="default">Settle Group</Button>
        <div className="text-sm">
          Invitation Code: <Badge variant="secondary">ABC123</Badge>
        </div>
      </div>
    </>
  );
}
