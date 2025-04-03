// "use server"

// import prisma from "@/lib/prisma"

// export async function createGroup(formData: FormData) {
//   const name = formData.get("name")?.toString().trim()


//   if (!name) return { error: "Group name is required" }
  

//   try {
//     const newGroup = await prisma.group.create({
//       data: {
//         name,
//         status: "active", // optional: default is 'active'
//       },
//     })

//     return { group: newGroup }
//   } catch (err) {
//     console.error("Error creating group:", err)
//     return { error: "Failed to create group" }
//   }
// }




// export async function createExpense(formData: FormData) {
//   const name = formData.get("name")?.toString()
//   const amountStr = formData.get("amount")?.toString()
//   const groupIdStr = formData.get("groupId")?.toString()

//   if (!name || !amountStr || !groupIdStr) return { error: "Missing fields" }

//   const amount = parseFloat(amountStr)
//   const groupId = parseInt(groupIdStr)

//   if (isNaN(amount) || amount <= 0) return { error: "Invalid amount" }

//   try {
//     await prisma.expense.create({
//       data: {
//         name,
//         amount,
//         group: { connect: { id: groupId } },
//         createdBy: 1, // 👈 TODO: replace with actual user id when auth is added
//         paidBy: 1,
//       },
//     })

//     return {}
//   } catch (err) {
//     console.error("Error creating expense:", err)
//     return { error: "Failed to create expense" }
//   }
// }
