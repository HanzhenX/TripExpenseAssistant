"use server"

import prisma from "@/lib/prisma"

export async function createGroup(formData: FormData) {
  const name = formData.get("name")?.toString().trim()
  const managerIdStr = formData.get("managerId")?.toString().trim()

  if (!name) return { error: "Group name is required" }
  

  try {
    const newGroup = await prisma.group.create({
      data: {
        name,
        status: "active", // optional: default is 'active'
      },
    })

    return { group: newGroup }
  } catch (err) {
    console.error("Error creating group:", err)
    return { error: "Failed to create group" }
  }
}
