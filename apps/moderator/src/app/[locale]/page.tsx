"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";

interface LiveKPIs {
  messagesSent: number;
  avgResponseTimeSeconds: number;
  dialogsPerHour: number;
  unlocksToday: number;
  revenueToday: number;
}

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
          id: u.id,
          email: u.email,
          role: u.role as "Admin" | "Moderator",
          isVerified18: true,
          isActive: true,
          createdAt: "",
          profile: u.profile ? { userId: u.id, username: u.profile.username ?? "", badges: [], offersCustom: false, updatedAt: "" } : undefined,
        });
      } else {
        setError("Access denied. Moderator or Admin role required.");
      }
    } else {
      setError(res.error ?? "Login failed");
    }
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl font-bold text-primary">FEXORA Moderator</h1>
          <p className="text-lg text-muted-foreground">Moderator & Agency App</p>
        </div>
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full">{t("login")}</Button>
        </form>
      </main>
    );
  }

  return (
    <AppShell>
      <DashboardContent />
    </AppShell>
  );
}

function DashboardContent() {
  const { client } = useAuth();

  const { data: kpisData } = useQuery({
    queryKey: ["moderator", "kpis", "live"],
    queryFn: () => client.get<LiveKPIs>("/mod/kpis/live"),
    refetchInterval: 30000,
  });

  const kpis = kpisData?.success ? kpisData.data : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of today's performance</p>
      </div>

      {/* Today's KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Messages</p>
                <p className="text-2xl font-bold">{kpis?.messagesSent ?? 0}</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Avg Response</p>
                <p className="text-2xl font-bold">
                  {kpis ? (kpis.avgResponseTimeSeconds < 60 ? `${Math.round(kpis.avgResponseTimeSeconds)}s` : `${Math.round(kpis.avgResponseTimeSeconds / 60)}m`) : "0s"}
                </p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Dialogs/h</p>
                <p className="text-2xl font-bold">{kpis?.dialogsPerHour ?? 0}</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Unlocks</p>
                <p className="text-2xl font-bold">{kpis?.unlocksToday ?? 0}</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">{(kpis?.revenueToday ?? 0).toLocaleString()}</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><circle cx="12" cy="12" r="8"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/></svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/board">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="text-base">Open Chat Board</CardTitle>
              <CardDescription>Start moderating conversations</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/snippets">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="text-base">Manage Snippets</CardTitle>
              <CardDescription>Quick responses and templates</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/reports">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="text-base">View Reports</CardTitle>
              <CardDescription>Performance and provisions</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
