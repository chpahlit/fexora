"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Home, Search, Plus, MessageCircle, User } from "lucide-react";

const tabs = [
  { id: "feed", href: "/feed", icon: Home, labelKey: "feed" },
  { id: "explore", href: "/explore", icon: Search, labelKey: "explore" },
  { id: "plus", href: "/upload", icon: Plus, labelKey: "" },
  { id: "chat", href: "/chat", icon: MessageCircle, labelKey: "chat" },
  { id: "profile", href: "/settings/profile", icon: User, labelKey: "profile" },
] as const;

export function BottomNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-6 left-4 right-4 z-40 flex md:hidden h-16 items-center justify-around rounded-full hairline-strong"
      style={{
        background: "rgba(20,17,13,0.7)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        boxShadow:
          "inset 0 0 0 0.5px rgba(212,165,116,0.22), 0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      {tabs.map((tab) => {
        const isActive = pathname.startsWith(tab.href);

        if (tab.id === "plus") {
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className="w-11 h-11 rounded-full bg-gold-grad flex items-center justify-center shadow-[0_4px_14px_rgba(212,165,116,0.4)]"
            >
              <Plus className="size-[22px] text-bg" strokeWidth={2.4} />
            </Link>
          );
        }

        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "flex flex-col items-center gap-0.5",
              isActive ? "text-gold" : "text-text-faint"
            )}
          >
            <tab.icon className="size-[22px]" />
            {tab.labelKey && (
              <span className="text-[10px] font-medium tracking-[0.3px]">
                {t(tab.labelKey)}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
