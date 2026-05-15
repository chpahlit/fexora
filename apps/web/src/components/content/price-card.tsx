"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Unlock } from "lucide-react";

interface PriceCardProps {
  price: number;
  euroEstimate?: string;
  balance?: number;
  onUnlock?: () => void;
}

export function PriceCard({
  price,
  euroEstimate = `€${(price / 100 * 8.33).toFixed(2).replace(".", ",")}`,
  balance = 142,
  onUnlock,
}: PriceCardProps) {
  return (
    <div
      className="rounded-[18px] p-[26px] hairline-strong"
      style={{
        background:
          "radial-gradient(80% 80% at 100% 0%, rgba(212,165,116,0.18), transparent 60%) #14110d",
      }}
    >
      <div className="flex items-end gap-3 mb-1.5">
        <span className="font-serif text-[72px] text-gold font-normal leading-[0.9] tracking-[-2px]">
          {price}
        </span>
        <div className="pb-2">
          <div className="eyebrow text-[12px] tracking-[2px]">Flames 🔥</div>
          <div className="text-[11px] text-text-muted mt-0.5">≈ {euroEstimate}</div>
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        className="w-full mt-4"
        onClick={onUnlock}
      >
        <Unlock className="size-4" />
        Jetzt freischalten
      </Button>

      <div className="text-[11px] text-text-muted text-center mt-3">
        Guthaben{" "}
        <span className="text-gold font-semibold">{balance} 🔥</span>
        {" · einmalig · dauerhaft in Sammlung"}
      </div>
    </div>
  );
}
