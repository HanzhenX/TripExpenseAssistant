import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "read:user user:email",
        },
      },
      profile(profile: any) {
        console.log("GitHub profile returned:", profile);
        return {
          id: profile.id.toString(),
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    },
  },
});

export async function getLoggedInUser() {
  const session = (await authClient.getSession()) as {
    user?: { email?: string };
  };

  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  return user ?? null;
}
