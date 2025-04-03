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
      const warningDiv = document.createElement("div");
      warningDiv.textContent =
        "You are not logged in. Redirecting to login page...";
      warningDiv.style.position = "fixed";
      warningDiv.style.top = "1rem";
      warningDiv.style.left = "50%";
      warningDiv.style.transform = "translateX(-50%)";
      warningDiv.style.background = "#fef3c7";
      warningDiv.style.color = "#92400e";
      warningDiv.style.padding = "0.75rem 1.5rem";
      warningDiv.style.border = "1px solid #fcd34d";
      warningDiv.style.borderRadius = "0.375rem";
      warningDiv.style.zIndex = "9999";
      document.body.appendChild(warningDiv);

      const timeout = setTimeout(() => {
        router.push("/login");
        document.body.removeChild(warningDiv);
      }, 2000);

      return () => {
        clearTimeout(timeout);
        if (document.body.contains(warningDiv)) {
          document.body.removeChild(warningDiv);
        }
      };
    }
  }, [authLoading, session, router]);

  return { session, authLoading, error };
}
