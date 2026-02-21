"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
          profile: u.profile ? { userId: u.id, username: u.profile.username ?? "", badges: [], offersCustom: false } : undefined,
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
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">FEXORA Moderator</h1>
          <p className="text-muted-foreground">Welcome, {user?.profile?.username ?? user?.email}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/board">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle>Chat Board</CardTitle>
                <CardDescription>3-column moderation interface</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/agency">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle>Agency Dashboard</CardTitle>
                <CardDescription>Manage creators, moderators, KPIs</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/snippets">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle>Snippets</CardTitle>
                <CardDescription>Quick responses and templates</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/reports">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>Performance reports and provisions</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  );
}
