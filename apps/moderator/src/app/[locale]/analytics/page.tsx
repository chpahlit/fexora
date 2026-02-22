"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select } from "@/components/ui/select";
import { AppShell } from "@/components/app-shell";

interface PerformanceMetrics {
  period: string;
  messagesSent: number;
  avgResponseTimeSec: number;
  dialogsHandled: number;
  unlocksGenerated: number;
  revenueCoins: number;
  conversionRate: number;
}

interface TrendPoint {
  date: string;
  value: number;
}

interface AnalyticsData {
  overview: {
    totalMessages: number;
    totalUnlocks: number;
    totalRevenueCoins: number;
    avgResponseTimeSec: number;
    avgConversionRate: number;
    activeCreators: number;
  };
  daily: PerformanceMetrics[];
  trends: {
    messages: TrendPoint[];
    revenue: TrendPoint[];
    responseTime: TrendPoint[];
  };
}

function MetricCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}

function MiniChart({ points, color }: { points: TrendPoint[]; color: string }) {
  if (points.length === 0) return null;

  const values = points.map((p) => p.value);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  const width = 200;
  const height = 48;
  const pathPoints = values
    .map((v, i) => {
      const x = (i / Math.max(values.length - 1, 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-12">
      <polyline
        points={pathPoints}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AnalyticsPage() {
  const { client, isAuthenticated } = useAuth();
  const [period, setPeriod] = useState("7d");

  const { data, isLoading } = useQuery({
    queryKey: ["mod", "analytics", period],
    queryFn: () =>
      client.get<AnalyticsData>(`/mod/analytics?period=${period}`),
    enabled: isAuthenticated,
  });

  const analytics = data?.success ? data.data : null;

  function formatDuration(sec: number) {
    if (sec < 60) return `${Math.round(sec)}s`;
    return `${Math.round(sec / 60)}m`;
  }

  return (
    <AppShell>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <Select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="w-40"
        >
          <option value="7d">Letzte 7 Tage</option>
          <option value="30d">Letzte 30 Tage</option>
          <option value="90d">Letzte 90 Tage</option>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : analytics ? (
        <>
          {/* KPI Overview */}
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            <MetricCard
              title="Nachrichten"
              value={analytics.overview.totalMessages.toLocaleString("de-DE")}
            />
            <MetricCard
              title="Unlocks"
              value={analytics.overview.totalUnlocks.toLocaleString("de-DE")}
            />
            <MetricCard
              title="Umsatz (Coins)"
              value={analytics.overview.totalRevenueCoins.toLocaleString("de-DE")}
            />
            <MetricCard
              title="Ø Antwortzeit"
              value={formatDuration(analytics.overview.avgResponseTimeSec)}
            />
            <MetricCard
              title="Conversion"
              value={`${(analytics.overview.avgConversionRate * 100).toFixed(1)}%`}
            />
            <MetricCard
              title="Aktive Creator"
              value={analytics.overview.activeCreators}
            />
          </div>

          {/* Trend Charts */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Nachrichten-Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <MiniChart
                  points={analytics.trends.messages}
                  color="hsl(var(--primary))"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Umsatz-Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <MiniChart
                  points={analytics.trends.revenue}
                  color="hsl(142, 76%, 36%)"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Antwortzeit-Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <MiniChart
                  points={analytics.trends.responseTime}
                  color="hsl(38, 92%, 50%)"
                />
              </CardContent>
            </Card>
          </div>

          {/* Daily Breakdown */}
          <Tabs defaultValue="table">
            <TabsList>
              <TabsTrigger value="table">Tagesübersicht</TabsTrigger>
            </TabsList>
            <TabsContent value="table">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="px-4 py-3 text-left font-medium">Datum</th>
                          <th className="px-4 py-3 text-right font-medium">Nachrichten</th>
                          <th className="px-4 py-3 text-right font-medium">Dialoge</th>
                          <th className="px-4 py-3 text-right font-medium">Ø Antwort</th>
                          <th className="px-4 py-3 text-right font-medium">Unlocks</th>
                          <th className="px-4 py-3 text-right font-medium">Umsatz</th>
                          <th className="px-4 py-3 text-right font-medium">Conversion</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.daily.map((day) => (
                          <tr
                            key={day.period}
                            className="border-b last:border-0 hover:bg-muted/30"
                          >
                            <td className="px-4 py-3 font-medium">
                              {new Date(day.period).toLocaleDateString("de-DE", {
                                weekday: "short",
                                day: "2-digit",
                                month: "2-digit",
                              })}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {day.messagesSent}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {day.dialogsHandled}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {formatDuration(day.avgResponseTimeSec)}
                            </td>
                            <td className="px-4 py-3 text-right font-medium">
                              {day.unlocksGenerated}
                            </td>
                            <td className="px-4 py-3 text-right font-medium">
                              {day.revenueCoins.toLocaleString("de-DE")}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {(day.conversionRate * 100).toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">Keine Daten verfügbar.</p>
        </div>
      )}
    </div>
    </AppShell>
  );
}
