import { TopBar } from "@/components/top-bar"; // or use SiteHeader if preferred
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ClientGroupGrid } from "@/components/dashboard/client-group-grid";
import prisma from "@/lib/prisma";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  console.log(user)
  /*
Currently depreciated, api fetch authentication requires cookie.
*/

  // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/me/groups`, {
  //   cache: "no-store",
  // });

  // if (!res.ok) {
  //   const errorText = await res.text();
  //   console.error("Failed to fetch user groups:", res.status, errorText);
  //   throw new Error(`Failed to fetch user groups: ${res.status}`);
  // }

  // const groups = await res.json();

  const groups = await prisma.userGroup.findMany({
    where: {
      userId: user.id,
      group: {
        state: {
          not: "hidden",
        },
      },
    },
    include: {
      group: {
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      },
    },
    orderBy: [{ group: { state: "asc" } }, { group: { createdAt: "desc" } }],
  });
  console.log("Sending groups to client:", groups);
  groups.forEach((g) => {
    console.log(`Members of group ${g.group.name}:`, g.group.members);
  });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopBar user={user}/>
      <main className="flex flex-1 flex-col p-4">
        <ClientGroupGrid groups={groups} />
      </main>
    </div>
  );
}
