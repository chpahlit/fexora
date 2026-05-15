"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth";
import { FlameMark } from "@/components/ui/flame-mark";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GoldDivider } from "@/components/ui/gold-divider";
import { Check, CreditCard, ShieldCheck, Eye } from "lucide-react";

const TOTAL_STEPS = 3;

const flamePacks = [
  { flames: 50, price: "4,99", bonus: "" },
  { flames: 120, price: "9,99", bonus: "+10 Bonus", tag: "Start" },
  { flames: 280, price: "19,99", bonus: "+30 Bonus", tag: "Beliebt", best: true },
  { flames: 800, price: "49,99", bonus: "+120 Bonus" },
];

export default function OnboardingPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(0);

  function next() {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    } else {
      router.push("/feed");
    }
  }

  function skip() {
    router.push("/feed");
  }

  return (
    <div className="col-span-full min-h-screen bg-bg flex flex-col items-center justify-center p-8">
      {/* Progress dots */}
      <div className="flex gap-2 mb-12">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full transition-fexora"
            style={{
              width: i === step ? 32 : 12,
              background:
                i === step
                  ? "linear-gradient(135deg, #e8c089 0%, #d4a574 40%, #a07a4d 100%)"
                  : i < step
                    ? "var(--gold)"
                    : "var(--elevated)",
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-[540px]">
        {step === 0 && (
          <StepWelcome
            username={user?.profile?.username ?? "anonym"}
            t={t}
            onNext={next}
          />
        )}
        {step === 1 && <StepAge t={t} onNext={next} />}
        {step === 2 && <StepTopUp t={t} onNext={next} onSkip={skip} />}
      </div>
    </div>
  );
}

/* ─── Step 1: Welcome ─── */
function StepWelcome({
  username,
  t,
  onNext,
}: {
  username: string;
  t: ReturnType<typeof useTranslations>;
  onNext: () => void;
}) {
  return (
    <div className="text-center">
      <FlameMark size={40} className="mx-auto mb-6" />
      <h1 className="font-serif text-[48px] text-text font-normal leading-[1.05] tracking-[-1px] mb-4">
        {t("onboardingWelcomeTitle1")}{" "}
        <span className="italic text-gold">{t("onboardingWelcomeTitle2")}</span>
      </h1>
      <p className="text-body-lg text-text-muted mb-10 max-w-[400px] mx-auto">
        {t("onboardingWelcomeSub")}
      </p>

      {/* User card */}
      <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-card hairline mb-10">
        <Avatar ring className="h-12 w-12">
          <AvatarFallback className="text-body-lg">
            {username[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="text-left">
          <div className="text-body text-text font-semibold">@{username}</div>
          <div className="text-body-sm text-text-muted">18+ · Pseudonym</div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button variant="primary" size="lg" onClick={onNext}>
          {t("onboardingContinue")}
        </Button>
      </div>
    </div>
  );
}

/* ─── Step 2: Age Verification Info ─── */
function StepAge({
  t,
  onNext,
}: {
  t: ReturnType<typeof useTranslations>;
  onNext: () => void;
}) {
  const items = [
    { icon: CreditCard, text: t("onboardingAgeInfo1") },
    { icon: ShieldCheck, text: t("onboardingAgeInfo2") },
    { icon: Eye, text: t("onboardingAgeInfo3") },
  ];

  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6 hairline-strong">
        <ShieldCheck className="size-7 text-gold" />
      </div>
      <h1 className="font-serif text-[40px] text-text font-normal leading-[1.1] tracking-[-0.5px] mb-3">
        {t("onboardingAgeTitle")}
      </h1>
      <p className="text-body text-text-muted mb-10 max-w-[400px] mx-auto">
        {t("onboardingAgeSub")}
      </p>

      <div className="flex flex-col gap-4 mb-10 text-left max-w-[380px] mx-auto">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-elevated flex items-center justify-center shrink-0 hairline">
              <item.icon className="size-5 text-gold" />
            </div>
            <span className="text-body text-text">{item.text}</span>
          </div>
        ))}
      </div>

      <Button variant="primary" size="lg" onClick={onNext}>
        {t("onboardingContinue")}
      </Button>
    </div>
  );
}

/* ─── Step 3: Optional First Top-Up ─── */
function StepTopUp({
  t,
  onNext,
  onSkip,
}: {
  t: ReturnType<typeof useTranslations>;
  onNext: () => void;
  onSkip: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="text-center">
      <FlameMark size={26} className="mx-auto mb-6" />
      <h1 className="font-serif text-[40px] text-text font-normal leading-[1.1] tracking-[-0.5px] mb-3">
        {t("onboardingTopUpTitle")}
      </h1>
      <p className="text-body text-text-muted mb-8 max-w-[400px] mx-auto">
        {t("onboardingTopUpSub")}
      </p>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {flamePacks.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelected(i)}
            className="relative rounded-xl p-5 text-center transition-fexora cursor-pointer"
            style={{
              background:
                selected === i
                  ? "rgba(212,165,116,0.08)"
                  : "var(--card)",
              boxShadow:
                selected === i
                  ? "inset 0 0 0 1.5px rgba(212,165,116,0.4)"
                  : "inset 0 0 0 0.5px rgba(212,165,116,0.10)",
            }}
          >
            {p.tag && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 inline-flex items-center rounded-full px-2.5 h-[20px] text-[10px] font-semibold uppercase tracking-[0.3px] bg-gold/15 text-gold border border-gold/20">
                {p.tag}
              </span>
            )}
            <div className="font-serif text-[36px] text-text font-medium leading-none">
              {p.flames}
            </div>
            <div className="eyebrow mt-1 mb-3">Flames</div>
            <div className="font-serif text-[18px] text-gold font-medium italic">
              €{p.price}
            </div>
            {p.bonus && (
              <div className="text-[11px] text-success font-semibold mt-1.5">
                {p.bonus}
              </div>
            )}
            {selected === i && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-gold-grad flex items-center justify-center">
                <Check className="size-3 text-bg" strokeWidth={3} />
              </div>
            )}
          </button>
        ))}
      </div>

      <GoldDivider className="mb-8" />

      <div className="flex gap-3 justify-center">
        <Button variant="ghost" size="lg" onClick={onSkip}>
          {t("onboardingSkip")}
        </Button>
        <Button variant="primary" size="lg" onClick={onNext}>
          {selected !== null ? t("onboardingFinish") : t("onboardingSkip")}
        </Button>
      </div>
    </div>
  );
}
