"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth";
import { registerSchema } from "@fexora/shared";
import type { AuthResponse } from "@fexora/api-client";
import { AuthHero } from "@/components/auth/auth-hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Shield } from "lucide-react";

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

    const confirmPassword = formData.get("confirmPassword") as string;
    if (data.password !== confirmPassword) {
      setError(t("auth.passwordsMismatch"));
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
        router.push("/onboarding");
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
        title1={t("auth.registerHeroTitle1")}
        title2={t("auth.registerHeroTitle2")}
        subtitle={t("auth.registerHeroSub")}
        seed={1}
      />

      {/* Right: Form */}
      <div className="flex items-center justify-center bg-bg p-10 lg:p-20">
        <div className="w-full max-w-[420px]">
          <span className="eyebrow tracking-[3px] mb-3 block">{t("auth.registerEyebrow")}</span>
          <h1 className="font-serif text-[40px] text-text font-normal leading-[1.05] tracking-[-0.5px] mb-9">
            {t("auth.registerTitle")}
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {error && (
              <div className="rounded-lg bg-danger/10 border border-danger/20 px-4 py-3 text-body-sm text-danger">
                {error}
              </div>
            )}

            <Input
              label={t("auth.username")}
              name="username"
              required
              minLength={3}
              maxLength={30}
              pattern="^[a-zA-Z0-9_]+$"
              autoComplete="username"
              placeholder="dein_pseudonym"
            />
            <Input
              label={t("auth.email")}
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="mail@example.com"
            />
            <Input
              label={t("auth.password")}
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
            <Input
              label={t("auth.referralCode")}
              name="referralCode"
              autoComplete="off"
            />

            {/* Checkboxes */}
            <div className="flex flex-col gap-3 mt-2 mb-4">
              <GoldCheckbox
                checked={ageCheck}
                onChange={setAgeCheck}
                label={t("auth.ageCheck")}
              />
              <GoldCheckbox
                checked={consent}
                onChange={setConsent}
                label={t("auth.consent")}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isSubmitting || !ageCheck || !consent}
            >
              {isSubmitting ? t("common.loading") : t("auth.registerSubmit")}
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

          {/* Login link */}
          <p className="text-center text-body-sm text-text-muted">
            {t("auth.alreadyAccount")}{" "}
            <Link href="/login" className="text-gold underline underline-offset-[3px] font-semibold">
              {t("auth.signInLink")}
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

function GoldCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="w-[18px] h-[18px] rounded-[5px] flex items-center justify-center shrink-0 mt-0.5 transition-fexora"
        style={{
          background: checked
            ? "linear-gradient(135deg, #e8c089 0%, #d4a574 40%, #a07a4d 100%)"
            : "transparent",
          boxShadow: checked
            ? "none"
            : "inset 0 0 0 1px rgba(212,165,116,0.22)",
        }}
      >
        {checked && <Check className="size-3 text-bg" strokeWidth={2.5} />}
      </button>
      <span className="text-body-sm text-text-muted">{label}</span>
    </label>
  );
}
