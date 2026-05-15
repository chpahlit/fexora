"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth";
import { loginSchema } from "@fexora/shared";
import type { AuthResponse } from "@fexora/api-client";
import { AuthHero } from "@/components/auth/auth-hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Shield } from "lucide-react";

export default function LoginPage() {
  const t = useTranslations();
  const router = useRouter();
  const { login, client } = useAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needs2FA, setNeeds2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const validation = loginSchema.safeParse(data);
    if (!validation.success) {
      setError(validation.error.issues[0]?.message ?? t("common.error"));
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await client.post<AuthResponse>("/auth/login", {
        ...data,
        ...(needs2FA && twoFactorCode ? { twoFactorCode } : {}),
      });

      if (res.success && res.data) {
        login(res.data.accessToken, res.data.refreshToken, res.data.user);
        router.push("/feed");
      } else if (res.error === "2fa_required") {
        setNeeds2FA(true);
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
    <>
      {/* Left: Hero */}
      <AuthHero
        title1={t("auth.loginHeroTitle1")}
        title2={t("auth.loginHeroTitle2")}
        subtitle={t("auth.loginHeroSub")}
        seed={0}
      />

      {/* Right: Form */}
      <div className="flex items-center justify-center bg-bg p-10 lg:p-20">
        <div className="w-full max-w-[420px]">
          <span className="eyebrow tracking-[3px] mb-3 block">{t("auth.loginEyebrow")}</span>
          <h1 className="font-serif text-[40px] text-text font-normal leading-[1.05] tracking-[-0.5px] mb-9">
            {t("auth.loginTitle")}
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {error && (
              <div className="rounded-lg bg-danger/10 border border-danger/20 px-4 py-3 text-body-sm text-danger">
                {error}
              </div>
            )}

            <Input
              label={t("auth.email")}
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="liora@noir.studio"
            />
            <Input
              label={t("auth.password")}
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••••"
            />

            {needs2FA && (
              <Input
                label={t("auth.twoFactorCode")}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                placeholder="000000"
                maxLength={6}
                autoComplete="one-time-code"
              />
            )}

            <div className="flex items-center justify-between mt-2 mb-4">
              <label className="flex items-center gap-2 cursor-pointer text-body-sm text-text-muted">
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className="w-[18px] h-[18px] rounded-[5px] flex items-center justify-center transition-fexora"
                  style={{
                    background: rememberMe
                      ? "linear-gradient(135deg, #e8c089 0%, #d4a574 40%, #a07a4d 100%)"
                      : "transparent",
                    boxShadow: rememberMe
                      ? "none"
                      : "inset 0 0 0 1px rgba(212,165,116,0.22)",
                  }}
                >
                  {rememberMe && <Check className="size-3 text-bg" strokeWidth={2.5} />}
                </button>
                {t("auth.rememberMe")}
              </label>
              <Link
                href="/forgot-password"
                className="text-body-sm text-gold underline underline-offset-[3px]"
              >
                {t("auth.forgotPassword")}
              </Link>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t("common.loading") : t("auth.loginSubmit")}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-7">
            <div className="flex-1 h-px bg-hair" />
            <span className="eyebrow text-text-muted">{t("auth.orDivider")}</span>
            <div className="flex-1 h-px bg-hair" />
          </div>

          {/* OAuth */}
          <div className="flex gap-2.5 mb-8">
            <Button variant="secondary" size="default" className="flex-1">
              {t("auth.withApple")}
            </Button>
            <Button variant="secondary" size="default" className="flex-1">
              {t("auth.withGoogle")}
            </Button>
          </div>

          {/* Register link */}
          <p className="text-center text-body-sm text-text-muted">
            {t("auth.newHere")}{" "}
            <Link href="/register" className="text-gold underline underline-offset-[3px] font-semibold">
              {t("auth.createAccount")}
            </Link>
          </p>

          {/* 18+ Notice */}
          <div className="mt-12 p-4 rounded-lg bg-gold/[0.06] hairline flex gap-3 items-start">
            <Shield className="size-3.5 text-gold mt-0.5 shrink-0" />
            <p className="text-[11px] text-text-muted leading-[1.55]">
              {t("auth.adultNotice")}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
