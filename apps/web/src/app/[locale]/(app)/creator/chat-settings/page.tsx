"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ChatSettings {
  pricingModel: "free" | "unlock" | "per_message";
  unlockPrice?: number;
  pricePerMessage?: number;
  autoGreeting: string;
  autoGreetingEnabled: boolean;
  minMessageLength?: number;
  maxMessageLength?: number;
}

const PRICING_MODELS = [
  {
    value: "free" as const,
    label: "Free",
    description: "Anyone can message you for free",
  },
  {
    value: "unlock" as const,
    label: "Unlock",
    description: "Users pay once to unlock your chat",
  },
  {
    value: "per_message" as const,
    label: "Per Message",
    description: "Users pay for each message they send",
  },
];

export default function CreatorChatSettingsPage() {
  return (
    <ProtectedRoute roles={["Creator", "Admin"]}>
      <ChatSettingsContent />
    </ProtectedRoute>
  );
}

function ChatSettingsContent() {
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<ChatSettings>({
    pricingModel: "free",
    unlockPrice: 0,
    pricePerMessage: 0,
    autoGreeting: "",
    autoGreetingEnabled: false,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { data } = useQuery({
    queryKey: ["creator", "chat-settings"],
    queryFn: () => client.get<ChatSettings>("/creator/chat-settings"),
  });

  useEffect(() => {
    if (data?.success && data.data) {
      setSettings(data.data);
    }
  }, [data]);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await client.put("/creator/chat-settings", settings);
    queryClient.invalidateQueries({ queryKey: ["creator", "chat-settings"] });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Chat Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure how users can message you and set your chat pricing.
        </p>
      </div>

      {/* Pricing Model */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Model</CardTitle>
          <CardDescription>Choose how users pay to chat with you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {PRICING_MODELS.map((model) => (
            <label
              key={model.value}
              className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                settings.pricingModel === model.value
                  ? "border-primary bg-primary/5"
                  : "hover:bg-muted/50"
              }`}
            >
              <input
                type="radio"
                name="pricingModel"
                value={model.value}
                checked={settings.pricingModel === model.value}
                onChange={() => setSettings({ ...settings, pricingModel: model.value })}
                className="mt-0.5"
              />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{model.label}</p>
                  {settings.pricingModel === model.value && <Badge variant="default">Active</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">{model.description}</p>
              </div>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Price Configuration */}
      {settings.pricingModel !== "free" && (
        <Card>
          <CardHeader>
            <CardTitle>Price Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.pricingModel === "unlock" && (
              <div className="space-y-2">
                <Label>Unlock Price (Coins)</Label>
                <Input
                  type="number"
                  min={1}
                  value={settings.unlockPrice ?? ""}
                  onChange={(e) => setSettings({ ...settings, unlockPrice: parseInt(e.target.value) || 0 })}
                  placeholder="e.g. 50"
                />
                <p className="text-xs text-muted-foreground">
                  Users pay this amount once to unlock your chat permanently.
                </p>
              </div>
            )}
            {settings.pricingModel === "per_message" && (
              <div className="space-y-2">
                <Label>Price per Message (Coins)</Label>
                <Input
                  type="number"
                  min={1}
                  value={settings.pricePerMessage ?? ""}
                  onChange={(e) => setSettings({ ...settings, pricePerMessage: parseInt(e.target.value) || 0 })}
                  placeholder="e.g. 5"
                />
                <p className="text-xs text-muted-foreground">
                  Users pay this amount for each message they send you.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Auto-Greeting */}
      <Card>
        <CardHeader>
          <CardTitle>Auto-Greeting</CardTitle>
          <CardDescription>
            Automatically send a welcome message when a user starts a new chat with you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.autoGreetingEnabled}
              onChange={(e) => setSettings({ ...settings, autoGreetingEnabled: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm font-medium">Enable auto-greeting</span>
          </label>
          {settings.autoGreetingEnabled && (
            <div className="space-y-2">
              <Label>Greeting Message</Label>
              <Textarea
                value={settings.autoGreeting}
                onChange={(e) => setSettings({ ...settings, autoGreeting: e.target.value })}
                placeholder="Hey! Thanks for reaching out..."
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">{settings.autoGreeting.length}/500 characters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
        {saved && <span className="text-sm text-primary">Settings saved!</span>}
      </div>
    </div>
  );
}
