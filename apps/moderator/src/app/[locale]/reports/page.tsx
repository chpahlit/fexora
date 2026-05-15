"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { AppShell } from "@/components/app-shell";

interface DailyStats {
  date: string;
  messagesSent: number;
  dialogsHandled: number;
  avgResponseTimeSeconds: number;
  unlocksAttributed: number;
  revenueAttributedCoins: number;
  provisionEarned: number;
}

interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  totalMessages: number;
  totalDialogs: number;
  avgResponseTimeSeconds: number;
  totalUnlocks: number;
  totalRevenueCoins: number;
  totalProvision: number;
  trend: {
    messages: number;
    unlocks: number;
    revenue: number;
  };
}

interface LeaderboardEntry {
  moderatorId: string;
  username: string;
  revenue: number;
  unlocks: number;
  messages: number;
  avgResponseTime: number;
  rank: number;
}

interface ProvisionSummary {
  moderatorId: string;
  period: string;
  revenueAttributed: number;
  provisionPercentage: number;
  provisionAmount: number;
  breakdown: {
    type: string;
    revenue: number;
    percentage: number;
    provision: number;
  }[];
}

export default function ReportsPage() {
  const { client } = useAuth();
  const [period, setPeriod] = useState<"today" | "week" | "month">("today");
  const [reportView, setReportView] = useState<"daily" | "weekly">("daily");

  const { data: dailyData } = useQuery({
    queryKey: ["moderator", "reports", "daily"],
    queryFn: () => client.get<DailyStats[]>("/moderator/reports/daily?days=7"),
  });
  const dailyStats = dailyData?.success ? dailyData.data ?? [] : [];

  const { data: weeklyData } = useQuery({
    queryKey: ["moderator", "reports", "weekly"],
    queryFn: () => client.get<WeeklyStats[]>("/moderator/reports/weekly?weeks=4"),
  });
  const weeklyStats = weeklyData?.success ? weeklyData.data ?? [] : [];

  const { data: leaderboardData } = useQuery({
    queryKey: ["moderator", "leaderboard", period],
    queryFn: () => client.get<LeaderboardEntry[]>(`/moderator/leaderboard?period=${period}`),
  });
  const leaderboard = leaderboardData?.success ? leaderboardData.data ?? [] : [];

  const { data: provisionData } = useQuery({
    queryKey: ["moderator", "provisions", "summary"],
    queryFn: () => client.get<ProvisionSummary>("/moderator/provisions/summary"),
  });
  const provisions = provisionData?.success ? provisionData.data : null;

  const todayStats = dailyStats[0];

  function formatTime(seconds: number) {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    return `${Math.round(seconds / 60)}m`;
  }

  function handleExportCsv() {
    window.open(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api"}/moderator/reports/export?period=${period}`,
      "_blank"
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Reports</h1>
            <p className="text-sm text-muted-foreground">Performance reports and provision overview</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportCsv}>
            Export CSV
          </Button>
        </div>

        {/* Today's Summary */}
        {todayStats && (
          <div className="grid gap-4 md:grid-cols-5">
            <Card>
              <CardContent className="pt-4 pb-3 text-center">
                <p className="text-2xl font-bold">{todayStats.messagesSent}</p>
                <p className="text-xs text-muted-foreground">Messages Today</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3 text-center">
                <p className="text-2xl font-bold">{todayStats.dialogsHandled}</p>
                <p className="text-xs text-muted-foreground">Dialogs</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3 text-center">
                <p className="text-2xl font-bold">{formatTime(todayStats.avgResponseTimeSeconds)}</p>
                <p className="text-xs text-muted-foreground">Avg Response</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3 text-center">
                <p className="text-2xl font-bold">{todayStats.unlocksAttributed}</p>
                <p className="text-xs text-muted-foreground">Unlocks</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3 text-center">
                <p className="text-2xl font-bold">{todayStats.revenueAttributedCoins.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Revenue (Coins)</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="reports">
          <TabsList>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="provisions">Provisions</TabsTrigger>
          </TabsList>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={reportView === "daily" ? "default" : "outline"}
                size="sm"
                onClick={() => setReportView("daily")}
              >
                Daily
              </Button>
              <Button
                variant={reportView === "weekly" ? "default" : "outline"}
                size="sm"
                onClick={() => setReportView("weekly")}
              >
                Weekly
              </Button>
            </div>

            {reportView === "daily" ? (
              <div className="rounded-lg border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left font-medium">Date</th>
                      <th className="p-3 text-right font-medium">Messages</th>
                      <th className="p-3 text-right font-medium">Dialogs</th>
                      <th className="p-3 text-right font-medium">Avg Response</th>
                      <th className="p-3 text-right font-medium">Unlocks</th>
                      <th className="p-3 text-right font-medium">Revenue</th>
                      <th className="p-3 text-right font-medium">Provision</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyStats.map((day) => (
                      <tr key={day.date} className="border-b last:border-0">
                        <td className="p-3">{new Date(day.date).toLocaleDateString()}</td>
                        <td className="p-3 text-right">{day.messagesSent}</td>
                        <td className="p-3 text-right">{day.dialogsHandled}</td>
                        <td className="p-3 text-right">{formatTime(day.avgResponseTimeSeconds)}</td>
                        <td className="p-3 text-right">{day.unlocksAttributed}</td>
                        <td className="p-3 text-right">{day.revenueAttributedCoins.toLocaleString()}</td>
                        <td className="p-3 text-right font-medium">{day.provisionEarned.toLocaleString()}</td>
                      </tr>
                    ))}
                    {dailyStats.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-muted-foreground">No data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="space-y-4">
                {weeklyStats.map((week) => (
                  <Card key={week.weekStart}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">
                        {new Date(week.weekStart).toLocaleDateString()} — {new Date(week.weekEnd).toLocaleDateString()}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
                        <div>
                          <p className="text-lg font-bold">{week.totalMessages}</p>
                          <p className="text-xs text-muted-foreground">Messages</p>
                          {week.trend.messages !== 0 && (
                            <Badge variant={week.trend.messages > 0 ? "default" : "destructive"} className="text-[10px] mt-1">
                              {week.trend.messages > 0 ? "+" : ""}{week.trend.messages}%
                            </Badge>
                          )}
                        </div>
                        <div>
                          <p className="text-lg font-bold">{week.totalDialogs}</p>
                          <p className="text-xs text-muted-foreground">Dialogs</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold">{formatTime(week.avgResponseTimeSeconds)}</p>
                          <p className="text-xs text-muted-foreground">Avg Response</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold">{week.totalUnlocks}</p>
                          <p className="text-xs text-muted-foreground">Unlocks</p>
                          {week.trend.unlocks !== 0 && (
                            <Badge variant={week.trend.unlocks > 0 ? "default" : "destructive"} className="text-[10px] mt-1">
                              {week.trend.unlocks > 0 ? "+" : ""}{week.trend.unlocks}%
                            </Badge>
                          )}
                        </div>
                        <div>
                          <p className="text-lg font-bold">{week.totalRevenueCoins.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Revenue</p>
                          {week.trend.revenue !== 0 && (
                            <Badge variant={week.trend.revenue > 0 ? "default" : "destructive"} className="text-[10px] mt-1">
                              {week.trend.revenue > 0 ? "+" : ""}{week.trend.revenue}%
                            </Badge>
                          )}
                        </div>
                        <div>
                          <p className="text-lg font-bold">{week.totalProvision.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Provision</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {weeklyStats.length === 0 && (
                  <div className="rounded-lg border border-dashed p-8 text-center">
                    <p className="text-muted-foreground">No weekly data available</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-4">
            <div className="flex gap-2">
              {(["today", "week", "month"] as const).map((p) => (
                <Button
                  key={p}
                  variant={period === p ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPeriod(p)}
                >
                  {p === "today" ? "Today" : p === "week" ? "This Week" : "This Month"}
                </Button>
              ))}
            </div>

            <div className="rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left font-medium">Rank</th>
                    <th className="p-3 text-left font-medium">Moderator</th>
                    <th className="p-3 text-right font-medium">Revenue</th>
                    <th className="p-3 text-right font-medium">Unlocks</th>
                    <th className="p-3 text-right font-medium">Messages</th>
                    <th className="p-3 text-right font-medium">Avg Response</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => (
                    <tr key={entry.moderatorId} className="border-b last:border-0">
                      <td className="p-3">
                        {entry.rank <= 3 ? (
                          <Badge variant={entry.rank === 1 ? "default" : "secondary"}>
                            #{entry.rank}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">#{entry.rank}</span>
                        )}
                      </td>
                      <td className="p-3 font-medium">{entry.username}</td>
                      <td className="p-3 text-right">{entry.revenue.toLocaleString()}</td>
                      <td className="p-3 text-right">{entry.unlocks}</td>
                      <td className="p-3 text-right">{entry.messages}</td>
                      <td className="p-3 text-right">{formatTime(entry.avgResponseTime)}</td>
                    </tr>
                  ))}
                  {leaderboard.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">No leaderboard data</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Provisions Tab */}
          <TabsContent value="provisions" className="space-y-4">
            {provisions ? (
              <>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardContent className="pt-4 pb-3 text-center">
                      <p className="text-2xl font-bold">{provisions.revenueAttributed.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Revenue Attributed (Coins)</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 pb-3 text-center">
                      <p className="text-2xl font-bold">{provisions.provisionPercentage}%</p>
                      <p className="text-xs text-muted-foreground">Avg Provision Rate</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 pb-3 text-center">
                      <p className="text-2xl font-bold text-primary">{provisions.provisionAmount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Total Provision (Coins)</p>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                <h3 className="text-sm font-semibold">Breakdown by Type</h3>
                <div className="rounded-lg border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left font-medium">Type</th>
                        <th className="p-3 text-right font-medium">Revenue</th>
                        <th className="p-3 text-right font-medium">Rate</th>
                        <th className="p-3 text-right font-medium">Provision</th>
                      </tr>
                    </thead>
                    <tbody>
                      {provisions.breakdown.map((item) => (
                        <tr key={item.type} className="border-b last:border-0">
                          <td className="p-3 capitalize">{item.type}</td>
                          <td className="p-3 text-right">{item.revenue.toLocaleString()}</td>
                          <td className="p-3 text-right">{item.percentage}%</td>
                          <td className="p-3 text-right font-medium">{item.provision.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground">No provision data available</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
