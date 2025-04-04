"use client";

import { useState, useTransition, use } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createExpenseAction } from "./actions";
import { RequiredExtensionArgs } from "@prisma/client/runtime/library";
import { useRequireSession } from "@/lib/hooks/use-require-session";
import { useParams } from "next/navigation";
const categories = ["Food", "Travel", "Lodging", "Miscellaneous"];

export default function NewExpensePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const groupId = params.id;
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("");

  const { session, authLoading } = useRequireSession();
  if (authLoading || !session) {
    return <p>Loading...</p>;
  }
  const handleSubmit = (formData: FormData) => {
    const amount = formData.get("amount")?.toString() ?? "";
    const description = formData.get("description")?.toString() ?? "";
    const receipt = formData.get("receipt") as File | null;

    formData.set("groupId", groupId);
    formData.set("userId", session.user.id);
    formData.set("amount", amount);
    formData.set("description", description);
    formData.set("category", category);
    if (receipt) {
      formData.set("receipt", receipt);
    }

    startTransition(async () => {
      try {
        let receiptKey: string | null = null;

        if (receipt) {
            // Upload to /api/upload
            const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: (() => {
                const f = new FormData();
                f.append("file", receipt);
                return f;
            })(),
            });

            const uploadData = await uploadRes.json();
            if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");
            receiptKey = uploadData.url 
        }

        if (receiptKey) {
            formData.set("receiptKey", receiptKey);
            // console.log(receiptKey)
        }

        await createExpenseAction(formData);
        setMessage("Expense successfully added!");
        setTimeout(() => {
          router.push(`/groups/${groupId}`);
        }, 1000);
      } catch (error: any) {
        console.error(error);
        setMessage("Failed to add expense. Please try again.");
      }
    });
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Add Expense</h1>
      <form action={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="description">Expense Description</Label>
          <Textarea id="description" name="description" required />
        </div>

        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" name="amount" type="number" step="0.01" required />
        </div>

        <div>
          <Label>Category</Label>
          <Select onValueChange={(value) => setCategory(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Choose category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="receipt">Upload Receipt (optional)</Label>
          <Input id="receipt" name="receipt" type="file" accept="image/*" />
        </div>

        <Button type="submit" disabled={isPending}>
          Submit
        </Button>

        {message && <p className="text-sm text-red-500 mt-2">{message}</p>}
      </form>
    </div>
  );
}
