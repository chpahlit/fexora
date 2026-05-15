"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Bell, Search } from "lucide-react";
import { FlameMark } from "@/components/ui/flame-mark";
import { cn } from "@/lib/utils";

interface AppTopbarProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export function AppTopbar({ title, subtitle, className }: AppTopbarProps) {
  const t = useTranslations("nav");

  return (
    <header
      className={cn(
        "sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-hair px-4 md:px-7 backdrop-blur-[12px]",
        "bg-[rgba(10,8,7,0.85)]",
        className
      )}
    >
      {/* Mobile logo (visible < md) */}
      <Link href="/feed" className="flex md:hidden items-center gap-2">
        <FlameMark size={18} />
        <span className="font-serif text-[18px] text-gold tracking-tight">FEXORA</span>
      </Link>

      {/* Title */}
      {title && (
        <div className="hidden md:block">
          <div className="font-serif text-[22px] text-text font-medium italic leading-none tracking-[-0.3px]">
            {title}
          </div>
          {subtitle && (
            <div className="eyebrow text-text-faint text-[11px] tracking-[1px] mt-1">
              {subtitle}
            </div>
          )}
        </div>
      )}

      {/* Search */}
      <div
        className={cn(
          "flex-1 max-w-[480px]",
          title ? "md:ml-8" : ""
        )}
      >
        <button
          type="button"
          className="flex w-full items-center gap-2.5 h-10 px-3.5 rounded-[20px] bg-card hairline transition-fexora hover:hairline-strong"
        >
          <Search className="size-4 text-text-muted" />
          <span className="flex-1 text-left text-body-sm text-text-faint truncate">
            {t("search")}
          </span>
          <kbd className="hidden md:flex items-center gap-0.5 rounded bg-bg px-1.5 py-0.5 font-mono text-[10px] text-text-faint">
            ⌘ K
          </kbd>
        </button>
      </div>

      <div className="flex-1" />

      {/* Notifications */}
      <button
        type="button"
        className="relative w-10 h-10 rounded-full bg-card flex items-center justify-center hairline transition-fexora hover:hairline-strong"
      >
        <Bell className="size-4 text-gold" />
        <div className="absolute top-[9px] right-[9px] w-2 h-2 rounded-full bg-gold" />
      </button>
    </header>
  );
}
