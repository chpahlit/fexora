"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth";
import { registerSchema } from "@fexora/shared";
import type { AuthResponse } from "@fexora/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  const t = useTranslations();
  const router = useRouter();
  const { login, client } = useAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ageCheck, setAgeCheck] = useState(false);
  const [consent, setConsent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!ageCheck || !consent) {
      setError(t("common.error"));
      return;
    }

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      username: formData.get("username") as string,
      referralCode: (formData.get("referralCode") as string) || undefined,
    };

    // Confirm password match
    const confirmPassword = formData.get("confirmPassword") as string;
    if (data.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const validation = registerSchema.safeParse(data);
    if (!validation.success) {
      setError(validation.error.issues[0]?.message ?? t("common.error"));
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await client.post<AuthResponse>("/auth/register", data);

      if (res.success && res.data) {
        login(res.data.accessToken, res.data.refreshToken, res.data.user);
        router.push("/");
      } else {
        setError(res.error ?? t("common.error"));
      }
    } catch {
      setError(t("common.error"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>{t("auth.registerTitle")}</CardTitle>
          <CardDescription>FEXORA</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                required
                minLength={3}
                maxLength={30}
                pattern="^[a-zA-Z0-9_]+$"
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="mail@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {t("auth.confirmPassword")}
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="referralCode">{t("auth.referralCode")}</Label>
              <Input
                id="referralCode"
                name="referralCode"
                autoComplete="off"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={ageCheck}
                  onCheckedChange={setAgeCheck}
                  required
                  className="mt-0.5"
                />
                <span className="text-sm">{t("auth.ageCheck")}</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={consent}
                  onCheckedChange={setConsent}
                  required
                  className="mt-0.5"
                />
                <span className="text-sm">{t("auth.consent")}</span>
              </label>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !ageCheck || !consent}
            >
              {isSubmitting ? t("common.loading") : t("common.register")}
            </Button>
            <p className="text-sm text-muted-foreground">
              {t("common.or")}{" "}
              <Link href="/login" className="text-primary hover:underline">
                {t("common.login")}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
