"use client";

import { useAuth } from "@/lib/auth";
import { Link } from "@/i18n/navigation";
import { AdminShell } from "./layout-shell";
import { AdminTopbar } from "@/components/layout/admin-topbar";
import { Kpi } from "@/components/ui/kpi";
import { Eye, User, Coins, Flag, Sparkles } from "lucide-react";

const queueItems = [
  { who: "Liora", kind: "Bild", age: "2 min" },
  { who: "Esm\u00E9", kind: "Clip \u00B7 02:14", age: "4 min" },
  { who: "Veda", kind: "Story \u00B7 Kap. 4", age: "7 min" },
  { who: "Mira", kind: "H\u00F6rspiel \u00B7 18min", age: "12 min" },
  { who: "Nara", kind: "Bundle \u00B7 8 St.", age: "24 min" },
];

const topCreators = [
  { name: "Liora", flames: "4.214 \uD83D\uDD25" },
  { name: "Esm\u00E9 V.", flames: "3.108 \uD83D\uDD25" },
  { name: "Mira", flames: "2.642 \uD83D\uDD25" },
  { name: "Sasha Vey", flames: "1.882 \uD83D\uDD25" },
];

const sysRows = [
  { label: "Approval-Median", value: "14 min", tone: "ok" as const },
  { label: "Speicher", value: "68%", tone: "ok" as const },
  { label: "Voice-Recht-Antr\u00E4ge", value: "6 offen", tone: "warn" as const },
  { label: "Banking-Webhook", value: "\u2191 live", tone: "ok" as const },
];

export default function AcpDashboard() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
        <div className="w-10 h-14 bg-gold rounded-sm" />
        <h1 className="font-serif text-h1 text-text">FEXORA Admin</h1>
        <p className="text-body text-text-muted">Bitte mit Admin-Konto anmelden</p>
      </main>
    );
  }

  return (
    <AdminShell>
      <AdminTopbar title="Dashboard" />
      <div className="flex-1 overflow-auto p-7">
        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Kpi label="Inhalte in Review" value="24" delta="+6" icon={Eye} critical />
          <Kpi label="Neue Creator (24h)" value="8" delta="+2" icon={User} />
          <Kpi label="Flames-Umsatz (heute)" value="\u20AC4.812" delta="+12.4%" icon={Coins} />
          <Kpi label="Reports offen" value="3" delta="-2" icon={Flag} negative />
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-[2fr_1fr] gap-4 mb-4">
          {/* Activity chart placeholder */}
          <div className="bg-card rounded-[14px] p-5 hairline">
            <div className="flex items-center mb-3.5">
              <span className="font-serif text-[16px] text-text font-semibold">Aktivit\u00E4t \u00B7 letzte 7 Tage</span>
              <div className="flex-1" />
              <button type="button" className="text-[12px] text-gold">Details \u2192</button>
            </div>
            <div className="h-[200px] rounded-lg bg-elevated/50 flex items-center justify-center text-text-faint text-body-sm">
              Chart-Platzhalter
            </div>
            <div className="flex gap-6 mt-3.5 text-[12px] text-text-muted">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-gold" /> Hochgeladen <strong className="text-text">312</strong></span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-gold/40" /> Approved <strong className="text-text">248</strong></span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-danger" /> Rejected <strong className="text-text">22</strong></span>
            </div>
          </div>

          {/* Live queue */}
          <div className="bg-card rounded-[14px] p-5 hairline">
            <div className="flex items-center mb-3.5">
              <span className="font-serif text-[16px] text-text font-semibold">Live Review-Queue</span>
              <div className="flex-1" />
              <Link href="/review" className="text-[12px] text-gold">Alle \u2192</Link>
            </div>
            {queueItems.map((q, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 py-3"
                style={{ borderBottom: i < queueItems.length - 1 ? "0.5px solid rgba(212,165,116,0.10)" : "none" }}
              >
                <div className="w-[30px] h-[30px] rounded-full bg-elevated flex items-center justify-center text-[10px] text-text font-semibold">
                  {q.who[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-body-sm text-text font-semibold">{q.who}</div>
                  <div className="text-[11px] text-text-muted">{q.kind}</div>
                </div>
                <span className="text-[11px] text-text-muted">{q.age}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Three columns */}
        <div className="grid grid-cols-3 gap-4">
          {/* Top creators */}
          <div className="bg-card rounded-[14px] p-5 hairline">
            <span className="font-serif text-[16px] text-text font-semibold block mb-3.5">Top Creator (7 Tage)</span>
            {topCreators.map((c, i) => (
              <div key={i} className="flex items-center gap-2.5 py-[9px]">
                <span className="font-serif text-[16px] text-gold italic w-5">{i + 1}</span>
                <div className="w-[26px] h-[26px] rounded-full bg-elevated flex items-center justify-center text-[9px] text-text">{c.name[0]}</div>
                <span className="flex-1 text-body-sm text-text">{c.name}</span>
                <span className="text-body-sm text-gold font-semibold">{c.flames}</span>
              </div>
            ))}
          </div>

          {/* Packs chart */}
          <div className="bg-card rounded-[14px] p-5 hairline">
            <span className="font-serif text-[16px] text-text font-semibold block mb-3.5">Flames-Pakete (heute)</span>
            {[
              { pack: "Pack 50", n: 42, max: 88 },
              { pack: "Pack 120", n: 88, max: 88 },
              { pack: "Pack 280", n: 36, max: 88 },
              { pack: "Pack 800", n: 12, max: 88 },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-2.5 py-[9px]">
                <span className="flex-1 text-body-sm text-text">{p.pack}</span>
                <div className="flex-[2] h-1.5 rounded-full bg-bg overflow-hidden">
                  <div className="h-full rounded-full bg-gold-grad" style={{ width: `${(p.n / p.max) * 100}%` }} />
                </div>
                <span className="text-[11px] text-text-muted w-7 text-right">{p.n}</span>
              </div>
            ))}
          </div>

          {/* System */}
          <div className="bg-card rounded-[14px] p-5 hairline">
            <span className="font-serif text-[16px] text-text font-semibold block mb-3.5">System</span>
            {sysRows.map((r, i) => (
              <div
                key={i}
                className="flex items-center py-[9px] text-body-sm"
                style={{ borderBottom: i < sysRows.length - 1 ? "0.5px solid rgba(212,165,116,0.10)" : "none" }}
              >
                <span className="flex-1 text-text-muted">{r.label}</span>
                <div
                  className="w-[7px] h-[7px] rounded-full mr-2"
                  style={{ background: r.tone === "ok" ? "var(--success)" : r.tone === "warn" ? "var(--warn)" : "var(--danger)" }}
                />
                <span className="text-text font-medium">{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
