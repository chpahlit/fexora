"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface ProvisionRate {
  type: string;
  percentage: number;
  settingKey: string;
}

interface ModeratorProvision {
  moderatorId: string;
  username: string;
  agencyName?: string;
  revenueAttributed: number;
  provisionEarned: number;
  unlockProvision: number;
  chatProvision: number;
  subscriptionProvision: number;
  tipProvision: number;
  ppvProvision: number;
  customRequestProvision: number;
}

interface AgencyProvisionSummary {
  agencyId: string;
  agencyName: string;
  totalRevenue: number;
  totalProvision: number;
  moderatorCount: number;
  topModerator: string;
}

const PROVISION_TYPES = [
  { key: "mod_provision_unlock_pct", label: "Unlock", type: "unlock" },
  { key: "mod_provision_chat_pct", label: "Chat", type: "chat" },
  { key: "mod_provision_subscription_pct", label: "Subscription", type: "subscription" },
  { key: "mod_provision_tip_pct", label: "Tip", type: "tip" },
  { key: "mod_provision_ppv_pct", label: "PPV", type: "ppv" },
  { key: "mod_provision_custom_request_pct", label: "Custom Request", type: "custom_request" },
];

export default function ProvisionsPage() {
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [period, setPeriod] = useState<"today" | "week" | "month">("month");
  const [editingRates, setEditingRates] = useState<Record<string, string>>({});

  const { data: ratesData } = useQuery({
    queryKey: ["admin", "provision-rates"],
    queryFn: () => client.get<ProvisionRate[]>("/admin/provisions/rates"),
  });
  const rates = ratesData?.success ? ratesData.data ?? [] : [];

  const { data: modsData } = useQuery({
    queryKey: ["admin", "provisions", "moderators", period],
    queryFn: () => client.get<ModeratorProvision[]>(`/admin/provisions/moderators?period=${period}`),
  });
  const moderators = modsData?.success ? modsData.data ?? [] : [];

  const { data: agenciesData } = useQuery({
    queryKey: ["admin", "provisions", "agencies", period],
    queryFn: () => client.get<AgencyProvisionSummary[]>(`/admin/provisions/agencies?period=${period}`),
  });
  const agencies = agenciesData?.success ? agenciesData.data ?? [] : [];

  const totalProvisions = moderators.reduce((sum, m) => sum + m.provisionEarned, 0);
  const totalRevenue = moderators.reduce((sum, m) => sum + m.revenueAttributed, 0);

  function startEditing() {
    const current: Record<string, string> = {};
    for (const type of PROVISION_TYPES) {
      const rate = rates.find((r) => r.settingKey === type.key);
      current[type.key] = String(rate?.percentage ?? 10);
    }
    setEditingRates(current);
  }

  async function saveRates() {
    const updates = Object.entries(editingRates).map(([key, value]) => ({
      key,
      value: String(Number(value)),
    }));
    await client.put("/admin/provisions/rates", { rates: updates });
    queryClient.invalidateQueries({ queryKey: ["admin", "provision-rates"] });
    setEditingRates({});
  }

  function handleExportCsv() {
    window.open(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api"}/admin/provisions/export?period=${period}`,
      "_blank"
    );
  }

  const isEditing = Object.keys(editingRates).length > 0;

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Provision Management</h1>
            <p className="text-sm text-muted-foreground">Configure provision rates and view payouts</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportCsv}>
            Export CSV
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold">{totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Attributed Revenue</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold text-primary">{totalProvisions.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Provisions (Coins)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold">{moderators.length}</p>
              <p className="text-xs text-muted-foreground">Active Moderators</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold">{agencies.length}</p>
              <p className="text-xs text-muted-foreground">Agencies</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="rates">
          <TabsList>
            <TabsTrigger value="rates">Provision Rates</TabsTrigger>
            <TabsTrigger value="moderators">Per Moderator</TabsTrigger>
            <TabsTrigger value="agencies">Per Agency</TabsTrigger>
          </TabsList>

          {/* Provision Rates */}
          <TabsContent value="rates" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Provision Rates by Type</CardTitle>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setEditingRates({})}>Cancel</Button>
                    <Button size="sm" onClick={saveRates}>Save</Button>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" onClick={startEditing}>Edit Rates</Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {PROVISION_TYPES.map((type) => {
                    const rate = rates.find((r) => r.settingKey === type.key);
                    return (
                      <div key={type.key} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="font-medium">{type.label}</Label>
                          <Badge variant="secondary">{type.type}</Badge>
                        </div>
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              step="0.5"
                              value={editingRates[type.key] ?? ""}
                              onChange={(e) => setEditingRates({ ...editingRates, [type.key]: e.target.value })}
                              className="w-20"
                            />
                            <span className="text-sm text-muted-foreground">%</span>
                          </div>
                        ) : (
                          <p className="text-2xl font-bold">{rate?.percentage ?? 10}%</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Per Moderator */}
          <TabsContent value="moderators" className="space-y-4">
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
                    <th className="p-3 text-left font-medium">Moderator</th>
                    <th className="p-3 text-left font-medium">Agency</th>
                    <th className="p-3 text-right font-medium">Revenue</th>
                    <th className="p-3 text-right font-medium">Unlock</th>
                    <th className="p-3 text-right font-medium">Chat</th>
                    <th className="p-3 text-right font-medium">Sub</th>
                    <th className="p-3 text-right font-medium">Tips</th>
                    <th className="p-3 text-right font-medium">Total Prov.</th>
                  </tr>
                </thead>
                <tbody>
                  {moderators.map((mod) => (
                    <tr key={mod.moderatorId} className="border-b last:border-0">
                      <td className="p-3 font-medium">{mod.username}</td>
                      <td className="p-3 text-muted-foreground">{mod.agencyName ?? "—"}</td>
                      <td className="p-3 text-right">{mod.revenueAttributed.toLocaleString()}</td>
                      <td className="p-3 text-right">{mod.unlockProvision.toLocaleString()}</td>
                      <td className="p-3 text-right">{mod.chatProvision.toLocaleString()}</td>
                      <td className="p-3 text-right">{mod.subscriptionProvision.toLocaleString()}</td>
                      <td className="p-3 text-right">{mod.tipProvision.toLocaleString()}</td>
                      <td className="p-3 text-right font-bold">{mod.provisionEarned.toLocaleString()}</td>
                    </tr>
                  ))}
                  {moderators.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-muted-foreground">No provision data</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Per Agency */}
          <TabsContent value="agencies" className="space-y-4">
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
                    <th className="p-3 text-left font-medium">Agency</th>
                    <th className="p-3 text-right font-medium">Moderators</th>
                    <th className="p-3 text-right font-medium">Total Revenue</th>
                    <th className="p-3 text-right font-medium">Total Provision</th>
                    <th className="p-3 text-left font-medium">Top Moderator</th>
                  </tr>
                </thead>
                <tbody>
                  {agencies.map((agency) => (
                    <tr key={agency.agencyId} className="border-b last:border-0">
                      <td className="p-3 font-medium">{agency.agencyName}</td>
                      <td className="p-3 text-right">{agency.moderatorCount}</td>
                      <td className="p-3 text-right">{agency.totalRevenue.toLocaleString()}</td>
                      <td className="p-3 text-right font-bold">{agency.totalProvision.toLocaleString()}</td>
                      <td className="p-3 text-muted-foreground">{agency.topModerator}</td>
                    </tr>
                  ))}
                  {agencies.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">No agency data</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
