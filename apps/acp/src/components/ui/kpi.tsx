import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface KpiProps {
  label: string;
  value: string;
  delta: string;
  icon: LucideIcon;
  critical?: boolean;
  negative?: boolean;
}

export function Kpi({ label, value, delta, icon: Icon, critical, negative }: KpiProps) {
  return (
    <div className={cn("bg-card rounded-[14px] p-[18px]", critical ? "hairline-strong" : "hairline")}>
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-lg bg-gold/[0.12] flex items-center justify-center">
          <Icon className="size-[15px] text-gold" />
        </div>
        <span className="text-[11px] text-text-muted tracking-[0.5px] uppercase">{label}</span>
      </div>
      <div className="flex items-baseline gap-2.5">
        <span className="font-serif text-[32px] text-text font-medium">{value}</span>
        <span className={cn("text-[12px] font-semibold", negative ? "text-success" : "text-gold")}>{delta}</span>
      </div>
    </div>
  );
}
