"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth";
import { AuthHero } from "@/components/auth/auth-hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FlameMark } from "@/components/ui/flame-mark";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const t = useTranslations();
  const { client } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    if (!email || !email.includes("@")) {
      setError(t("auth.invalidEmail"));
      return;
    }

    setIsSubmitting(true);
    try {
      await client.post("/auth/password-reset", { email });
      setSuccess(true);
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
          seed={3}
        />
        <div className="flex items-center justify-center bg-bg p-10 lg:p-20">
          <div className="w-full max-w-[420px] text-center">
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6 hairline-strong">
              <Mail className="size-7 text-gold" />
            </div>
            <h1 className="font-serif text-[40px] text-text font-normal leading-[1.05] mb-4">
              {t("auth.checkEmail")}
            </h1>
            <p className="text-body text-text-muted mb-10">
              {t("auth.resetEmailSent")}
            </p>
            <Link
              href="/login"
              className="text-body-sm text-gold underline underline-offset-[3px] font-semibold"
            >
              {t("auth.backToLogin")}
            </Link>
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
        seed={3}
      />
      <div className="flex items-center justify-center bg-bg p-10 lg:p-20">
        <div className="w-full max-w-[420px]">
          <span className="eyebrow tracking-[3px] mb-3 block">{t("auth.forgotEyebrow")}</span>
          <h1 className="font-serif text-[40px] text-text font-normal leading-[1.05] tracking-[-0.5px] mb-3">
            {t("auth.forgotTitle")}
          </h1>
          <p className="text-body text-text-muted mb-9">
            {t("auth.forgotSub")}
          </p>

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
              placeholder="mail@example.com"
            />

            <Button type="submit" variant="primary" size="lg" className="w-full mt-4" disabled={isSubmitting}>
              {isSubmitting ? t("common.loading") : t("auth.sendResetLink")}
            </Button>
          </form>

          <p className="text-center text-body-sm text-text-muted mt-8">
            <Link href="/login" className="text-gold underline underline-offset-[3px]">
              {t("auth.backToLogin")}
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
