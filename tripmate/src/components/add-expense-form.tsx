// components/add-expense-form.tsx
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function AddExpenseForm({ groupId }: { groupId: string }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)} variant="default" size="sm">
          Add Expense
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>

        <form
          className="space-y-4 mt-4"
          onSubmit={(e) => {
            e.preventDefault()
            // TODO: Add actual submission logic
            setOpen(false)
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="name">Expense Name</Label>
            <Input id="name" name="name" placeholder="e.g. Dinner at Moxie's" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input id="amount" name="amount" type="number" min="0" step="0.01" required />
          </div>

          {/* You can later add: participant checkboxes, notes, etc. */}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
