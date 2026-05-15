"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Eye,
  Image,
  User,
  Star,
  Flag,
  Sparkles,
  Coins,
  Shield,
  Settings,
  MoreHorizontal,
} from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Dashboard" },
  { href: "/review", icon: Eye, label: "Review-Queue", badge: 24 },
  { href: "/reports", icon: Flag, label: "Reports" },
  { href: "/users", icon: User, label: "Nutzer" },
  { href: "/agencies", icon: Star, label: "Creator & Badges" },
  { href: "/payments", icon: Coins, label: "Flames & Auszahlungen" },
  { href: "/risk", icon: Shield, label: "Moderation-Log" },
  { href: "/watermark", icon: Settings, label: "Einstellungen" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col bg-[#0d0a08] border-r border-hair">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-[22px] py-6">
        <div className="w-[18px] h-[25px] bg-gold rounded-sm" />
        <div>
          <div className="font-serif text-[17px] text-gold font-medium tracking-[0.5px]">FEXORA</div>
          <div className="text-[10px] text-text-faint tracking-[1.5px] uppercase">Admin</div>
        </div>
      </div>

      <div className="eyebrow text-[10px] text-text-faint tracking-[1.5px] px-5 pb-2">Übersicht</div>

      {/* Navigation */}
      <nav className="flex-1 px-3.5 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-[11px] rounded-lg px-3 py-[9px] text-body-sm font-medium transition-fexora",
                isActive
                  ? "bg-gold/[0.12] text-gold hairline-strong"
                  : "text-text-muted hover:text-text hover:bg-elevated"
              )}
            >
              <item.icon className="size-4" />
              <span className="flex-1">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="min-w-[18px] h-[18px] rounded-[9px] px-[7px] bg-danger text-white text-[10px] font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User chip */}
      <div className="px-3.5 py-3">
        <div className="flex items-center gap-2.5 p-2.5 rounded-[10px] bg-card hairline">
          <div className="w-8 h-8 rounded-full bg-elevated flex items-center justify-center text-[11px] text-text font-semibold">
            KM
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] text-text font-semibold">K. Mertens</div>
            <div className="text-[10px] text-text-muted">Admin · Senior</div>
          </div>
          <MoreHorizontal className="size-3.5 text-text-muted" />
        </div>
      </div>
    </aside>
  );
}
