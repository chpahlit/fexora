"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface ContentPerformance {
  contentId: string;
  title: string;
  type: string;
  views: number;
  unlocks: number;
  revenue: number;
  likes: number;
  comments: number;
  unlockRate: number;
  createdAt: string;
}

interface EngagementMetrics {
  avgLikesPerPost: number;
  avgCommentsPerPost: number;
  avgSharesPerPost: number;
  engagementRate: number;
  topEngagementDay: string;
  topEngagementHour: number;
}

interface RevenueBreakdown {
  unlocks: number;
  subscriptions: number;
  tips: number;
  ppv: number;
  customRequests: number;
  chat: number;
  total: number;
}

interface SubscriptionMetrics {
  mrr: number;
  totalSubscribers: number;
  newSubscribers: number;
  churnRate: number;
  avgSubscriptionDuration: number;
  tierBreakdown: { tier: string; count: number; revenue: number }[];
}

interface FunnelMetrics {
  profileVisits: number;
  follows: number;
  followToProfileRate: number;
  contentViews: number;
  unlocks: number;
  viewToUnlockRate: number;
  subscriptions: number;
  unlockToSubRate: number;
}

export default function CreatorAnalyticsPage() {
  return (
    <ProtectedRoute roles={["Creator", "Admin"]}>
      <AnalyticsContent />
    </ProtectedRoute>
  );
}

function AnalyticsContent() {
  const { client } = useAuth();
  const [period, setPeriod] = useState("30d");

  const { data: contentPerfData } = useQuery({
    queryKey: ["creator", "analytics", "content", period],
    queryFn: () => client.get<ContentPerformance[]>(`/creator/analytics/content?period=${period}`),
  });
  const contentPerf = contentPerfData?.success ? contentPerfData.data ?? [] : [];

  const { data: engagementData } = useQuery({
    queryKey: ["creator", "analytics", "engagement", period],
    queryFn: () => client.get<EngagementMetrics>(`/creator/analytics/engagement?period=${period}`),
  });
  const engagement = engagementData?.success ? engagementData.data : null;

  const { data: revenueData } = useQuery({
    queryKey: ["creator", "analytics", "revenue", period],
    queryFn: () => client.get<RevenueBreakdown>(`/creator/analytics/revenue?period=${period}`),
  });
  const revenue = revenueData?.success ? revenueData.data : null;

  const { data: subData } = useQuery({
    queryKey: ["creator", "analytics", "subscriptions", period],
    queryFn: () => client.get<SubscriptionMetrics>(`/creator/analytics/subscriptions?period=${period}`),
  });
  const subs = subData?.success ? subData.data : null;

  const { data: funnelData } = useQuery({
    queryKey: ["creator", "analytics", "funnel", period],
    queryFn: () => client.get<FunnelMetrics>(`/creator/analytics/funnel?period=${period}`),
  });
  const funnel = funnelData?.success ? funnelData.data : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <div className="flex gap-2">
          {["7d", "30d", "90d", "1y"].map((p) => (
            <Button key={p} variant={period === p ? "default" : "outline"} size="sm" onClick={() => setPeriod(p)}>
              {p}
            </Button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="revenue">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="funnel">Funnel</TabsTrigger>
        </TabsList>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4 mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="pt-4 pb-3 text-center">
                <p className="text-2xl font-bold">{revenue?.total?.toLocaleString() ?? 0}</p>
                <p className="text-xs text-muted-foreground">Total Revenue (Coins)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3 text-center">
                <p className="text-2xl font-bold">{revenue?.unlocks?.toLocaleString() ?? 0}</p>
                <p className="text-xs text-muted-foreground">From Unlocks</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3 text-center">
                <p className="text-2xl font-bold">{revenue?.subscriptions?.toLocaleString() ?? 0}</p>
                <p className="text-xs text-muted-foreground">From Subscriptions</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3 text-center">
                <p className="text-2xl font-bold">{revenue?.tips?.toLocaleString() ?? 0}</p>
                <p className="text-xs text-muted-foreground">From Tips</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3 text-center">
                <p className="text-2xl font-bold">{revenue?.ppv?.toLocaleString() ?? 0}</p>
                <p className="text-xs text-muted-foreground">From PPV</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3 text-center">
                <p className="text-2xl font-bold">{revenue?.customRequests?.toLocaleString() ?? 0}</p>
                <p className="text-xs text-muted-foreground">From Custom Requests</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Content Performance Tab */}
        <TabsContent value="content" className="space-y-4 mt-4">
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-medium">Content</th>
                  <th className="p-3 text-right font-medium">Views</th>
                  <th className="p-3 text-right font-medium">Unlocks</th>
                  <th className="p-3 text-right font-medium">Unlock Rate</th>
                  <th className="p-3 text-right font-medium">Revenue</th>
                  <th className="p-3 text-right font-medium">Likes</th>
                </tr>
              </thead>
              <tbody>
                {contentPerf.map((c) => (
                  <tr key={c.contentId} className="border-b last:border-0">
                    <td className="p-3">
                      <div>
                        <p className="font-medium truncate max-w-[200px]">{c.title}</p>
                        <p className="text-xs text-muted-foreground">{c.type} · {new Date(c.createdAt).toLocaleDateString()}</p>
                      </div>
                    </td>
                    <td className="p-3 text-right">{c.views.toLocaleString()}</td>
                    <td className="p-3 text-right">{c.unlocks}</td>
                    <td className="p-3 text-right">{c.unlockRate.toFixed(1)}%</td>
                    <td className="p-3 text-right font-medium">{c.revenue.toLocaleString()}</td>
                    <td className="p-3 text-right">{c.likes}</td>
                  </tr>
                ))}
                {contentPerf.length === 0 && (
                  <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No content data</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-4 mt-4">
          {engagement ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="pt-4 pb-3 text-center">
                  <p className="text-2xl font-bold">{engagement.engagementRate.toFixed(1)}%</p>
                  <p className="text-xs text-muted-foreground">Engagement Rate</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-3 text-center">
                  <p className="text-2xl font-bold">{engagement.avgLikesPerPost.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">Avg Likes/Post</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-3 text-center">
                  <p className="text-2xl font-bold">{engagement.avgCommentsPerPost.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">Avg Comments/Post</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-3 text-center">
                  <p className="text-2xl font-bold">{engagement.avgSharesPerPost.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">Avg Shares/Post</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-3 text-center">
                  <p className="text-2xl font-bold">{engagement.topEngagementDay}</p>
                  <p className="text-xs text-muted-foreground">Best Day</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-3 text-center">
                  <p className="text-2xl font-bold">{engagement.topEngagementHour}:00</p>
                  <p className="text-xs text-muted-foreground">Peak Hour</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">No engagement data available</p>
            </div>
          )}
        </TabsContent>

        {/* Subscriptions Tab */}
        <TabsContent value="subscriptions" className="space-y-4 mt-4">
          {subs ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardContent className="pt-4 pb-3 text-center">
                    <p className="text-2xl font-bold">{subs.mrr.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">MRR (Coins)</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 pb-3 text-center">
                    <p className="text-2xl font-bold">{subs.totalSubscribers}</p>
                    <p className="text-xs text-muted-foreground">Total Subscribers</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 pb-3 text-center">
                    <p className="text-2xl font-bold text-primary">+{subs.newSubscribers}</p>
                    <p className="text-xs text-muted-foreground">New Subscribers</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 pb-3 text-center">
                    <p className="text-2xl font-bold">{subs.churnRate.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">Churn Rate</p>
                  </CardContent>
                </Card>
              </div>
              {subs.tierBreakdown.length > 0 && (
                <Card>
                  <CardHeader><CardTitle className="text-lg">Tier Breakdown</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {subs.tierBreakdown.map((tier) => (
                        <div key={tier.tier} className="flex items-center justify-between">
                          <span className="font-medium">{tier.tier}</span>
                          <div className="flex items-center gap-4 text-sm">
                            <span>{tier.count} subs</span>
                            <span className="font-bold">{tier.revenue.toLocaleString()} coins</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">No subscription data available</p>
            </div>
          )}
        </TabsContent>

        {/* Funnel Tab */}
        <TabsContent value="funnel" className="space-y-4 mt-4">
          {funnel ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Conversion Funnel</CardTitle>
                <CardDescription>How visitors convert through your content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Profile Visits", value: funnel.profileVisits, rate: null },
                  { label: "Follows", value: funnel.follows, rate: funnel.followToProfileRate },
                  { label: "Content Views", value: funnel.contentViews, rate: null },
                  { label: "Unlocks", value: funnel.unlocks, rate: funnel.viewToUnlockRate },
                  { label: "Subscriptions", value: funnel.subscriptions, rate: funnel.unlockToSubRate },
                ].map((step, i) => (
                  <div key={step.label} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{step.label}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">{step.value.toLocaleString()}</span>
                          {step.rate !== null && (
                            <Badge variant="secondary">{step.rate.toFixed(1)}%</Badge>
                          )}
                        </div>
                      </div>
                      <div className="mt-1 h-2 bg-muted rounded-full">
                        <div
                          className="h-2 bg-primary rounded-full transition-all"
                          style={{ width: `${Math.min(100, (step.value / Math.max(1, funnel.profileVisits)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">No funnel data available</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
