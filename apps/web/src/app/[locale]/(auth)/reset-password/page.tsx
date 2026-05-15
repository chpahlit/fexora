"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { AuthHero } from "@/components/auth/auth-hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FlameMark } from "@/components/ui/flame-mark";
import { Check, AlertTriangle } from "lucide-react";

export default function ResetPasswordPage() {
  const t = useTranslations();
  const router = useRouter();
  const { client } = useAuth();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!token) {
    return (
      <>
        <AuthHero
          title1={t("auth.loginHeroTitle1")}
          title2={t("auth.loginHeroTitle2")}
          subtitle={t("auth.loginHeroSub")}
          seed={4}
        />
        <div className="flex items-center justify-center bg-bg p-10 lg:p-20">
          <div className="w-full max-w-[420px] text-center">
            <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="size-7 text-danger" />
            </div>
            <h1 className="font-serif text-[32px] text-text font-normal mb-3">
              {t("auth.invalidToken")}
            </h1>
            <p className="text-body text-text-muted mb-8">
              {t("auth.invalidTokenDescription")}
            </p>
            <Link
              href="/forgot-password"
              className="text-body-sm text-gold underline underline-offset-[3px] font-semibold"
            >
              {t("auth.requestNewLink")}
            </Link>
          </div>
        </div>
      </>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword.length < 8) {
      setError(t("auth.passwordTooShort"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t("auth.passwordsMismatch"));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await client.post("/auth/password-reset/confirm", {
        token,
        newPassword,
      });

      if (res.success) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setError(res.error ?? t("common.error"));
      }
    } catch {
      setError(t("common.error"));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <>
        <AuthHero
          title1={t("auth.loginHeroTitle1")}
          title2={t("auth.loginHeroTitle2")}
          subtitle={t("auth.loginHeroSub")}
          seed={4}
        />
        <div className="flex items-center justify-center bg-bg p-10 lg:p-20">
          <div className="w-full max-w-[420px] text-center">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <Check className="size-7 text-success" />
            </div>
            <h1 className="font-serif text-[32px] text-text font-normal mb-3">
              {t("auth.passwordResetSuccess")}
            </h1>
            <p className="text-body text-text-muted">
              {t("auth.redirectingToLogin")}
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AuthHero
        title1={t("auth.loginHeroTitle1")}
        title2={t("auth.loginHeroTitle2")}
        subtitle={t("auth.loginHeroSub")}
        seed={4}
      />
      <div className="flex items-center justify-center bg-bg p-10 lg:p-20">
        <div className="w-full max-w-[420px]">
          <span className="eyebrow tracking-[3px] mb-3 block">{t("auth.resetEyebrow")}</span>
          <h1 className="font-serif text-[40px] text-text font-normal leading-[1.05] tracking-[-0.5px] mb-9">
            {t("auth.resetTitle")}
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {error && (
              <div className="rounded-lg bg-danger/10 border border-danger/20 px-4 py-3 text-body-sm text-danger">
                {error}
              </div>
            )}

            <Input
              label={t("auth.newPassword")}
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="••••••••••"
            />
            <Input
              label={t("auth.confirmPassword")}
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="••••••••••"
            />

            <Button type="submit" variant="primary" size="lg" className="w-full mt-4" disabled={isSubmitting}>
              {isSubmitting ? t("common.loading") : t("auth.resetPassword")}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
