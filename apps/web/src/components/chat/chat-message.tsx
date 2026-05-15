"use client";

import { cn } from "@/lib/utils";
import { FImage } from "@/components/ui/f-image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Unlock } from "lucide-react";

/* ─── Text Message ─── */
export function ChatMsg({ side, text }: { side: "me" | "them"; text: string }) {
  const me = side === "me";
  return (
    <div className={cn("flex mb-2", me ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[70%] px-4 py-2.5 text-body leading-[1.45]",
          me
            ? "bg-gold-grad text-bg rounded-[18px] rounded-br-[6px]"
            : "bg-card text-text hairline rounded-[18px] rounded-bl-[6px]"
        )}
      >
        {text}
      </div>
    </div>
  );
}

/* ─── Voice Message ─── */
export function ChatVoiceMsg({
  side,
  duration,
  played = false,
}: {
  side: "me" | "them";
  duration: string;
  played?: boolean;
}) {
  const me = side === "me";
  // Static waveform bars (in production: real audio peaks)
  const bars = [4,8,12,18,14,8,10,16,22,14,8,12,10,16,20,12,8,14,18,10,6,12,16,10,8,4,8,12,14,10,6,4];
  const playedBars = played ? bars.length : Math.floor(bars.length * 0.4);

  return (
    <div className={cn("flex mb-2", me ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 min-w-[280px]",
          me
            ? "bg-gold-grad rounded-[18px] rounded-br-[6px]"
            : "bg-card hairline rounded-[18px] rounded-bl-[6px]"
        )}
      >
        {/* Play button */}
        <button
          type="button"
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
            me ? "bg-[rgba(26,15,6,0.2)]" : "bg-gold/20"
          )}
        >
          <Play
            className={cn("size-3", me ? "text-bg" : "text-gold")}
            fill="currentColor"
          />
        </button>

        {/* Waveform */}
        <div className="flex-1 flex items-center gap-[2px]">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-[1px]"
              style={{
                height: h,
                background:
                  me
                    ? i < playedBars ? "#1a0f06" : "rgba(26,15,6,0.3)"
                    : i < playedBars ? "var(--gold)" : "var(--text-faint)",
              }}
            />
          ))}
        </div>

        {/* Duration */}
        <span
          className={cn(
            "font-mono text-mono opacity-80",
            me ? "text-bg" : "text-text-muted"
          )}
        >
          {duration}
        </span>
      </div>
    </div>
  );
}

/* ─── Paywall Card (shared content) ─── */
export function ChatPaywallCard({
  title = "Akt I \u00B7 Eine Kerze brennt",
  subtitle = "3 Bilder \u00B7 1 Voice \u00B7 privat geteilt",
  price = 24,
  seed = 0,
}: {
  title?: string;
  subtitle?: string;
  price?: number;
  seed?: number;
}) {
  return (
    <div className="flex justify-start mb-3">
      <div className="w-[360px] p-1 rounded-[18px] rounded-bl-[6px] bg-card hairline-strong overflow-hidden">
        <div className="rounded-[14px] overflow-hidden">
          <div className="h-[180px]">
            <FImage seed={seed} locked="blur" />
          </div>
        </div>
        <div className="p-3.5 pt-3">
          <div className="font-serif text-[18px] text-text font-medium italic">
            {title}
          </div>
          <p className="text-[12px] text-text-muted mt-1 mb-3">{subtitle}</p>
          <Button variant="primary" size="default" className="w-full">
            <Unlock className="size-3.5" />
            Freischalten · {price} 🔥
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─── Day Divider ─── */
export function DayDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3.5 my-5">
      <div className="flex-1 h-px bg-hair" />
      <span className="eyebrow text-text-muted">{label}</span>
      <div className="flex-1 h-px bg-hair" />
    </div>
  );
}
