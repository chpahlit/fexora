"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { AppShell } from "@/components/app-shell";

interface AgencyCreator {
  id: string;
  username: string;
  avatarUrl?: string;
  status: string;
  revenue: number;
  subscriberCount: number;
}

interface AgencyModerator {
  id: string;
  username: string;
  email: string;
  status: "active" | "inactive";
  assignedCreators: number;
  messagesSent: number;
  unlocksGenerated: number;
}

interface Assignment {
  moderatorId: string;
  moderatorUsername: string;
  creatorId: string;
  creatorUsername: string;
}

interface AgencyKPIs {
  totalMessages: number;
  totalUnlocks: number;
  totalRevenue: number;
  conversionRate: number;
  avgResponseTime: number;
}

export default function AgencyDashboardPage() {
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [inviteEmail, setInviteEmail] = useState("");

  const { data: creatorsData } = useQuery({
    queryKey: ["agency", "creators"],
    queryFn: () => client.get<AgencyCreator[]>("/agency/creators"),
  });

  const { data: moderatorsData } = useQuery({
    queryKey: ["agency", "moderators"],
    queryFn: () => client.get<AgencyModerator[]>("/agency/moderators"),
  });

  const { data: assignmentsData } = useQuery({
    queryKey: ["agency", "assignments"],
    queryFn: () => client.get<Assignment[]>("/agency/assignments"),
  });

  const { data: kpisData } = useQuery({
    queryKey: ["agency", "kpis"],
    queryFn: () => client.get<AgencyKPIs>("/agency/kpis"),
  });

  const creators = creatorsData?.success ? creatorsData.data ?? [] : [];
  const moderators = moderatorsData?.success ? moderatorsData.data ?? [] : [];
  const assignments = assignmentsData?.success ? assignmentsData.data ?? [] : [];
  const kpis = kpisData?.success ? kpisData.data : null;

  async function handleInvite() {
    if (!inviteEmail.trim()) return;
    await client.post("/agency/moderators/invite", { email: inviteEmail });
    queryClient.invalidateQueries({ queryKey: ["agency", "moderators"] });
    setInviteEmail("");
  }

  async function handleToggleModerator(id: string, currentStatus: string) {
    const action = currentStatus === "active" ? "deactivate" : "activate";
    await client.post(`/agency/moderators/${id}/${action}`);
    queryClient.invalidateQueries({ queryKey: ["agency", "moderators"] });
  }

  async function handleAssign(moderatorId: string, creatorId: string) {
    await client.post("/agency/assignments", { moderatorId, creatorId });
    queryClient.invalidateQueries({ queryKey: ["agency", "assignments"] });
  }

  async function handleUnassign(moderatorId: string, creatorId: string) {
    await client.post("/agency/assignments/remove", { moderatorId, creatorId });
    queryClient.invalidateQueries({ queryKey: ["agency", "assignments"] });
  }

  async function handleExport() {
    const res = await client.get<{ downloadUrl: string }>("/agency/export");
    if (res.success && res.data?.downloadUrl) {
      window.open(res.data.downloadUrl, "_blank");
    }
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Agency Dashboard</h1>
          <Button variant="outline" onClick={handleExport}>CSV Export</Button>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold">{kpis?.totalMessages ?? 0}</p>
              <p className="text-xs text-muted-foreground">Messages</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold">{kpis?.totalUnlocks ?? 0}</p>
              <p className="text-xs text-muted-foreground">Unlocks</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold">{kpis?.totalRevenue ?? 0}</p>
              <p className="text-xs text-muted-foreground">Revenue</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold">{kpis?.conversionRate?.toFixed(1) ?? 0}%</p>
              <p className="text-xs text-muted-foreground">Conversion</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold">{kpis?.avgResponseTime ?? 0}m</p>
              <p className="text-xs text-muted-foreground">Avg Response</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="creators">
          <TabsList>
            <TabsTrigger value="creators">Creators ({creators.length})</TabsTrigger>
            <TabsTrigger value="moderators">Moderators ({moderators.length})</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="creators">
            <div className="mt-4 rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">Creator</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Revenue</th>
                    <th className="px-4 py-3 text-left font-medium">Subscribers</th>
                  </tr>
                </thead>
                <tbody>
                  {creators.map((c) => (
                    <tr key={c.id} className="border-b">
                      <td className="px-4 py-3 font-medium">{c.username}</td>
                      <td className="px-4 py-3">
                        <Badge variant={c.status === "active" ? "success" : "secondary"}>{c.status}</Badge>
                      </td>
                      <td className="px-4 py-3 font-mono">{c.revenue}</td>
                      <td className="px-4 py-3">{c.subscriberCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="moderators">
            <div className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Invite Moderator</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="moderator@example.com"
                  />
                  <Button onClick={handleInvite} disabled={!inviteEmail.trim()}>
                    Send Invite
                  </Button>
                </CardContent>
              </Card>

              <div className="rounded-lg border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left font-medium">Moderator</th>
                      <th className="px-4 py-3 text-left font-medium">Status</th>
                      <th className="px-4 py-3 text-left font-medium">Assigned</th>
                      <th className="px-4 py-3 text-left font-medium">Messages</th>
                      <th className="px-4 py-3 text-left font-medium">Unlocks</th>
                      <th className="px-4 py-3 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {moderators.map((m) => (
                      <tr key={m.id} className="border-b">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium">{m.username}</p>
                            <p className="text-xs text-muted-foreground">{m.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={m.status === "active" ? "success" : "secondary"}>{m.status}</Badge>
                        </td>
                        <td className="px-4 py-3">{m.assignedCreators}</td>
                        <td className="px-4 py-3">{m.messagesSent}</td>
                        <td className="px-4 py-3">{m.unlocksGenerated}</td>
                        <td className="px-4 py-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleModerator(m.id, m.status)}
                          >
                            {m.status === "active" ? "Deactivate" : "Activate"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="assignments">
            <div className="mt-4 space-y-3">
              {assignments.length > 0 ? (
                assignments.map((a) => (
                  <div
                    key={`${a.moderatorId}-${a.creatorId}`}
                    className="flex items-center justify-between rounded border p-3 text-sm"
                  >
                    <div>
                      <span className="font-medium">{a.moderatorUsername}</span>
                      <span className="text-muted-foreground"> → </span>
                      <span className="font-medium">{a.creatorUsername}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUnassign(a.moderatorId, a.creatorId)}
                    >
                      Remove
                    </Button>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <p className="text-muted-foreground">No assignments</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <div className="mt-4 rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">#</th>
                    <th className="px-4 py-3 text-left font-medium">Moderator</th>
                    <th className="px-4 py-3 text-left font-medium">Messages</th>
                    <th className="px-4 py-3 text-left font-medium">Unlocks</th>
                  </tr>
                </thead>
                <tbody>
                  {[...moderators]
                    .sort((a, b) => b.unlocksGenerated - a.unlocksGenerated)
                    .map((m, i) => (
                      <tr key={m.id} className="border-b">
                        <td className="px-4 py-3 font-bold text-muted-foreground">#{i + 1}</td>
                        <td className="px-4 py-3 font-medium">{m.username}</td>
                        <td className="px-4 py-3">{m.messagesSent}</td>
                        <td className="px-4 py-3">{m.unlocksGenerated}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
