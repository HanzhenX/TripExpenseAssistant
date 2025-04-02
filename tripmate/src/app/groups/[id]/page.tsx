// app/groups/[id]/page.tsx
import { GroupSidebar } from "@/components/group-sidebar"
import { GroupExpensePanel } from "@/components/group-expense-panel"

export default async function GroupPage({ params }: { params: { id: string } }) {
  const groupId = params.id
 /* need to replace  with something like 
 const group = await prisma.group.findUnique({
  where: { id: parseInt(params.id) },
  include: { members: true, expenses: true },
})*/
  return (
    <div className="flex h-screen">
      {/* Left Panel: Group Members */}
      <GroupSidebar groupId={groupId} />

      {/* Right Panel: Expenses & Controls */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        <GroupExpensePanel groupId={groupId} />
      </div>
    </div>
  )
}
