"use client";

import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Scenario {
  id: string;
  name: string;
  status: string;
}

interface Broadcast {
  id: string;
  name: string;
  status: string;
  estimatedRecipients: number;
  variants: { sendCount: number; responseCount: number; unlockCount: number }[];
}

interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export default function OrchestratorDashboardPage() {
  const { client, isAuthenticated } = useAuth();

  const { data: scenariosData } = useQuery({
    queryKey: ["admin", "orchestrator", "scenarios"],
    queryFn: () => client.get<PaginatedResult<Scenario>>("/scenarios?page=1&pageSize=100"),
    enabled: isAuthenticated,
  });

  const { data: broadcastsData } = useQuery({
    queryKey: ["admin", "orchestrator", "broadcasts"],
    queryFn: () => client.get<PaginatedResult<Broadcast>>("/broadcasts?page=1&pageSize=100"),
    enabled: isAuthenticated,
  });

  const scenarios = scenariosData?.success ? scenariosData.data?.data ?? [] : [];
  const broadcasts = broadcastsData?.success ? broadcastsData.data?.data ?? [] : [];

  const activeScenarios = scenarios.filter((s) => s.status === "Active").length;
  const draftScenarios = scenarios.filter((s) => s.status === "Draft").length;
  const completedBroadcasts = broadcasts.filter((b) => b.status === "Completed").length;
  const scheduledBroadcasts = broadcasts.filter((b) => b.status === "Scheduled").length;

  const totalSent = broadcasts.reduce(
    (sum, b) => sum + (b.variants?.reduce((vs, v) => vs + v.sendCount, 0) ?? 0), 0
  );
  const totalResponses = broadcasts.reduce(
    (sum, b) => sum + (b.variants?.reduce((vs, v) => vs + v.responseCount, 0) ?? 0), 0
  );
  const totalUnlocks = broadcasts.reduce(
    (sum, b) => sum + (b.variants?.reduce((vs, v) => vs + v.unlockCount, 0) ?? 0), 0
  );
  const responseRate = totalSent > 0 ? ((totalResponses / totalSent) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orchestrator Dashboard</h1>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{activeScenarios}</p>
            <p className="text-xs text-muted-foreground">Active Scenarios</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{scheduledBroadcasts}</p>
            <p className="text-xs text-muted-foreground">Scheduled Broadcasts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{totalSent.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Messages Sent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{responseRate}%</p>
            <p className="text-xs text-muted-foreground">Response Rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Scenarios */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Scenarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Active</span>
                <Badge>{activeScenarios}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Draft</span>
                <Badge variant="secondary">{draftScenarios}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Total</span>
                <Badge variant="outline">{scenarios.length}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Broadcasts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Broadcasts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Completed</span>
                <Badge>{completedBroadcasts}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Scheduled</span>
                <Badge variant="warning">{scheduledBroadcasts}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Total Unlocks</span>
                <Badge variant="secondary">{totalUnlocks.toLocaleString()}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
