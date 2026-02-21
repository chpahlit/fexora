"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AcpDashboard() {
  const t = useTranslations("common");
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl font-bold text-primary">FEXORA ACP</h1>
          <p className="text-lg text-muted-foreground">Admin Control Panel</p>
          <p className="text-sm text-muted-foreground">
            Please sign in with an admin account
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">FEXORA ACP</h1>
          <p className="text-muted-foreground">
            Welcome, {user?.profile?.username ?? user?.email}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/review">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle>Content Review</CardTitle>
                <CardDescription>Review and approve/reject submitted content</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/users">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>Manage users, creators, and roles</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/pricing">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle>Pricing & Policy</CardTitle>
                <CardDescription>Platform settings, word filters, limits</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/payments">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle>Payments & Payouts</CardTitle>
                <CardDescription>Revenue, payout queue, disputes</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/risk">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle>Risk & Trust</CardTitle>
                <CardDescription>User reports, audit logs, moderation</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/reports">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle>Reports Dashboard</CardTitle>
                <CardDescription>Revenue, user, and content analytics</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/agencies">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle>Agencies</CardTitle>
                <CardDescription>Manage agencies and creator assignments</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/provisions">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle>Provisions</CardTitle>
                <CardDescription>Moderator provision rates and payouts</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/watermark">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle>Watermark</CardTitle>
                <CardDescription>Content protection and leak detection</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  );
}
