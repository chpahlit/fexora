"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CreatorBadge } from "@/components/ui/creator-badge";
import { FlameMark } from "@/components/ui/flame-mark";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

const stories = [
  { name: "Liora", active: true },
  { name: "Esmé", active: true },
  { name: "Mira", active: true },
  { name: "Sasha", active: true },
  { name: "Adèle", active: false },
  { name: "Veda", active: false },
  { name: "Nara", active: false },
  { name: "Lara", active: false },
];

const trending = [
  { name: "Esmé Vauclair", gain: "+412 Verehrer" },
  { name: "Mira Aurum", gain: "+824 Verehrer" },
  { name: "Sasha Vey", gain: "+1.236 Verehrer" },
  { name: "Adèle", gain: "+1.648 Verehrer" },
];

export function FeedRightRail() {
  return (
    <aside className="hidden lg:block space-y-4">
      {/* Stories */}
      <div className="mb-8">
        <div className="eyebrow tracking-[2px] text-[11px] mb-3.5">Stories</div>
        <div className="grid grid-cols-4 gap-2.5">
          {stories.map((s) => (
            <div key={s.name} className="flex flex-col items-center gap-1">
              <Avatar story={s.active} className="h-[52px] w-[52px]">
                <AvatarFallback className="text-[14px]">{s.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-[10px] text-text-muted">{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Creators */}
      <div className="bg-card rounded-[14px] p-[18px] hairline mb-4">
        <div className="flex items-center mb-3.5">
          <span className="font-serif text-[15px] text-text font-semibold italic">Im Aufstieg</span>
          <div className="flex-1" />
          <Link href="/explore" className="text-[11px] text-gold">Alle →</Link>
        </div>
        {trending.map((c, i) => (
          <div
            key={c.name}
            className="flex items-center gap-2.5 py-2"
            style={{
              borderBottom:
                i < trending.length - 1
                  ? "0.5px solid rgba(212,165,116,0.10)"
                  : "none",
            }}
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback className="text-[11px]">{c.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-body-sm text-text font-medium truncate">{c.name}</span>
                <CreatorBadge kind="verified" size="sm" />
              </div>
              <div className="text-[11px] text-text-muted">{c.gain}</div>
            </div>
            <button
              type="button"
              className="h-7 px-3 rounded-[14px] bg-gold/[0.12] text-[11px] text-gold font-semibold hairline-strong transition-fexora hover:bg-gold/20"
            >
              + Folgen
            </button>
          </div>
        ))}
      </div>

      {/* Collection Promo */}
      <div
        className="rounded-[14px] p-5 hairline-strong"
        style={{
          background:
            "radial-gradient(80% 80% at 80% 0%, rgba(212,165,116,0.18), transparent 60%) #14110d",
        }}
      >
        <FlameMark size={22} />
        <div className="font-serif text-[18px] text-text font-medium italic mt-2.5">
          Deine Sammlung wächst.
        </div>
        <p className="text-[12px] text-text-muted mt-1.5 mb-3.5 leading-[1.5]">
          28 Werke gespeichert · 142 Flames Guthaben.
        </p>
        <Button variant="secondary" size="sm" className="w-full">
          Sammlung öffnen
        </Button>
      </div>
    </aside>
  );
}
