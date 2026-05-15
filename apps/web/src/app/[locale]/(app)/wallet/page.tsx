"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useWalletBalance, useTransactions, useTopup } from "@fexora/api-client";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FlameMark } from "@/components/ui/flame-mark";
import { cn } from "@/lib/utils";
import { Plus, Send, Download, Unlock, Sparkles } from "lucide-react";

const FLAME_PACKS = [
  { flames: 50, price: "4,99", bonus: "", tag: "" },
  { flames: 120, price: "9,99", bonus: "+10 Bonus", tag: "Start" },
  { flames: 280, price: "19,99", bonus: "+30 Bonus", tag: "Beliebt", best: true },
  { flames: 800, price: "49,99", bonus: "+120 Bonus", tag: "" },
];

const mockTransactions = [
  { icon: Unlock, title: "Freigeschaltet \u00B7 Liora \u2014 Eine Kerze brennt", sub: "Bilderserie \u00B7 Akt I", amount: -24, when: "Heute 21:02" },
  { icon: Plus, title: "Aufladung 120 Flames", sub: "Apple Pay", amount: 120, when: "Heute 20:34" },
  { icon: Send, title: "Trinkgeld \u00B7 Esm\u00E9 Vauclair", sub: "Voice Reply", amount: -10, when: "Gestern" },
  { icon: Unlock, title: "Freigeschaltet \u00B7 Mira \u2014 Das letzte Atelier", sub: "H\u00F6rspiel \u00B7 24:12", amount: -18, when: "8. Mai" },
  { icon: Sparkles, title: "Bonus \u00B7 Erste Aufladung", sub: "Willkommen bei Fexora", amount: 10, when: "8. Mai" },
  { icon: Unlock, title: "Freigeschaltet \u00B7 Akt I \u2014 Bundle", sub: "3 Serien \u00B7 Liora", amount: -68, when: "5. Mai" },
];

function WalletContent() {
  const t = useTranslations();
  const { data: balanceData } = useWalletBalance();
  const { data: txData } = useTransactions({ page: 1, pageSize: 20 });
  const topup = useTopup();
  const [selectedPack, setSelectedPack] = useState<number | null>(null);

  const balance = balanceData?.success ? balanceData.data?.balance ?? 142 : 142;

  function handleTopup(amount: number) {
    topup.mutate(
      { amount },
      {
        onSuccess: (res) => {
          if (res.success && res.data?.sessionUrl) {
            window.location.href = res.data.sessionUrl;
          }
        },
      }
    );
  }

  return (
    <div className="max-w-[1080px] mx-auto">
      {/* ═══ Balance + Stats Row ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 mb-8">
        {/* Big balance card */}
        <div
          className="relative rounded-[18px] p-8 overflow-hidden hairline-strong"
          style={{
            background: "radial-gradient(80% 100% at 100% 0%, rgba(212,165,116,0.25), transparent 60%), #14110d",
          }}
        >
          <div className="absolute -top-[60px] -right-[40px] opacity-[0.12]">
            <FlameMark size={240} />
          </div>
          <span className="eyebrow tracking-[2px] text-[11px] mb-2.5 block">Dein Guthaben</span>
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-[88px] text-text font-normal leading-[0.9] tracking-[-2px]">
              {balance}
            </span>
            <div className="pb-3">
              <div className="font-serif text-[22px] text-gold italic">Flames \uD83D\uDD25</div>
              <div className="text-[12px] text-text-muted mt-0.5">
                \u2248 \u20AC{(balance * 0.083).toFixed(2).replace(".", ",")}
              </div>
            </div>
          </div>
          <p className="text-[12px] text-text-muted mt-2.5">
            Letzte Aufladung 8. Mai \u00B7 N\u00E4chste Stufe \u201ESammler\u201C bei 200 \uD83D\uDD25
          </p>
          <div className="flex gap-2.5 mt-7">
            <Button variant="primary" size="lg">
              <Plus className="size-4" /> Aufladen
            </Button>
            <Button variant="secondary" size="lg">
              <Send className="size-4" /> Senden
            </Button>
            <Button variant="ghost" size="lg">
              <Download className="size-4" /> Auszahlung
            </Button>
          </div>
        </div>

        {/* Stats sidebar */}
        <div className="flex flex-col gap-3.5">
          <div className="flex-1 p-[22px] rounded-[14px] bg-card hairline">
            <span className="eyebrow text-text-muted text-[11px] tracking-[1.5px] mb-2.5 block">Diesen Monat</span>
            <div className="font-serif text-[30px] text-text font-medium">418 \uD83D\uDD25</div>
            <div className="text-[12px] text-success mt-1">+ 12% gg\u00FC. Vormonat</div>
          </div>
          <div className="flex-1 p-[22px] rounded-[14px] bg-card hairline">
            <span className="eyebrow text-text-muted text-[11px] tracking-[1.5px] mb-2.5 block">Top Creator (Du)</span>
            <div className="flex items-center gap-2.5">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-[10px]">L</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-body text-text font-semibold">Liora \u00B7 86 \uD83D\uDD25</div>
                <div className="text-[11px] text-text-muted">5 Werke freigeschaltet</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Flame Packs ═══ */}
      <div className="mb-10">
        <div className="flex items-baseline mb-[18px]">
          <h3 className="font-serif text-h3 text-text font-medium italic">Flames aufladen</h3>
          <div className="flex-1" />
          <span className="text-[12px] text-text-muted">
            Zahlung mit Apple Pay, Karte oder SEPA. Best\u00E4tigt indirekt dein Alter.
          </span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {FLAME_PACKS.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedPack(i)}
              className={cn(
                "relative rounded-[14px] p-6 text-left transition-fexora",
                p.best ? "bg-gold/[0.08] hairline-strong" : "bg-card hairline hover:hairline-strong"
              )}
            >
              {p.tag && (
                <Badge variant="gold" className="absolute -top-2.5 left-6">
                  {p.tag}
                </Badge>
              )}
              <div className="flex items-center gap-3 mb-3.5">
                <div className="w-11 h-11 rounded-full bg-gold-grad flex items-center justify-center text-[22px]">
                  \uD83D\uDD25
                </div>
                <div>
                  <div className="font-serif text-h2 text-text font-medium leading-none">{p.flames}</div>
                  <div className="eyebrow text-[11px] tracking-[1.5px] mt-0.5">Flames</div>
                </div>
              </div>
              {p.bonus && (
                <div className="text-[11px] text-success font-semibold mb-3">{p.bonus}</div>
              )}
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-[20px] text-gold font-medium italic">\u20AC{p.price}</span>
                <Button
                  variant={p.best ? "primary" : "secondary"}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTopup(p.flames);
                  }}
                  disabled={topup.isPending}
                >
                  W\u00E4hlen
                </Button>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ═══ Transactions ═══ */}
      <div>
        <div className="flex items-baseline mb-3.5">
          <h3 className="font-serif text-h3 text-text font-medium italic">Letzte Bewegungen</h3>
          <div className="flex-1" />
          <button type="button" className="text-[12px] text-gold">Alle anzeigen \u2192</button>
        </div>
        <div className="bg-card rounded-[14px] p-2 hairline">
          {mockTransactions.map((tx, i) => (
            <div
              key={i}
              className="flex items-center gap-3.5 px-3.5 py-3.5"
              style={{
                borderBottom: i < mockTransactions.length - 1 ? "0.5px solid rgba(212,165,116,0.10)" : "none",
              }}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-[10px] flex items-center justify-center",
                  tx.amount > 0 ? "bg-success/[0.12]" : "bg-gold/10"
                )}
              >
                <tx.icon className={cn("size-4", tx.amount > 0 ? "text-success" : "text-gold")} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-body text-text font-medium truncate">{tx.title}</div>
                <div className="text-[11px] text-text-muted mt-0.5">{tx.sub}</div>
              </div>
              <div className="text-[12px] text-text-muted shrink-0">{tx.when}</div>
              <div
                className={cn(
                  "font-serif text-[18px] font-semibold w-20 text-right shrink-0",
                  tx.amount > 0 ? "text-success" : "text-text"
                )}
              >
                {tx.amount > 0 ? "+" : ""}{tx.amount} \uD83D\uDD25
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function WalletPage() {
  return (
    <ProtectedRoute>
      <WalletContent />
    </ProtectedRoute>
  );
}
