import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  basePath: "/api/auth",
});

export async function getUserClient() {
  const { data: session, error } = await authClient.getSession();
  return session?.user ?? null;
}
