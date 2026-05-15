"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PlatformKPIs {
  totalUsers: number;
  totalCreators: number;
  totalContent: number;
  pendingReviews: number;
  pendingPayouts: number;
  openReports: number;
  revenueToday: number;
  activeScenarios: number;
}

export default function AcpDashboard() {
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
      user: {
        id: string;
        email: string;
        role: string;
        profile?: { username?: string };
      };
    }>("/auth/login", { email, password });
    if (res.success && res.data) {
      const u = res.data.user;
      if (u.role === "Admin") {
        login(res.data.accessToken, res.data.refreshToken, {
          id: u.id,
          email: u.email,
          role: u.role as "Admin",
          isVerified18: true,
          isActive: true,
          createdAt: "",
          profile: u.profile
            ? {
                userId: u.id,
                username: u.profile.username ?? "",
                badges: [],
                offersCustom: false,
                updatedAt: "",
              }
            : undefined,
        });
      } else {
        setError("Access denied. Admin role required.");
      }
    } else {
      setError(res.error ?? "Login failed");
    }
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl font-bold text-primary">FEXORA ACP</h1>
          <p className="text-lg text-muted-foreground">Admin Control Panel</p>
        </div>
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full">
            {t("login")}
          </Button>
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
  const { client, user } = useAuth();

  const { data: kpisData } = useQuery({
    queryKey: ["admin", "dashboard", "kpis"],
    queryFn: () => client.get<PlatformKPIs>("/admin/dashboard/kpis"),
    refetchInterval: 30000,
  });

  const kpis = kpisData?.success ? kpisData.data : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Welcome, {user?.profile?.username ?? user?.email}
        </h1>
        <p className="text-sm text-muted-foreground">
          Platform overview and quick actions
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">
                  {(kpis?.totalUsers ?? 0).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {kpis?.totalCreators ?? 0} creators
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Content</p>
                <p className="text-2xl font-bold">
                  {(kpis?.totalContent ?? 0).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {kpis?.pendingReviews ?? 0} pending review
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Revenue Today</p>
                <p className="text-2xl font-bold">
                  {(kpis?.revenueToday ?? 0).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">coins</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Active Scenarios</p>
                <p className="text-2xl font-bold">
                  {kpis?.activeScenarios ?? 0}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  automation
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M12 2v2"/><path d="M12 22v-2"/></svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Required */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/review">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-500/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m9 15 2 2 4-4"/></svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Content Review</p>
                    <p className="text-xs text-muted-foreground">
                      Pending items need attention
                    </p>
                  </div>
                </div>
                {(kpis?.pendingReviews ?? 0) > 0 && (
                  <Badge variant="warning">{kpis?.pendingReviews}</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/payments">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Pending Payouts</p>
                    <p className="text-xs text-muted-foreground">
                      Awaiting approval
                    </p>
                  </div>
                </div>
                {(kpis?.pendingPayouts ?? 0) > 0 && (
                  <Badge variant="warning">{kpis?.pendingPayouts}</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/risk">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Open Reports</p>
                    <p className="text-xs text-muted-foreground">
                      Require moderation action
                    </p>
                  </div>
                </div>
                {(kpis?.openReports ?? 0) > 0 && (
                  <Badge variant="destructive">{kpis?.openReports}</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Quick Navigation */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">
          Quick Navigation
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              href: "/users",
              title: "Users",
              desc: "Manage accounts & roles",
            },
            {
              href: "/reports",
              title: "Reports",
              desc: "Revenue & analytics",
            },
            {
              href: "/orchestrator",
              title: "Orchestrator",
              desc: "Automation dashboard",
            },
            {
              href: "/settings",
              title: "Settings",
              desc: "Platform configuration",
            },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm">{item.title}</CardTitle>
                  <CardDescription className="text-xs">
                    {item.desc}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
