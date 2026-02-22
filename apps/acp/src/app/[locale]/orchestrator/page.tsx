"use client";

import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AppShell } from "@/components/app-shell";

interface ScenarioStep {
  id: string;
  stepOrder: number;
  actionType: string;
  dayOffset: number;
}

interface Scenario {
  id: string;
  name: string;
  description?: string;
  status: string;
  priority: number;
  createdAt: string;
  steps: ScenarioStep[];
}

interface BroadcastVariant {
  id: string;
  variantName: string;
  sendCount: number;
  responseCount: number;
  unlockCount: number;
  weightPercent: number;
}

interface Broadcast {
  id: string;
  name: string;
  status: string;
  estimatedRecipients: number;
  scheduledAt?: string;
  completedAt?: string;
  createdAt: string;
  variants: BroadcastVariant[];
}

interface PaginatedResult<T> {
  data: T[];
  total: number;
}

function ProgressBar({ value, max, className }: { value: number; max: number; className?: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className={`h-2 w-full rounded-full bg-muted ${className ?? ""}`}>
      <div
        className="h-full rounded-full bg-primary transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function statusVariant(status: string) {
  switch (status) {
    case "Active":
    case "Sending":
      return "default" as const;
    case "Draft":
      return "secondary" as const;
    case "Paused":
    case "Scheduled":
      return "warning" as const;
    case "Completed":
      return "success" as const;
    case "Aborted":
      return "destructive" as const;
    default:
      return "outline" as const;
  }
}

export default function OrchestratorDashboardPage() {
  const { client, isAuthenticated } = useAuth();

  const { data: scenariosData, isLoading: scenariosLoading } = useQuery({
    queryKey: ["admin", "orchestrator", "scenarios"],
    queryFn: () => client.get<PaginatedResult<Scenario>>("/scenarios?page=1&pageSize=100"),
    enabled: isAuthenticated,
  });

  const { data: broadcastsData, isLoading: broadcastsLoading } = useQuery({
    queryKey: ["admin", "orchestrator", "broadcasts"],
    queryFn: () => client.get<PaginatedResult<Broadcast>>("/broadcasts?page=1&pageSize=100"),
    enabled: isAuthenticated,
  });

  const scenarios = scenariosData?.success ? scenariosData.data?.data ?? [] : [];
  const broadcasts = broadcastsData?.success ? broadcastsData.data?.data ?? [] : [];

  const activeScenarios = scenarios.filter((s) => s.status === "Active");
  const draftScenarios = scenarios.filter((s) => s.status === "Draft");
  const scheduledBroadcasts = broadcasts.filter((b) => b.status === "Scheduled");
  const completedBroadcasts = broadcasts.filter((b) => b.status === "Completed");

  const totalSent = broadcasts.reduce(
    (sum, b) => sum + (b.variants?.reduce((vs, v) => vs + v.sendCount, 0) ?? 0), 0
  );
  const totalResponses = broadcasts.reduce(
    (sum, b) => sum + (b.variants?.reduce((vs, v) => vs + v.responseCount, 0) ?? 0), 0
  );
  const totalUnlocks = broadcasts.reduce(
    (sum, b) => sum + (b.variants?.reduce((vs, v) => vs + v.unlockCount, 0) ?? 0), 0
  );
  const responseRate = totalSent > 0 ? (totalResponses / totalSent) * 100 : 0;
  const unlockRate = totalSent > 0 ? (totalUnlocks / totalSent) * 100 : 0;

  const recentBroadcasts = [...broadcasts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const isLoading = scenariosLoading || broadcastsLoading;

  return (
    <AppShell>
    <div className="space-y-6">
      {/* Header with navigation */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orchestrator Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/scenarios">
            <Button variant="outline" size="sm">Scenarios</Button>
          </Link>
          <Link href="/segments">
            <Button variant="outline" size="sm">Segments</Button>
          </Link>
          <Link href="/broadcasts">
            <Button variant="outline" size="sm">Broadcasts</Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Active Scenarios</p>
                <p className="text-3xl font-bold">{activeScenarios.length}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{draftScenarios.length} drafts, {scenarios.length} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Scheduled Broadcasts</p>
                <p className="text-3xl font-bold">{scheduledBroadcasts.length}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{completedBroadcasts.length} completed, {broadcasts.length} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Messages Sent</p>
                <p className="text-3xl font-bold">{totalSent.toLocaleString()}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{totalResponses.toLocaleString()} responses, {totalUnlocks.toLocaleString()} unlocks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Response Rate</p>
                <p className="text-3xl font-bold">{responseRate.toFixed(1)}%</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              </div>
            </div>
            <ProgressBar value={responseRate} max={100} className="mt-2" />
            <p className="mt-1 text-xs text-muted-foreground">Unlock rate: {unlockRate.toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Scenarios */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-lg">Active Scenarios</CardTitle>
            <Link href="/scenarios">
              <Button variant="ghost" size="sm">View all</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            ) : activeScenarios.length > 0 ? (
              <div className="space-y-2">
                {activeScenarios.slice(0, 5).map((s) => (
                  <Link key={s.id} href={`/scenarios/${s.id}`}>
                    <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{s.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {s.steps?.length ?? 0} steps &middot; Priority {s.priority}
                        </p>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                  </Link>
                ))}
                {activeScenarios.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center pt-1">
                    +{activeScenarios.length - 5} more
                  </p>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <p className="text-sm text-muted-foreground">No active scenarios</p>
                <Link href="/scenarios">
                  <Button variant="outline" size="sm" className="mt-2">Create one</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Broadcasts */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-lg">Recent Broadcasts</CardTitle>
            <Link href="/broadcasts">
              <Button variant="ghost" size="sm">View all</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            ) : recentBroadcasts.length > 0 ? (
              <div className="space-y-2">
                {recentBroadcasts.map((b) => {
                  const sent = b.variants?.reduce((s, v) => s + v.sendCount, 0) ?? 0;
                  const responses = b.variants?.reduce((s, v) => s + v.responseCount, 0) ?? 0;
                  return (
                    <Link key={b.id} href={`/broadcasts/${b.id}`}>
                      <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{b.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {sent > 0 ? `${sent.toLocaleString()} sent` : `${b.estimatedRecipients.toLocaleString()} recipients`}
                            {responses > 0 && ` &middot; ${responses} responses`}
                          </p>
                        </div>
                        <Badge variant={statusVariant(b.status)}>{b.status}</Badge>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <p className="text-sm text-muted-foreground">No broadcasts yet</p>
                <Link href="/broadcasts">
                  <Button variant="outline" size="sm" className="mt-2">Create one</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Response Rate</span>
                <span className="text-sm font-medium">{responseRate.toFixed(1)}%</span>
              </div>
              <ProgressBar value={responseRate} max={100} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Unlock Rate</span>
                <span className="text-sm font-medium">{unlockRate.toFixed(1)}%</span>
              </div>
              <ProgressBar value={unlockRate} max={100} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Scenario Utilization</span>
                <span className="text-sm font-medium">
                  {scenarios.length > 0
                    ? ((activeScenarios.length / scenarios.length) * 100).toFixed(0)
                    : 0}%
                </span>
              </div>
              <ProgressBar value={activeScenarios.length} max={scenarios.length || 1} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex gap-3 flex-wrap">
        <Link href="/scenarios">
          <Button>New Scenario</Button>
        </Link>
        <Link href="/broadcasts">
          <Button variant="outline">New Broadcast</Button>
        </Link>
        <Link href="/segments">
          <Button variant="outline">Build Segment</Button>
        </Link>
      </div>
    </div>
    </AppShell>
  );
}
