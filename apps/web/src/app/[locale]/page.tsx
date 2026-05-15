import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { FlameMark } from "@/components/ui/flame-mark";
import { FImage } from "@/components/ui/f-image";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CreatorBadge } from "@/components/ui/creator-badge";
import { GoldDivider } from "@/components/ui/gold-divider";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Plus } from "lucide-react";

const featuredCreators = [
  { name: "Liora", seed: 0, sub: "Wien · Kerzenlicht", price: 24, lock: "blur" as const },
  { name: "Esmé Vauclair", seed: 1, sub: "Paris · Akt I — III", price: 48, lock: "gold" as const },
  { name: "Mira Aurum", seed: 2, sub: "Hörspiel · 24 min", price: 18, lock: "dark" as const },
];

const creatorTitles = ["Atelier I — Stille", "Im Spiegelsalon", "Das letzte Atelier"];

const tickerItems = ["EDITORIAL", "MAISON LIORA", "BOUTIQUE EDITION", "MIRA · HÖRSPIEL", "ATELIER 12", "ÉDITION PRIVÉE", "ESMÉ VAUCLAIR", "KAPITEL III"];

const stepNums = ["I", "II", "III", "IV"];

export default function LandingPage() {
  const t = useTranslations("landing");

  const flameSteps = stepNums.map((num, i) => ({
    num,
    title: t(`step${i + 1}Title`),
    desc: t(`step${i + 1}Desc`),
  }));

  const faqItems = Array.from({ length: 5 }, (_, i) => [
    t(`faq${i + 1}Q`),
    t(`faq${i + 1}A`),
  ]);

  return (
    <div className="min-h-screen bg-bg">
      <MarketingNav />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[760px] px-14 pt-[120px] pb-20 grid grid-cols-[1.1fr_1fr] gap-[60px] items-center">
        <div>
          <div className="inline-flex items-center gap-2.5 mb-[22px]">
            <div className="w-9 h-px bg-gold" />
            <FlameMark size={14} />
            <span className="eyebrow tracking-[3.5px]">{t("membership")}</span>
          </div>

          <h1 className="font-serif text-[84px] text-text font-normal leading-[0.96] tracking-[-2px] mb-4">
            {t("heroTitle1")}
            <br />
            <span className="italic text-gold">{t("heroTitle2")}</span> {t("heroTitle3")}
          </h1>

          <p className="font-serif text-[22px] text-text-muted leading-[1.5] italic max-w-[540px] mb-9">
            {t("heroSub")}
          </p>

          <div className="flex gap-3 mb-7">
            <Link
              href="/register"
              className={cn(buttonVariants({ variant: "primary", size: "lg" }))}
            >
              {t("createAccount")}
            </Link>
            <Link
              href="/explore"
              className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
            >
              {t("viewAtelier")}
            </Link>
          </div>

          <div className="flex gap-8 text-[12px] text-text-muted">
            {[t("noSubs"), t("anonymous"), t("pseudonym")].map((text) => (
              <span key={text} className="flex items-center gap-1.5">
                <Check className="size-3.5 text-gold" />
                {text}
              </span>
            ))}
          </div>
        </div>

        {/* Hero portrait collage */}
        <div className="relative h-[600px]">
          <div className="absolute top-0 right-0 w-[78%] h-[78%] rounded-lg overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
            <FImage seed={0} locked="gold" />
          </div>
          <div className="absolute bottom-0 left-0 w-[52%] h-[50%] rounded-lg overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
            <FImage seed={1} locked="blur" />
          </div>
          <div className="absolute top-[38%] left-[8%] w-[36%] h-[32%] rounded-lg overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.7)]">
            <FImage seed={2} locked="mosaic" />
          </div>
          <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-[rgba(10,8,7,0.7)] backdrop-blur-[20px] flex items-center gap-2 hairline-strong">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-[8px]">L</AvatarFallback>
            </Avatar>
            <span className="text-[11px] text-text">Liora · Atelier I</span>
            <CreatorBadge kind="verified" size="sm" />
          </div>
        </div>
      </section>

      {/* ═══ TICKER ═══ */}
      <section className="border-t border-b border-hair px-14 py-6 overflow-hidden">
        <div className="flex items-center gap-14 opacity-80">
          {tickerItems.map((text, i) => (
            <span
              key={i}
              className={cn(
                "font-serif text-[18px] italic whitespace-nowrap tracking-[4px]",
                i % 3 === 0 ? "text-gold" : "text-text-muted"
              )}
            >
              · {text}
            </span>
          ))}
        </div>
      </section>

      {/* ═══ FEATURED CREATORS ═══ */}
      <section id="creators" className="px-14 py-[100px]">
        <div className="flex items-end mb-12">
          <div>
            <span className="eyebrow tracking-[3px] mb-2.5 block">{t("weekAtelier")}</span>
            <h2 className="font-serif text-[56px] text-text font-normal leading-none tracking-[-1px]">
              {t("threeVoices1")}
              <br />
              <span className="italic text-gold">{t("threeVoices2")}</span>
            </h2>
          </div>
          <div className="flex-1" />
          <Link href="/explore" className="text-body-sm text-gold underline underline-offset-4">
            {t("allCreators")}
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-7">
          {featuredCreators.map((c, i) => (
            <div key={i}>
              <div className="relative h-[420px] rounded-md overflow-hidden mb-[18px]">
                <FImage seed={c.seed} locked={c.lock} />
                <div className="absolute top-3.5 left-3.5">
                  <Badge variant="gold">Nº 0{i + 1}</Badge>
                </div>
              </div>
              <span className="eyebrow tracking-[2.5px] text-[10px] mb-2 block">{c.sub}</span>
              <div className="font-serif text-[26px] text-text font-medium italic leading-[1.2] mb-2.5">
                „{creatorTitles[i]}"
              </div>
              <div className="flex items-center gap-2.5">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-[10px]">{c.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-body-sm text-text font-medium">{c.name}</span>
                <CreatorBadge kind="verified" size="sm" />
                <CreatorBadge kind="voice" size="sm" />
                <div className="flex-1" />
                <span className="font-serif text-[16px] text-gold font-semibold">
                  {c.price} 🔥
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ HOW FLAMES WORK ═══ */}
      <section id="how-it-works" className="px-14 py-20 bg-[#0d0a08] border-t border-b border-hair">
        <div className="text-center mb-[60px]">
          <div className="inline-flex items-center gap-2.5 mb-[18px]">
            <div className="w-[30px] h-px bg-gold" />
            <FlameMark size={14} />
            <div className="w-[30px] h-px bg-gold" />
          </div>
          <h2 className="font-serif text-display-3 text-text font-normal tracking-[-0.5px]">
            {t("howFlamesTitle1")} <span className="italic text-gold">{t("howFlamesTitle2")}</span> {t("howFlamesTitle3")}
          </h2>
        </div>

        <div className="grid grid-cols-4 gap-8">
          {flameSteps.map((step) => (
            <div key={step.num}>
              <div className="font-serif text-[64px] text-gold font-normal italic leading-none mb-3.5 opacity-40">
                {step.num}
              </div>
              <div className="font-serif text-h3 text-text font-medium mb-2.5">
                {step.title}
              </div>
              <p className="text-body-sm text-text-muted leading-[1.6]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ QUOTE ═══ */}
      <section className="px-14 py-[100px] text-center">
        <FlameMark size={26} className="mx-auto" />
        <blockquote className="font-serif text-h1 text-text font-normal italic leading-[1.3] tracking-[-0.4px] max-w-[900px] mx-auto mt-[30px] mb-6">
          {t("quote")}
        </blockquote>
        <cite className="eyebrow tracking-[2.5px] not-italic">{t("quoteAuthor")}</cite>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="px-14 pb-[100px]">
        <div
          className="relative rounded-[18px] overflow-hidden px-14 py-20 hairline-strong"
          style={{
            background:
              "radial-gradient(80% 100% at 30% 0%, rgba(212,165,116,0.2), transparent 60%), #14110d",
          }}
        >
          <div className="grid grid-cols-[1.4fr_1fr] gap-[60px] items-center">
            <div>
              <span className="eyebrow tracking-[3px] mb-3.5 block">{t("joinLabel")}</span>
              <h2 className="font-serif text-[56px] text-text font-normal leading-none tracking-[-1px] mb-5">
                {t("ctaTitle1")} <span className="italic text-gold">{t("ctaTitle2")}</span>.
              </h2>
              <p className="text-[15px] text-text-muted leading-[1.6] max-w-[480px] mb-8">
                {t("ctaSub")}
              </p>
              <div className="flex gap-3">
                <Link
                  href="/register"
                  className={cn(buttonVariants({ variant: "primary", size: "lg" }))}
                >
                  {t("createAccount")}
                </Link>
                <Link
                  href="/#how-it-works"
                  className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
                >
                  {t("learnMore")}
                </Link>
              </div>
            </div>
            <div className="relative h-[280px] flex items-center justify-center">
              <FlameMark size={240} />
              <span className="absolute top-[30px] right-[10px] opacity-30 font-serif text-[220px] text-gold leading-[0.8] tracking-[-10px] italic">
                F
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section id="faq" className="px-14 py-20 grid grid-cols-[1fr_2fr] gap-20">
        <div>
          <span className="eyebrow tracking-[3px] mb-3 block">{t("faqLabel")}</span>
          <h2 className="font-serif text-[42px] text-text font-normal leading-[1.05] tracking-[-0.5px]">
            {t("faqTitle1")}
            <br />
            <span className="italic text-gold">{t("faqTitle2")}</span>
          </h2>
        </div>
        <div>
          {faqItems.map(([q, a], i) => (
            <details key={i} className="py-5 border-b border-hair group">
              <summary className="flex items-center cursor-pointer list-none gap-4">
                <span className="flex-1 font-serif text-h3 text-text font-medium italic">
                  {q}
                </span>
                <Plus className="size-5 text-gold transition-transform group-open:rotate-45" />
              </summary>
              <p className="text-body text-text-muted leading-[1.6] mt-3 pr-10">
                {a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <GoldDivider className="mx-14" />

      <MarketingFooter />
    </div>
  );
}
