"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SubscriptionTier {
  id: string;
  name: string;
  priceCoins: number;
  priceEur: number;
  perks: string[];
  subscriberCount: number;
  mrr: number;
  isActive: boolean;
  sortOrder: number;
}

interface CreatorSubStats {
  totalSubscribers: number;
  mrr: number;
  churnRate: number;
}

const AVAILABLE_PERKS = [
  { key: "all_paid_content", label: "Access all paid content" },
  { key: "chat_free", label: "Free chat messages" },
  { key: "exclusive_badge", label: "Exclusive subscriber badge" },
  { key: "priority_requests", label: "Priority custom requests" },
];

function CreatorSubscriptionsContent() {
  const t = useTranslations();
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    name: "",
    priceCoins: "",
    priceEur: "",
    perks: [] as string[],
    customPerk: "",
  });

  const { data: tiersData } = useQuery({
    queryKey: ["creator", "subscription-tiers"],
    queryFn: () => client.get<SubscriptionTier[]>("/subscriptions/tiers/mine"),
  });
  const tiers = tiersData?.success ? tiersData.data ?? [] : [];

  const { data: statsData } = useQuery({
    queryKey: ["creator", "subscription-stats"],
    queryFn: () => client.get<CreatorSubStats>("/subscriptions/stats"),
  });
  const stats = statsData?.success ? statsData.data : null;

  function togglePerk(perk: string) {
    setForm((prev) => ({
      ...prev,
      perks: prev.perks.includes(perk)
        ? prev.perks.filter((p) => p !== perk)
        : [...prev.perks, perk],
    }));
  }

  async function handleCreate() {
    const perks = [...form.perks];
    if (form.customPerk.trim()) perks.push(form.customPerk.trim());

    await client.post("/subscriptions/tiers", {
      name: form.name,
      priceCoins: parseInt(form.priceCoins, 10),
      priceEur: form.priceEur ? parseFloat(form.priceEur) : 0,
      perks,
    });
    queryClient.invalidateQueries({ queryKey: ["creator", "subscription-tiers"] });
    setShowCreate(false);
    setForm({ name: "", priceCoins: "", priceEur: "", perks: [], customPerk: "" });
  }

  async function handleDelete(id: string) {
    await client.delete(`/subscriptions/tiers/${id}`);
    queryClient.invalidateQueries({ queryKey: ["creator", "subscription-tiers"] });
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Subscription Tiers</h1>
        <Button onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? t("common.cancel") : "Create Tier"}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{stats?.totalSubscribers ?? 0}</p>
            <p className="text-sm text-muted-foreground">Subscribers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{stats?.mrr ?? 0}</p>
            <p className="text-sm text-muted-foreground">MRR (Coins)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{stats?.churnRate?.toFixed(1) ?? 0}%</p>
            <p className="text-sm text-muted-foreground">Churn Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Create Tier Form */}
      {showCreate && (
        <Card>
          <CardHeader>
            <CardTitle>New Subscription Tier</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tier Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Gold, VIP, Premium"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price (Coins/month)</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.priceCoins}
                  onChange={(e) => setForm({ ...form, priceCoins: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Price (EUR/month, optional)</Label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.priceEur}
                  onChange={(e) => setForm({ ...form, priceEur: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Perks</Label>
              <div className="space-y-2">
                {AVAILABLE_PERKS.map((perk) => (
                  <label key={perk.key} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={form.perks.includes(perk.key)}
                      onCheckedChange={() => togglePerk(perk.key)}
                    />
                    <span>{perk.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Custom Perk (optional)</Label>
              <Input
                value={form.customPerk}
                onChange={(e) => setForm({ ...form, customPerk: e.target.value })}
                placeholder="e.g. Monthly video call"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleCreate} disabled={!form.name || !form.priceCoins}>
              Create Tier
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Existing Tiers */}
      <div className="space-y-3">
        {tiers.length > 0 ? (
          tiers.map((tier) => (
            <Card key={tier.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-lg">{tier.name}</p>
                      <Badge variant={tier.isActive ? "success" : "secondary"}>
                        {tier.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {tier.priceCoins} Coins/month
                      {tier.priceEur > 0 && ` · ${tier.priceEur.toFixed(2)} EUR/month`}
                      {" · "}{tier.subscriberCount} subscribers
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {tier.perks.map((perk) => (
                        <Badge key={perk} variant="secondary" className="text-xs">
                          {perk}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(tier.id)}>
                    {t("common.delete")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">No subscription tiers yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CreatorSubscriptionsPage() {
  return (
    <ProtectedRoute roles={["Creator", "Admin"]}>
      <CreatorSubscriptionsContent />
    </ProtectedRoute>
  );
}
