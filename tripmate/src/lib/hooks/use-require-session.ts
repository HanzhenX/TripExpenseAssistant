"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function useRequireSession() {
  const {
    data: session,
    isPending: authLoading,
    error,
  } = authClient.useSession();

  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !session) {
      router.push("/login");
    }
  }, [authLoading, session, router]);

  return { session, authLoading, error };
}
