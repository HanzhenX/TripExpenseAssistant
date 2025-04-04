"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  deleteTransactionAction,
  addMemberAction,
} from "@/app/groups/[id]/actions";
import { useTransition } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function GroupExpensePanel({
  expenses,
}: {
  expenses: {
    id: string;
    description: string;
    amount: number;
    paidBy: string;
    timestamp: string;
  }[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [tz, setTz] = useState<string | null>(null);
  const params = useParams<{ id: string }>();
  const groupId = params.id;

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (typeof Intl !== "undefined") {
      setTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }
  }, []);

  return (
    <>
      {error && (
        <div className="text-sm text-red-500 border border-red-300 bg-red-100 px-4 py-2 rounded">
          {error}
        </div>
      )}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Expenses</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/groups/${groupId}/expenses/create`)}
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
                <CardTitle>{exp.description}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Paid by {exp.paidBy} ·{" "}
                  {new Date(exp.timestamp).toLocaleString(undefined, {
                    timeZone: tz ?? "UTC",
                  })}
                </div>
              </div>
              <div className="flex gap-2">
                {/* <Button variant="ghost" size="icon">
                  <PencilIcon className="w-4 h-4" />
                </Button> */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (
                      confirm("Are you sure you want to delete this expense?")
                    ) {
                      startTransition(async () => {
                        try {
                          setError(null);
                          await deleteTransactionAction(exp.id);
                          router.refresh(); // will re-run page.tsx and re-fetch data
                        } catch (err: any) {
                          setError(
                            err.message || "Failed to delete transaction."
                          );
                        }
                      });
                    }
                  }}
                  disabled={isPending}
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                Total: <strong>${exp.amount.toFixed(2)}</strong>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Group Controls */}
      <div className="mt-6 flex flex-col gap-4">
        {/* <Button variant="default">Submit New Expense</Button> */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="default">Add Member</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite by Email</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <DialogFooter>
              <Button
                onClick={async () => {
                  try {
                    await addMemberAction({ groupId, inviteeEmail: email });
                    setOpen(false);
                    router.refresh();
                  } catch (err: any) {
                    alert(err.message ?? "Failed to invite user");
                  }
                }}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button variant="default">Settle Group</Button>
        {/* <div className="text-sm">
          Invitation Code: <Badge variant="secondary">ABC123</Badge>
        </div> */}
      </div>
    </>
  );
}
