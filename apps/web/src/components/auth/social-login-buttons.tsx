"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth";
import type { AuthResponse } from "@fexora/api-client";
import { Button } from "@/components/ui/button";

export function SocialLoginButtons() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { login, client } = useAuth();
  const [loading, setLoading] = useState<"google" | "apple" | null>(null);
  const [error, setError] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  async function handleGoogleLogin() {
    setLoading("google");
    setError("");

    try {
      // Open Google OAuth popup
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        `${apiUrl}/auth/google`,
        "google-login",
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!popup) {
        setError(t("popupBlocked"));
        setLoading(null);
        return;
      }

      // Listen for the OAuth callback message
      const result = await new Promise<AuthResponse | null>((resolve) => {
        const handleMessage = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;
          if (event.data?.type === "oauth-callback") {
            window.removeEventListener("message", handleMessage);
            resolve(event.data.payload as AuthResponse);
          }
        };

        window.addEventListener("message", handleMessage);

        // Timeout after 2 minutes
        const timeout = setTimeout(() => {
          window.removeEventListener("message", handleMessage);
          resolve(null);
        }, 120000);

        // Check if popup was closed
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            clearTimeout(timeout);
            window.removeEventListener("message", handleMessage);
            resolve(null);
          }
        }, 500);
      });

      if (result) {
        login(result.accessToken, result.refreshToken, result.user);
        router.push("/");
      }
    } catch {
      setError(t("socialLoginError"));
    } finally {
      setLoading(null);
    }
  }

  async function handleAppleLogin() {
    setLoading("apple");
    setError("");

    try {
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        `${apiUrl}/auth/apple`,
        "apple-login",
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!popup) {
        setError(t("popupBlocked"));
        setLoading(null);
        return;
      }

      const result = await new Promise<AuthResponse | null>((resolve) => {
        const handleMessage = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;
          if (event.data?.type === "oauth-callback") {
            window.removeEventListener("message", handleMessage);
            resolve(event.data.payload as AuthResponse);
          }
        };

        window.addEventListener("message", handleMessage);

        const timeout = setTimeout(() => {
          window.removeEventListener("message", handleMessage);
          resolve(null);
        }, 120000);

        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            clearTimeout(timeout);
            window.removeEventListener("message", handleMessage);
            resolve(null);
          }
        }, 500);
      });

      if (result) {
        login(result.accessToken, result.refreshToken, result.user);
        router.push("/");
      }
    } catch {
      setError(t("socialLoginError"));
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        className="w-full gap-2"
        onClick={handleGoogleLogin}
        disabled={loading !== null}
      >
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        {loading === "google" ? t("connecting") : t("continueWithGoogle")}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full gap-2"
        onClick={handleAppleLogin}
        disabled={loading !== null}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.32-1.55 4.3-3.74 4.25z" />
        </svg>
        {loading === "apple" ? t("connecting") : t("continueWithApple")}
      </Button>
    </div>
  );
}
