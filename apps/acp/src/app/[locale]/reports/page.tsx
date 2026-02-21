"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RevenueReport {
  totalUnlocks: number;
  totalSubscriptions: number;
  totalTips: number;
  totalPPV: number;
  totalCustom: number;
  mrr: number;
  platformFeeRevenue: number;
  revenueByType: { type: string; amount: number }[];
}

interface UserMetrics {
  dau: number;
  mau: number;
  dailyRegistrations: number;
  retentionRate: number;
  arppu: number;
  totalUsers: number;
  totalCreators: number;
}

interface ContentMetrics {
  unlockRate: number;
  dailyContentCreation: number;
  topContent: { id: string; title: string; revenue: number; creator: string }[];
  totalContent: number;
}

interface ModeratorPerformance {
  moderatorId: string;
  username: string;
  agencyName?: string;
  messages: number;
  dialogs: number;
  avgResponseTime: number;
  unlocks: number;
  revenueAttributed: number;
  provisionEarned: number;
}

export default function ReportsPage() {
  const { client } = useAuth();
  const [period, setPeriod] = useState("30d");

  const { data: revenueData } = useQuery({
    queryKey: ["admin", "reports", "revenue", period],
    queryFn: () => client.get<RevenueReport>(`/admin/reports/revenue?period=${period}`),
  });

  const { data: userMetrics } = useQuery({
    queryKey: ["admin", "reports", "users", period],
    queryFn: () => client.get<UserMetrics>(`/admin/reports/users?period=${period}`),
  });

  const { data: contentMetrics } = useQuery({
    queryKey: ["admin", "reports", "content", period],
    queryFn: () => client.get<ContentMetrics>(`/admin/reports/content?period=${period}`),
  });

  const { data: modPerfData } = useQuery({
    queryKey: ["admin", "reports", "moderators", period],
    queryFn: () => client.get<ModeratorPerformance[]>(`/admin/reports/moderators?period=${period}`),
  });
  const modPerformance = modPerfData?.success ? modPerfData.data ?? [] : [];

  const revenue = revenueData?.success ? revenueData.data : null;
  const users = userMetrics?.success ? userMetrics.data : null;
  const content = contentMetrics?.success ? contentMetrics.data : null;

  async function handleExport(type: string) {
    const res = await client.get<{ downloadUrl: string }>(`/admin/export/report-${type}?period=${period}`);
    if (res.success && res.data?.downloadUrl) {
      window.open(res.data.downloadUrl, "_blank");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reports Dashboard</h1>
        <div className="flex gap-2">
          {["7d", "30d", "90d", "1y"].map((p) => (
            <Button
              key={p}
              variant={period === p ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod(p)}
            >
              {p}
            </Button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="revenue">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="moderators">Moderators</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <div className="space-y-4 mt-4">
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => handleExport("revenue")}>
                CSV Export
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold">{revenue?.totalUnlocks ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Unlocks</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold">{revenue?.totalSubscriptions ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Subscriptions</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold">{revenue?.totalTips ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Tips</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold">{revenue?.mrr ?? 0}</p>
                  <p className="text-xs text-muted-foreground">MRR (Coins)</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenue by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(revenue?.revenueByType ?? []).map((r) => (
                    <div key={r.type} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{r.type}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-48 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary rounded-full h-2"
                            style={{ width: `${Math.min(100, (r.amount / Math.max(1, revenue?.totalUnlocks ?? 1)) * 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-mono w-20 text-right">{r.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="space-y-4 mt-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold">{users?.dau ?? 0}</p>
                  <p className="text-xs text-muted-foreground">DAU</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold">{users?.mau ?? 0}</p>
                  <p className="text-xs text-muted-foreground">MAU</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold">{users?.dailyRegistrations ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Daily Registrations</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold">{users?.retentionRate?.toFixed(1) ?? 0}%</p>
                  <p className="text-xs text-muted-foreground">Retention Rate</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-2xl font-bold">{users?.arppu?.toFixed(2) ?? 0}</p>
                  <p className="text-xs text-muted-foreground">ARPPU</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-2xl font-bold">{users?.totalUsers ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Total Users</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-2xl font-bold">{users?.totalCreators ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Total Creators</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="content">
          <div className="space-y-4 mt-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold">{content?.unlockRate?.toFixed(1) ?? 0}%</p>
                  <p className="text-xs text-muted-foreground">Unlock Rate</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold">{content?.dailyContentCreation ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Daily Content</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold">{content?.totalContent ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Total Content</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Content by Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(content?.topContent ?? []).map((c, i) => (
                    <div key={c.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-muted-foreground w-6">#{i + 1}</span>
                        <div>
                          <p className="text-sm font-medium">{c.title}</p>
                          <p className="text-xs text-muted-foreground">by {c.creator}</p>
                        </div>
                      </div>
                      <span className="font-mono text-sm">{c.revenue} coins</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="moderators">
          <div className="space-y-4 mt-4">
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => handleExport("moderators")}>
                CSV Export
              </Button>
            </div>
            <div className="rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left font-medium">Moderator</th>
                    <th className="p-3 text-left font-medium">Agency</th>
                    <th className="p-3 text-right font-medium">Messages</th>
                    <th className="p-3 text-right font-medium">Dialogs</th>
                    <th className="p-3 text-right font-medium">Avg Response</th>
                    <th className="p-3 text-right font-medium">Unlocks</th>
                    <th className="p-3 text-right font-medium">Revenue</th>
                    <th className="p-3 text-right font-medium">Provision</th>
                  </tr>
                </thead>
                <tbody>
                  {modPerformance.map((mod) => (
                    <tr key={mod.moderatorId} className="border-b last:border-0">
                      <td className="p-3 font-medium">{mod.username}</td>
                      <td className="p-3 text-muted-foreground">{mod.agencyName ?? "—"}</td>
                      <td className="p-3 text-right">{mod.messages}</td>
                      <td className="p-3 text-right">{mod.dialogs}</td>
                      <td className="p-3 text-right">
                        {mod.avgResponseTime < 60
                          ? `${Math.round(mod.avgResponseTime)}s`
                          : `${Math.round(mod.avgResponseTime / 60)}m`}
                      </td>
                      <td className="p-3 text-right">{mod.unlocks}</td>
                      <td className="p-3 text-right">{mod.revenueAttributed.toLocaleString()}</td>
                      <td className="p-3 text-right font-bold">{mod.provisionEarned.toLocaleString()}</td>
                    </tr>
                  ))}
                  {modPerformance.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-muted-foreground">No moderator data</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
