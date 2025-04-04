import { prisma } from "@/lib/prisma";

export async function createGroup(userId: string, name: string) {
  if (!name || name.length < 3) {
    throw new Error("Group name is too short");
  }

  return await prisma.group.create({
    data: {
      name,
      members: {
        create: { userId, role: "admin" },
      },
    },
  });
}

export async function getGroupById(groupId: string) {
  return await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });
}
/*
Add User to a group
Validates if the inviter is the admin of the group
Validates if the invitee email exists
*/
export async function addUserToGroupByEmail({
  inviterId,
  groupId,
  inviteeEmail,
}: {
  inviterId: string;
  groupId: string;
  inviteeEmail: string;
}) {
  // 1. Check if inviter is an admin of the group
  const inviter = await prisma.userGroup.findFirst({
    where: {
      userId: inviterId,
      groupId,
      role: "admin",
    },
  });

  if (!inviter) {
    throw new Error("Only group admins can invite users.");
  }

  // 2. Look up the invitee by email
  const user = await prisma.user.findUnique({
    where: { email: inviteeEmail },
  });

  if (!user) {
    throw new Error("User with that email does not exist.");
  }

  // 3. Check if user is already in the group
  const alreadyMember = await prisma.userGroup.findFirst({
    where: {
      userId: user.id,
      groupId,
    },
  });

  if (alreadyMember) {
    throw new Error("User is already a member of the group.");
  }

  // 4. Add user to the group as a regular member
  return await prisma.userGroup.create({
    data: {
      userId: user.id,
      groupId,
      role: "member",
    },
  });
}
