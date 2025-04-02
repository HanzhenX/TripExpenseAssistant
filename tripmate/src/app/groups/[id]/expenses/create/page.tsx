"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createExpense } from "@/lib/actions"

const categories = ["Food", "Travel", "Lodging", "Miscellaneous"]

export default function NewExpensePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const groupId = params.id
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)
  const [category, setCategory] = useState<string>("")

  const handleSubmit = (formData: FormData) => {
    formData.set("groupId", groupId)
    formData.set("category", category)

    startTransition(async () => {
      const result = await createExpense(formData)
      if (result?.error) {
        setMessage(result.error)
      } else {
        router.push(`/groups/${groupId}`)
      }
    })
  }

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
  )
}
