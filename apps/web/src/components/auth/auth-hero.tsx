"use client";

import { useTranslations } from "next-intl";
import { FImage } from "@/components/ui/f-image";
import { FlameMark } from "@/components/ui/flame-mark";

interface AuthHeroProps {
  title1: string;
  title2: string;
  subtitle: string;
  seed?: number;
}

export function AuthHero({ title1, title2, subtitle, seed = 0 }: AuthHeroProps) {
  const t = useTranslations("auth");

  return (
    <div className="relative hidden lg:block overflow-hidden">
      <FImage seed={seed} locked="gold" />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,8,7,0.3) 0%, rgba(10,8,7,0.85) 100%)",
        }}
      />

      {/* Logo top-left */}
      <div className="absolute top-14 left-14 flex items-center gap-2">
        <FlameMark size={22} />
        <span className="font-serif text-h3 text-gold tracking-tight">FEXORA</span>
      </div>

      {/* Text bottom-left */}
      <div className="absolute bottom-[60px] left-14 right-14">
        <div className="inline-flex items-center gap-2.5 mb-[22px]">
          <div className="w-[30px] h-px bg-gold" />
          <FlameMark size={14} />
          <span className="eyebrow tracking-[3px]">{t("heroMaison")}</span>
        </div>
        <h2 className="font-serif text-display-2 text-text font-normal leading-[0.95] tracking-[-1.5px] italic">
          {title1}
          <br />
          <span className="text-gold">{title2}</span>
        </h2>
        <p className="font-serif text-[18px] text-text-muted leading-[1.5] italic mt-[18px] max-w-[460px]">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
