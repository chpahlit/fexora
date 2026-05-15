"use client";

import { Bell, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminTopbarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function AdminTopbar({ title, subtitle = "Heute \u00B7 Donnerstag, 15. Mai 2026", actions, className }: AdminTopbarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-10 flex h-[68px] items-center gap-4 border-b border-hair px-7 backdrop-blur-[12px] bg-[rgba(10,8,7,0.85)]",
        className
      )}
    >
      <div>
        <div className="font-serif text-[22px] text-text font-medium tracking-[-0.3px] leading-none">{title}</div>
        {subtitle && <div className="text-[10px] text-text-faint tracking-[1px] uppercase mt-1">{subtitle}</div>}
      </div>

      <div className="flex-1" />

      {/* Search */}
      <div className="flex items-center gap-2.5 px-3.5 rounded-[20px] bg-card hairline w-[320px] h-10">
        <Search className="size-3.5 text-text-muted" />
        <span className="flex-1 text-[12px] text-text-faint">Suche Inhalte, Nutzer, IDs\u2026</span>
        <kbd className="font-mono text-[10px] text-text-faint px-1.5 py-0.5 rounded bg-bg">\u2318K</kbd>
      </div>

      {actions}

      <button
        type="button"
        className="relative w-10 h-10 rounded-full bg-card flex items-center justify-center hairline"
      >
        <Bell className="size-4 text-gold" />
        <div className="absolute top-[9px] right-[9px] w-2 h-2 rounded-full bg-danger" />
      </button>
    </header>
  );
}
