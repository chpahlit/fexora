"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AppShell } from "@/components/app-shell";

interface PlatformSettings {
  mod_provision_unlock_pct: number;
  mod_provision_chat_pct: number;
  mod_provision_subscription_pct: number;
  chat_min_unlock_price: number;
  chat_min_per_msg_price: number;
  chat_max_per_msg_price: number;
  payout_min_amount_eur: number;
  tip_min_coins: number;
  tip_max_coins: number;
  ppv_min_price: number;
  ppv_max_price: number;
  referral_bonus_coins: number;
  referral_creator_provision_pct: number;
  media_set_max_items: number;
  platform_fee_unlock_pct: number;
  platform_fee_tip_pct: number;
  platform_fee_subscription_pct: number;
  platform_fee_ppv_pct: number;
  platform_fee_custom_request_pct: number;
  mass_message_rate_limit_per_hour: number;
  account_lockout_max_attempts: number;
}

const DEFAULT_SETTINGS: PlatformSettings = {
  mod_provision_unlock_pct: 10,
  mod_provision_chat_pct: 15,
  mod_provision_subscription_pct: 5,
  chat_min_unlock_price: 50,
  chat_min_per_msg_price: 5,
  chat_max_per_msg_price: 500,
  payout_min_amount_eur: 50,
  tip_min_coins: 1,
  tip_max_coins: 100000,
  ppv_min_price: 10,
  ppv_max_price: 5000,
  referral_bonus_coins: 100,
  referral_creator_provision_pct: 5,
  media_set_max_items: 20,
  platform_fee_unlock_pct: 20,
  platform_fee_tip_pct: 10,
  platform_fee_subscription_pct: 15,
  platform_fee_ppv_pct: 20,
  platform_fee_custom_request_pct: 15,
  mass_message_rate_limit_per_hour: 1,
  account_lockout_max_attempts: 5,
};

export default function PlatformSettingsPage() {
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<PlatformSettings>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { data: settingsData } = useQuery({
    queryKey: ["admin", "platform-settings"],
    queryFn: () => client.get<PlatformSettings>("/admin/settings"),
  });

  useEffect(() => {
    if (settingsData?.success && settingsData.data) {
      setSettings({ ...DEFAULT_SETTINGS, ...settingsData.data });
    }
  }, [settingsData]);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await client.put("/admin/settings", settings);
    queryClient.invalidateQueries({ queryKey: ["admin", "platform-settings"] });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function SettingField({ label, description, field, min, max, step }: {
    label: string;
    description: string;
    field: keyof PlatformSettings;
    min?: number;
    max?: number;
    step?: number;
  }) {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <Input
          type="number"
          min={min ?? 0}
          max={max}
          step={step ?? 1}
          value={settings[field]}
          onChange={(e) => setSettings({ ...settings, [field]: parseFloat(e.target.value) || 0 })}
        />
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    );
  }

  return (
    <AppShell>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Platform Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure global platform parameters, fees, and limits
        </p>
      </div>

      {/* Moderator Provisions */}
      <Card>
        <CardHeader>
          <CardTitle>Moderator Provisions</CardTitle>
          <CardDescription>Percentage rates paid to moderators for attributed revenue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <SettingField label="Unlock Provision (%)" description="% of unlock revenue attributed to moderator" field="mod_provision_unlock_pct" max={100} step={0.5} />
            <SettingField label="Chat Provision (%)" description="% of chat revenue attributed to moderator" field="mod_provision_chat_pct" max={100} step={0.5} />
            <SettingField label="Subscription Provision (%)" description="% of subscription revenue attributed to moderator" field="mod_provision_subscription_pct" max={100} step={0.5} />
          </div>
        </CardContent>
      </Card>

      {/* Platform Fees */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Fees</CardTitle>
          <CardDescription>Percentage the platform takes from each transaction type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <SettingField label="Unlock Fee (%)" description="Platform fee on content unlocks" field="platform_fee_unlock_pct" max={100} step={0.5} />
            <SettingField label="Tip Fee (%)" description="Platform fee on tips" field="platform_fee_tip_pct" max={100} step={0.5} />
            <SettingField label="Subscription Fee (%)" description="Platform fee on subscriptions" field="platform_fee_subscription_pct" max={100} step={0.5} />
            <SettingField label="PPV Fee (%)" description="Platform fee on PPV messages" field="platform_fee_ppv_pct" max={100} step={0.5} />
            <SettingField label="Custom Request Fee (%)" description="Platform fee on custom requests" field="platform_fee_custom_request_pct" max={100} step={0.5} />
          </div>
        </CardContent>
      </Card>

      {/* Chat Pricing Limits */}
      <Card>
        <CardHeader>
          <CardTitle>Chat Pricing Limits</CardTitle>
          <CardDescription>Min/max pricing creators can set for their chat</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <SettingField label="Min Unlock Price" description="Minimum coins for chat unlock" field="chat_min_unlock_price" />
            <SettingField label="Min Per-Message Price" description="Minimum coins per message" field="chat_min_per_msg_price" />
            <SettingField label="Max Per-Message Price" description="Maximum coins per message" field="chat_max_per_msg_price" />
          </div>
        </CardContent>
      </Card>

      {/* Tipping & PPV Limits */}
      <Card>
        <CardHeader>
          <CardTitle>Tipping & PPV Limits</CardTitle>
          <CardDescription>Min/max limits for tips and PPV messages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SettingField label="Min Tip (Coins)" description="Minimum tip amount" field="tip_min_coins" />
            <SettingField label="Max Tip (Coins)" description="Maximum tip amount" field="tip_max_coins" />
            <SettingField label="Min PPV Price" description="Minimum PPV message price" field="ppv_min_price" />
            <SettingField label="Max PPV Price" description="Maximum PPV message price" field="ppv_max_price" />
          </div>
        </CardContent>
      </Card>

      {/* Referral Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Referral Settings</CardTitle>
          <CardDescription>Referral bonus and provision configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <SettingField label="Referral Bonus (Coins)" description="Coins awarded for successful referral" field="referral_bonus_coins" />
            <SettingField label="Creator Provision (%)" description="% provision from referred creator earnings" field="referral_creator_provision_pct" max={100} step={0.5} />
          </div>
        </CardContent>
      </Card>

      {/* Other Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Other Settings</CardTitle>
          <CardDescription>Miscellaneous platform configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SettingField label="Payout Minimum (EUR)" description="Minimum payout amount in EUR" field="payout_min_amount_eur" />
            <SettingField label="Max Media-Set Items" description="Max media items per content" field="media_set_max_items" />
            <SettingField label="Mass-Message Rate Limit" description="Max mass messages per creator per hour" field="mass_message_rate_limit_per_hour" />
            <SettingField label="Account Lockout Attempts" description="Failed login attempts before lockout" field="account_lockout_max_attempts" />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save All Settings"}
        </Button>
        {saved && <span className="text-sm text-primary">All settings saved!</span>}
      </div>
    </div>
    </AppShell>
  );
}
