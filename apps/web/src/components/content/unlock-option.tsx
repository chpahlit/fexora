"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface UnlockOptionProps {
  title: string;
  subtitle: string;
  price: number;
  selected?: boolean;
  saving?: string;
  recurring?: boolean;
  onSelect?: () => void;
}

export function UnlockOption({
  title,
  subtitle,
  price,
  selected = false,
  saving,
  recurring,
  onSelect,
}: UnlockOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl p-3.5 text-left cursor-pointer transition-fexora",
        selected
          ? "bg-gold/[0.06] hairline-strong"
          : "bg-card hairline hover:hairline-strong"
      )}
    >
      {/* Radio dot */}
      <div
        className="w-[18px] h-[18px] rounded-full shrink-0 flex items-center justify-center"
        style={{
          boxShadow: `inset 0 0 0 1.5px ${selected ? "var(--gold)" : "var(--text-faint)"}`,
        }}
      >
        {selected && (
          <div className="w-2 h-2 rounded-full bg-gold" />
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-body-sm text-text font-semibold">{title}</span>
          {saving && <Badge variant="success">{saving}</Badge>}
          {recurring && <Badge variant="dark">Abo</Badge>}
        </div>
        <div className="text-[11px] text-text-muted mt-0.5">{subtitle}</div>
      </div>

      {/* Price */}
      <span className="font-serif text-[20px] text-gold font-semibold shrink-0">
        {price} 🔥
      </span>
    </button>
  );
}
