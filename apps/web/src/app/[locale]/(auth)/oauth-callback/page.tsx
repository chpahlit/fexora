"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function OAuthCallbackPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");
    const role = searchParams.get("role");
    const username = searchParams.get("username");
    const error = searchParams.get("error");

    if (error) {
      window.opener?.postMessage(
        { type: "oauth-callback", error },
        window.location.origin
      );
      window.close();
      return;
    }

    if (accessToken && refreshToken && userId && email) {
      window.opener?.postMessage(
        {
          type: "oauth-callback",
          payload: {
            accessToken,
            refreshToken,
            user: {
              id: userId,
              email,
              role: role || "User",
              isVerified18: true,
              isActive: true,
              createdAt: new Date().toISOString(),
              profile: username ? { username } : undefined,
            },
          },
        },
        window.location.origin
      );
      window.close();
    }
  }, [searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center">
        <div className="h-8 w-8 mx-auto animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4 text-sm text-muted-foreground">Completing sign in...</p>
      </div>
    </main>
  );
}
