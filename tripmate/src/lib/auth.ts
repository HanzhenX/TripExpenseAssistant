import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { authClient } from "@/lib/auth-client";
import { nextCookies } from "better-auth/next-js";

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
  plugins: [nextCookies()], // make sure this is the last plugin in the array
});

export async function getCurrentUser() {
  console.log("🛠 getCurrentUser called");

  const session = (await authClient.getSession()) as {
    user?: { email?: string };
  };

  console.log("Session:", session);
  console.log("Email:", session?.user?.email);

  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  console.log("User:", user);

  return user ?? null;
}
