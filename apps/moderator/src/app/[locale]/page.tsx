"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth";
import { ModSidebar } from "@/components/layout/mod-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Flag, Play, Shield } from "lucide-react";

const mockReports = [
  { id: "R-1082", kind: "chat", target: "@sasha_vey", reason: "Bel\u00E4stigung in Chat", reporter: "anonym_2406", age: "4 min", sev: "high" as const, context: "Voice 0:42 \u00B7 Text-Druckmuster" },
  { id: "R-1081", kind: "content", target: "Veda \u00B7 Story IV", reason: "FSK-Einstufung zweifelhaft", reporter: "collect_42", age: "12 min", sev: "mid" as const },
  { id: "R-1080", kind: "profile", target: "@lior_imitator", reason: "Verdacht: Account-Imitation", reporter: "mira_collects", age: "38 min", sev: "high" as const },
  { id: "R-1079", kind: "chat", target: "@spam_bot_xyz", reason: "Spam \u00B7 externe Links", reporter: "system", age: "52 min", sev: "mid" as const },
  { id: "R-1078", kind: "content", target: "Esm\u00E9 \u00B7 Clip 02:14", reason: "Urheberrecht (DMCA)", reporter: "extern", age: "1 Std", sev: "high" as const },
  { id: "R-1077", kind: "voice", target: "Ad\u00E8le \u00B7 Voice 0:34", reason: "KI-generierte Stimme?", reporter: "system", age: "2 Std", sev: "low" as const },
  { id: "R-1076", kind: "chat", target: "@anon_user_88", reason: "Aufdringliche Anfragen", reporter: "liora.noir", age: "3 Std", sev: "mid" as const },
];

const filterTabs = [
  { label: "Alle", count: 24, active: true },
  { label: "Chat", count: 12 },
  { label: "Inhalt", count: 8 },
  { label: "Profil", count: 3 },
  { label: "Voice", count: 1 },
];

const sevColors = {
  high: { label: "Hoch", color: "var(--danger)" },
  mid: { label: "Mittel", color: "var(--warn)" },
  low: { label: "Niedrig", color: "var(--text-muted)" },
};

export default function ModeratorDashboard() {
  const t = useTranslations("common");
  const { isAuthenticated, user, login, client } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await client.post<{
      accessToken: string;
      refreshToken: string;
      user: { id: string; email: string; role: string; profile?: { username?: string } };
    }>("/auth/login", { email, password });
    if (res.success && res.data) {
      const u = res.data.user;
      if (u.role === "Admin" || u.role === "Moderator") {
        login(res.data.accessToken, res.data.refreshToken, {
          id: u.id, email: u.email, role: u.role as "Admin" | "Moderator",
          isVerified18: true, isActive: true, createdAt: "",
          profile: u.profile ? { userId: u.id, username: u.profile.username ?? "", badges: [], offersCustom: false, updatedAt: "" } : undefined,
        });
      } else {
        setError("Zugriff verweigert. Moderator- oder Admin-Rolle erforderlich.");
      }
    } else {
      setError(res.error ?? "Login fehlgeschlagen");
    }
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
        <div className="w-7 h-7 rounded-lg bg-danger/15 flex items-center justify-center">
          <Shield className="size-4 text-danger" />
        </div>
        <h1 className="font-serif text-h1 text-text">FEXORA Moderation</h1>
        <p className="text-body text-text-muted">Trust & Safety \u2014 Bitte anmelden</p>
        <form onSubmit={handleLogin} className="w-full max-w-sm flex flex-col gap-3">
          <Input type="email" placeholder="E-Mail" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Passwort" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-body-sm text-danger">{error}</p>}
          <Button type="submit" className="w-full">{t("login")}</Button>
        </form>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen">
      <ModSidebar />
      <div className="flex flex-1 flex-col ml-60">
        {/* Topbar */}
        <header className="sticky top-0 z-10 flex h-[68px] items-center gap-4 border-b border-hair px-7 backdrop-blur-[12px] bg-[rgba(10,8,7,0.85)]">
          <div>
            <div className="font-serif text-[22px] text-text font-medium tracking-[-0.3px] leading-none">Offene Reports \u00B7 24</div>
            <div className="text-[10px] text-text-faint tracking-[1px] uppercase mt-1">Schicht-Tag \u00B7 Donnerstag 15. Mai 2026</div>
          </div>
          <div className="flex-1" />
          <Button variant="destructive" size="default">
            <Play className="size-3.5" /> N\u00E4chster Fall
          </Button>
        </header>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 px-7 py-4 border-b border-hair">
          {filterTabs.map((tab) => (
            <button
              key={tab.label}
              type="button"
              className={cn(
                "px-3.5 py-[7px] rounded-lg text-[12px] font-semibold flex items-center gap-1.5 transition-fexora",
                tab.active
                  ? "bg-danger/15 text-danger"
                  : "bg-card text-text-muted hairline"
              )}
              style={{ boxShadow: tab.active ? "inset 0 0 0 0.5px rgba(196,90,74,0.3)" : undefined }}
            >
              {tab.label} <span>{tab.count}</span>
            </button>
          ))}
          <div className="flex-1" />
          <span className="text-[11px] text-text-muted">SLA \u00B7 innerhalb 2h</span>
        </div>

        {/* Report table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse font-sans">
            <thead className="bg-[#0d0a08] sticky top-0">
              <tr className="border-b border-hair">
                {["ID", "Typ", "Ziel", "Grund", "Melder", "Schwere", "Eingegangen", ""].map((h) => (
                  <th key={h} className="px-4 py-3.5 text-left text-[10px] tracking-[1px] uppercase text-text-faint font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockReports.map((r) => {
                const sev = sevColors[r.sev];
                return (
                  <tr key={r.id} className="border-b border-hair hover:bg-elevated/30 transition-fexora">
                    <td className="px-4 py-3.5 font-mono text-mono text-text-muted">{r.id}</td>
                    <td className="px-4 py-3.5">
                      <Badge variant="dark">{r.kind}</Badge>
                    </td>
                    <td className="px-4 py-3.5 text-body-sm text-text font-medium">{r.target}</td>
                    <td className="px-4 py-3.5">
                      <div className="text-body-sm text-text">{r.reason}</div>
                      {r.context && <div className="text-[10px] text-warn mt-1">\u26A0 {r.context}</div>}
                    </td>
                    <td className="px-4 py-3.5 text-[12px] text-text-muted">{r.reporter}</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.3px]" style={{ color: sev.color }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: sev.color }} />
                        {sev.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-[12px] text-text-muted">{r.age}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-1.5">
                        <button type="button" className="h-[30px] px-3 rounded-md bg-success/15 text-success text-[11px] font-semibold" style={{ boxShadow: "inset 0 0 0 0.5px rgba(107,154,110,0.3)" }}>
                          L\u00F6sen
                        </button>
                        <button type="button" className="h-[30px] px-3 rounded-md bg-danger/[0.12] text-danger text-[11px] font-semibold" style={{ boxShadow: "inset 0 0 0 0.5px rgba(196,90,74,0.3)" }}>
                          Eskalieren
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
