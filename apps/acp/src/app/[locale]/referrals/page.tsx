"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AppShell } from "@/components/app-shell";

interface ReferralConfig {
  userBonusCoins: number;
  creatorProvisionPercent: number;
  provisionDurationDays: number;
  maxReferralsPerUser: number;
  minPurchaseForBonus: number;
  enabled: boolean;
}

interface ReferralStats {
  totalReferrals: number;
  totalBonusPaid: number;
  totalProvisionPaid: number;
  activeReferrers: number;
  conversionRate: number;
  topReferrers: {
    userId: string;
    username: string;
    referrals: number;
    bonusEarned: number;
  }[];
}

export default function ReferralConfigPage() {
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [config, setConfig] = useState<ReferralConfig>({
    userBonusCoins: 100,
    creatorProvisionPercent: 5,
    provisionDurationDays: 90,
    maxReferralsPerUser: 50,
    minPurchaseForBonus: 0,
    enabled: true,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { data: configData } = useQuery({
    queryKey: ["admin", "referral", "config"],
    queryFn: () => client.get<ReferralConfig>("/admin/referral/config"),
  });

  const { data: statsData } = useQuery({
    queryKey: ["admin", "referral", "stats"],
    queryFn: () => client.get<ReferralStats>("/admin/referral/stats"),
  });
  const stats = statsData?.success ? statsData.data : null;

  useEffect(() => {
    if (configData?.success && configData.data) {
      setConfig(configData.data);
    }
  }, [configData]);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await client.put("/admin/referral/config", config);
    queryClient.invalidateQueries({ queryKey: ["admin", "referral"] });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <AppShell>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Referral Configuration</h1>
        <p className="text-sm text-muted-foreground">
          Configure referral bonuses, creator provisions, and limits
        </p>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold">{stats.totalReferrals}</p>
              <p className="text-xs text-muted-foreground">Total Referrals</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold">{stats.totalBonusPaid.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Bonus Paid (Coins)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold">{stats.totalProvisionPaid.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Provision Paid (Coins)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold">{stats.activeReferrers}</p>
              <p className="text-xs text-muted-foreground">Active Referrers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground">Conversion Rate</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Referral Settings</CardTitle>
              <CardDescription>Adjust referral bonus amounts and limits</CardDescription>
            </div>
            <Badge variant={config.enabled ? "default" : "destructive"}>
              {config.enabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm font-medium">Enable Referral System</span>
          </label>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>User Bonus (Coins)</Label>
              <Input
                type="number"
                min={0}
                value={config.userBonusCoins}
                onChange={(e) => setConfig({ ...config, userBonusCoins: parseInt(e.target.value) || 0 })}
              />
              <p className="text-xs text-muted-foreground">Coins awarded to the referrer when their referral signs up</p>
            </div>

            <div className="space-y-2">
              <Label>Creator Provision (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                step={0.5}
                value={config.creatorProvisionPercent}
                onChange={(e) => setConfig({ ...config, creatorProvisionPercent: parseFloat(e.target.value) || 0 })}
              />
              <p className="text-xs text-muted-foreground">Percentage of referred user&apos;s spending that goes to the referrer</p>
            </div>

            <div className="space-y-2">
              <Label>Provision Duration (Days)</Label>
              <Input
                type="number"
                min={1}
                value={config.provisionDurationDays}
                onChange={(e) => setConfig({ ...config, provisionDurationDays: parseInt(e.target.value) || 90 })}
              />
              <p className="text-xs text-muted-foreground">How long the referrer earns provision from the referred user</p>
            </div>

            <div className="space-y-2">
              <Label>Max Referrals per User</Label>
              <Input
                type="number"
                min={1}
                value={config.maxReferralsPerUser}
                onChange={(e) => setConfig({ ...config, maxReferralsPerUser: parseInt(e.target.value) || 50 })}
              />
              <p className="text-xs text-muted-foreground">Maximum number of referrals a single user can make</p>
            </div>

            <div className="space-y-2">
              <Label>Min Purchase for Bonus (Coins)</Label>
              <Input
                type="number"
                min={0}
                value={config.minPurchaseForBonus}
                onChange={(e) => setConfig({ ...config, minPurchaseForBonus: parseInt(e.target.value) || 0 })}
              />
              <p className="text-xs text-muted-foreground">Minimum purchase amount by referred user before bonus is paid (0 = on signup)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Configuration"}
            </Button>
            {saved && <span className="text-sm text-primary">Configuration saved!</span>}
          </div>
        </CardContent>
      </Card>

      {/* Top Referrers */}
      {stats && stats.topReferrers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Referrers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left font-medium">User</th>
                    <th className="p-3 text-right font-medium">Referrals</th>
                    <th className="p-3 text-right font-medium">Bonus Earned</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topReferrers.map((ref) => (
                    <tr key={ref.userId} className="border-b last:border-0">
                      <td className="p-3 font-medium">{ref.username}</td>
                      <td className="p-3 text-right">{ref.referrals}</td>
                      <td className="p-3 text-right font-bold">{ref.bonusEarned.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
    </AppShell>
  );
}
