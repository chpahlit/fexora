"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  Flag,
  MessageCircle,
  Activity,
  User,
  BookOpen,
  Shield,
} from "lucide-react";

const navItems = [
  { href: "/reports", icon: Flag, label: "Reports", badge: 3 },
  { href: "/board", icon: MessageCircle, label: "Chat-Moderation", badge: 12 },
  { href: "/audit", icon: Activity, label: "Voice-Stichproben" },
  { href: "/agency", icon: User, label: "Nutzerakten" },
  { href: "/snippets", icon: BookOpen, label: "Regelwerk" },
  { href: "/analytics", icon: Shield, label: "Audit-Log" },
];

export function ModSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col bg-[#0d0a08] border-r border-hair">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-[22px] py-6">
        <div className="w-7 h-7 rounded-lg bg-danger/15 flex items-center justify-center">
          <Shield className="size-4 text-danger" />
        </div>
        <div>
          <div className="font-serif text-[17px] text-gold font-medium tracking-[0.5px]">FEXORA</div>
          <div className="text-[10px] text-danger tracking-[1.5px] uppercase">Moderation</div>
        </div>
      </div>

      <div className="text-[10px] text-text-faint tracking-[1.5px] uppercase px-5 pb-2">Trust & Safety</div>

      {/* Navigation — red accents */}
      <nav className="flex-1 px-3.5 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-[11px] rounded-lg px-3 py-[9px] text-body-sm font-medium transition-fexora",
                isActive
                  ? "bg-danger/[0.12] text-danger"
                  : "text-text-muted hover:text-text hover:bg-elevated"
              )}
              style={{
                boxShadow: isActive ? "inset 0 0 0 0.5px rgba(196,90,74,0.3)" : "none",
              }}
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

      {/* Shift status */}
      <div className="px-3.5 pb-2">
        <div className="p-3 rounded-[10px] bg-card hairline mb-2">
          <div className="text-[10px] text-text-faint tracking-[1px] uppercase mb-2">Schicht-Status</div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-[12px] text-text">Online \u00B7 4h 12m</span>
          </div>
          <div className="text-[11px] text-text-muted">14 F\u00E4lle bearbeitet</div>
        </div>
      </div>

      {/* User chip */}
      <div className="px-3.5 py-3 border-t border-hair">
        <div className="flex items-center gap-2.5 p-2">
          <div className="w-[30px] h-[30px] rounded-full bg-elevated flex items-center justify-center text-[10px] text-text font-semibold">
            JK
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] text-text font-semibold">J. Krieger</div>
            <div className="text-[10px] text-text-muted">Moderator \u00B7 L2</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
