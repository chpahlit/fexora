"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const maxRevenue = Math.max(1, ...(revenue?.revenueByType ?? []).map((r) => r.amount));

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Reports Dashboard</h1>
            <p className="text-sm text-muted-foreground">Platform analytics and performance metrics</p>
          </div>
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                  CSV Export
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Unlocks</p>
                        <p className="text-2xl font-bold">{(revenue?.totalUnlocks ?? 0).toLocaleString()}</p>
                      </div>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Subscriptions</p>
                        <p className="text-2xl font-bold">{(revenue?.totalSubscriptions ?? 0).toLocaleString()}</p>
                      </div>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Tips</p>
                        <p className="text-2xl font-bold">{(revenue?.totalTips ?? 0).toLocaleString()}</p>
                      </div>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">MRR (Coins)</p>
                        <p className="text-2xl font-bold">{(revenue?.mrr ?? 0).toLocaleString()}</p>
                      </div>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                      </div>
                    </div>
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
                        <span className="text-sm font-medium w-28">{r.type}</span>
                        <div className="flex items-center gap-3 flex-1 ml-4">
                          <div className="flex-1 bg-muted rounded-full h-2.5">
                            <div
                              className="bg-primary rounded-full h-2.5 transition-all"
                              style={{ width: `${(r.amount / maxRevenue) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-mono w-20 text-right">
                            {r.amount.toLocaleString()}
                          </span>
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
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">DAU</p>
                        <p className="text-2xl font-bold">{(users?.dau ?? 0).toLocaleString()}</p>
                      </div>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">MAU</p>
                        <p className="text-2xl font-bold">{(users?.mau ?? 0).toLocaleString()}</p>
                      </div>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Daily Registrations</p>
                        <p className="text-2xl font-bold">{users?.dailyRegistrations ?? 0}</p>
                      </div>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Retention Rate</p>
                        <p className="text-2xl font-bold">{users?.retentionRate?.toFixed(1) ?? 0}%</p>
                      </div>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold">{users?.arppu?.toFixed(2) ?? 0}</p>
                    <p className="text-xs text-muted-foreground">ARPPU (coins)</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold">{(users?.totalUsers ?? 0).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Users</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold">{(users?.totalCreators ?? 0).toLocaleString()}</p>
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
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Unlock Rate</p>
                        <p className="text-2xl font-bold">{content?.unlockRate?.toFixed(1) ?? 0}%</p>
                      </div>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Daily Content</p>
                        <p className="text-2xl font-bold">{content?.dailyContentCreation ?? 0}</p>
                      </div>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><line x1="12" x2="12" y1="12" y2="18"/><line x1="9" x2="15" y1="15" y2="15"/></svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Total Content</p>
                        <p className="text-2xl font-bold">{(content?.totalContent ?? 0).toLocaleString()}</p>
                      </div>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
                      </div>
                    </div>
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
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                            {i + 1}
                          </span>
                          <div>
                            <p className="text-sm font-medium">{c.title}</p>
                            <p className="text-xs text-muted-foreground">by {c.creator}</p>
                          </div>
                        </div>
                        <span className="font-mono text-sm font-semibold">{c.revenue.toLocaleString()} coins</span>
                      </div>
                    ))}
                    {(content?.topContent ?? []).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No content data</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="moderators">
            <div className="space-y-4 mt-4">
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={() => handleExport("moderators")}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
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
                      <tr key={mod.moderatorId} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="p-3 font-medium">{mod.username}</td>
                        <td className="p-3 text-muted-foreground">{mod.agencyName ?? "—"}</td>
                        <td className="p-3 text-right">{mod.messages.toLocaleString()}</td>
                        <td className="p-3 text-right">{mod.dialogs}</td>
                        <td className="p-3 text-right">
                          {mod.avgResponseTime < 60
                            ? `${Math.round(mod.avgResponseTime)}s`
                            : `${Math.round(mod.avgResponseTime / 60)}m`}
                        </td>
                        <td className="p-3 text-right">{mod.unlocks}</td>
                        <td className="p-3 text-right font-mono">{mod.revenueAttributed.toLocaleString()}</td>
                        <td className="p-3 text-right font-bold text-primary">{mod.provisionEarned.toLocaleString()}</td>
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
    </AppShell>
  );
}
