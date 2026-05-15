"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FlameMark } from "@/components/ui/flame-mark";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MarketingNav() {
  const t = useTranslations("landing");

  const navLinks = [
    { href: "/#creators", label: t("navCreators") },
    { href: "/#how-it-works", label: t("navHowItWorks") },
    { href: "/#faq", label: t("navFaq") },
  ];

  return (
    <nav className="absolute top-0 left-0 right-0 z-10 flex h-[76px] items-center px-14 gap-10">
      <Link href="/" className="flex items-center gap-2">
        <FlameMark size={22} />
        <span className="font-serif text-h3 text-gold tracking-tight">
          FEXORA
        </span>
      </Link>

      <div className="flex-1 flex gap-7">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-body-sm text-text-muted font-medium hover:text-text transition-fexora"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <Link
        href="/login"
        className="text-body-sm text-text font-medium hover:text-gold transition-fexora"
      >
        {t("navSignIn")}
      </Link>
      <Link
        href="/register"
        className={cn(buttonVariants({ variant: "primary", size: "default" }))}
      >
        {t("navJoin")}
      </Link>
    </nav>
  );
}
