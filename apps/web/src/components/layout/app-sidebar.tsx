"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FlameMark } from "@/components/ui/flame-mark";
import { Button } from "@/components/ui/button";
import { CreatorBadge } from "@/components/ui/creator-badge";
import { cn } from "@/lib/utils";
import {
  Home,
  Search,
  MessageCircle,
  Coins,
  Bookmark,
  User,
  Settings,
  Plus,
} from "lucide-react";

const navItems = [
  { href: "/feed", icon: Home, labelKey: "feed", badge: 0 },
  { href: "/explore", icon: Search, labelKey: "explore", badge: 0 },
  { href: "/chat", icon: MessageCircle, labelKey: "chat", badge: 3 },
  { href: "/wallet", icon: Coins, labelKey: "wallet", badge: 0 },
  { href: "/favorites", icon: Bookmark, labelKey: "collection", badge: 0 },
  { href: "/settings/profile", icon: User, labelKey: "profile", badge: 0 },
] as const;

export function AppSidebar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden md:flex h-screen w-60 flex-col bg-[#0d0a08] border-r border-hair">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-[22px] py-6">
        <FlameMark size={22} />
        <span className="font-serif text-h3 text-gold tracking-tight">FEXORA</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3.5 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-body font-medium transition-fexora",
                isActive
                  ? "bg-gold/[0.12] text-gold hairline-strong"
                  : "text-text-muted hover:text-text hover:bg-elevated"
              )}
            >
              <item.icon className="size-[18px]" />
              <span className="flex-1">{t(item.labelKey)}</span>
              {item.badge && item.badge > 0 && (
                <span className="min-w-[18px] h-[18px] rounded-[9px] px-1.5 bg-gold-grad text-[11px] font-bold text-bg flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Wallet Pill */}
      <div className="px-3.5 pb-2.5">
        <div
          className="rounded-[14px] p-3.5 hairline-strong"
          style={{
            background:
              "radial-gradient(80% 60% at 100% 0%, rgba(212,165,116,0.2), transparent 60%), #14110d",
          }}
        >
          <div className="eyebrow text-[10px] tracking-[1.5px] mb-1">Guthaben</div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="font-serif text-[24px] text-text font-semibold">142</span>
            <span className="text-[11px] text-gold">🔥</span>
          </div>
          <Link href="/wallet">
            <Button variant="primary" size="sm" className="w-full">
              <Plus className="size-3.5" />
              Aufladen
            </Button>
          </Link>
        </div>
      </div>

      {/* User Chip */}
      <div className="border-t border-hair px-3.5 py-3">
        <Link
          href="/settings/profile"
          className="flex items-center gap-2.5 rounded-[10px] p-2 transition-fexora hover:bg-elevated hairline"
        >
          <Avatar className="h-8 w-8">
            {user?.profile?.avatarUrl && (
              <AvatarImage src={user.profile.avatarUrl} />
            )}
            <AvatarFallback>
              {(user?.profile?.username ?? user?.email ?? "U")[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] text-text font-semibold truncate">
              {user?.profile?.username
                ? user.profile.username
                : "@anonym_2406"}
            </div>
            <div className="text-[10px] text-text-muted">18+ verifiziert</div>
          </div>
          <Settings className="size-3.5 text-text-muted" />
        </Link>
      </div>
    </aside>
  );
}
