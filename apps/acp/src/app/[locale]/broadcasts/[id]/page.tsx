"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AppShell } from "@/components/app-shell";

interface BroadcastVariant {
  id: string;
  variantName: string;
  messageText: string;
  mediaUrl?: string;
  sendCount: number;
  responseCount: number;
  unlockCount: number;
  weightPercent: number;
}

interface Broadcast {
  id: string;
  name: string;
  status: "Draft" | "Scheduled" | "Sending" | "Completed" | "Aborted";
  targetingQueryJson: string;
  senderProfileId: string;
  estimatedRecipients: number;
  scheduledAt?: string;
  completedAt?: string;
  isDryRun: boolean;
  createdAt: string;
  variants: BroadcastVariant[];
}

function statusVariant(status: string) {
  switch (status) {
    case "Sending": return "default" as const;
    case "Completed": return "success" as const;
    case "Scheduled": return "warning" as const;
    case "Aborted": return "destructive" as const;
    default: return "outline" as const;
  }
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

const MESSAGE_TEMPLATES = [
  { label: "Welcome Offer", text: "Welcome to FEXORA! As a special welcome gift, unlock exclusive content at a discount today." },
  { label: "New Content Alert", text: "Fresh content just dropped! Check out my latest exclusive posts before they're gone." },
  { label: "Limited Time Promo", text: "For the next 24 hours only: get access to premium content at a special price!" },
  { label: "Re-engagement", text: "We miss you! Come back and see what's new - there's exclusive content waiting for you." },
  { label: "Thank You", text: "Thank you for your support! Here's something special just for you." },
];

export default function BroadcastDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { client, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const [newVariant, setNewVariant] = useState({
    variantName: "",
    messageText: "",
    weightPercent: 50,
  });
  const [addingVariant, setAddingVariant] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "broadcasts", id],
    queryFn: () => client.get<Broadcast>(`/broadcasts/${id}`),
    enabled: isAuthenticated && !!id,
  });

  const broadcast = data?.success ? data.data : null;

  async function handleAddVariant() {
    if (!newVariant.variantName.trim() || !newVariant.messageText.trim()) return;
    setAddingVariant(true);
    try {
      await client.post(`/broadcasts/${id}/variants`, {
        variantName: newVariant.variantName,
        messageText: newVariant.messageText,
        weightPercent: newVariant.weightPercent,
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "broadcasts", id] });
      setNewVariant({ variantName: "", messageText: "", weightPercent: 50 });
    } finally {
      setAddingVariant(false);
    }
  }

  async function handleRemoveVariant(variantId: string) {
    await client.delete(`/broadcasts/variants/${variantId}`);
    queryClient.invalidateQueries({ queryKey: ["admin", "broadcasts", id] });
  }

  async function handleSchedule() {
    if (!scheduleDate || !scheduleTime) return;
    setScheduling(true);
    try {
      const scheduledAt = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
      await client.post(`/broadcasts/${id}/schedule`, { scheduledAt });
      queryClient.invalidateQueries({ queryKey: ["admin", "broadcasts", id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "broadcasts"] });
    } finally {
      setScheduling(false);
    }
  }

  async function handleSendNow() {
    await client.post(`/broadcasts/${id}/send`);
    queryClient.invalidateQueries({ queryKey: ["admin", "broadcasts", id] });
    queryClient.invalidateQueries({ queryKey: ["admin", "broadcasts"] });
  }

  async function handleAbort() {
    await client.post(`/broadcasts/${id}/abort`);
    queryClient.invalidateQueries({ queryKey: ["admin", "broadcasts", id] });
    queryClient.invalidateQueries({ queryKey: ["admin", "broadcasts"] });
  }

  if (isLoading) {
    return (
      <AppShell>
        <div className="space-y-6">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="h-48 animate-pulse rounded-lg bg-muted" />
          <div className="h-64 animate-pulse rounded-lg bg-muted" />
        </div>
      </AppShell>
    );
  }

  if (!broadcast) {
    return (
      <AppShell>
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">Broadcast not found.</p>
          <Link href="/broadcasts">
            <Button variant="outline" className="mt-4">Back to Broadcasts</Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  const totalSent = broadcast.variants?.reduce((s, v) => s + v.sendCount, 0) ?? 0;
  const totalResponses = broadcast.variants?.reduce((s, v) => s + v.responseCount, 0) ?? 0;
  const totalUnlocks = broadcast.variants?.reduce((s, v) => s + v.unlockCount, 0) ?? 0;
  const isDraft = broadcast.status === "Draft";
  const isActive = broadcast.status === "Scheduled" || broadcast.status === "Sending";
  const isCompleted = broadcast.status === "Completed" || broadcast.status === "Aborted";

  return (
    <AppShell>
      <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/orchestrator" className="hover:text-foreground">Orchestrator</Link>
        <span>/</span>
        <Link href="/broadcasts" className="hover:text-foreground">Broadcasts</Link>
        <span>/</span>
        <span className="text-foreground">{broadcast.name}</span>
      </div>

      {/* Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{broadcast.name}</h1>
                <Badge variant={statusVariant(broadcast.status)}>{broadcast.status}</Badge>
                {broadcast.isDryRun && <Badge variant="outline">Dry Run</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">
                {broadcast.estimatedRecipients.toLocaleString()} estimated recipients
                &middot; {broadcast.variants?.length ?? 0} variants
                &middot; Created {new Date(broadcast.createdAt).toLocaleDateString()}
              </p>
              {broadcast.scheduledAt && (
                <p className="text-sm text-muted-foreground">
                  Scheduled: {new Date(broadcast.scheduledAt).toLocaleString()}
                </p>
              )}
              {broadcast.completedAt && (
                <p className="text-sm text-muted-foreground">
                  Completed: {new Date(broadcast.completedAt).toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {isDraft && broadcast.variants && broadcast.variants.length > 0 && (
                <>
                  <Button size="sm" onClick={handleSendNow}>Send Now</Button>
                </>
              )}
              {isActive && (
                <Button size="sm" variant="destructive" onClick={handleAbort}>Abort</Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats (only if sent) */}
      {totalSent > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">{totalSent.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Messages Sent</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">{totalResponses.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">
                Responses ({totalSent > 0 ? ((totalResponses / totalSent) * 100).toFixed(1) : 0}%)
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">{totalUnlocks.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">
                Unlocks ({totalSent > 0 ? ((totalUnlocks / totalSent) * 100).toFixed(1) : 0}%)
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="variants">
        <TabsList>
          <TabsTrigger value="variants">A/B Variants ({broadcast.variants?.length ?? 0})</TabsTrigger>
          {isDraft && <TabsTrigger value="schedule">Schedule</TabsTrigger>}
          <TabsTrigger value="targeting">Targeting</TabsTrigger>
        </TabsList>

        {/* Variants Tab */}
        <TabsContent value="variants">
          <div className="space-y-4 mt-4">
            {/* Existing variants */}
            {broadcast.variants && broadcast.variants.length > 0 ? (
              <div className="space-y-3">
                {broadcast.variants.map((variant) => {
                  const responseRate = variant.sendCount > 0 ? (variant.responseCount / variant.sendCount) * 100 : 0;
                  const unlockRate = variant.sendCount > 0 ? (variant.unlockCount / variant.sendCount) * 100 : 0;

                  return (
                    <Card key={variant.id}>
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">{variant.variantName}</p>
                              <Badge variant="outline" className="text-xs">{variant.weightPercent}%</Badge>
                            </div>

                            {variant.messageText && (
                              <div className="rounded-lg bg-muted p-3">
                                <p className="text-sm whitespace-pre-wrap">{variant.messageText}</p>
                              </div>
                            )}

                            {variant.sendCount > 0 && (
                              <div className="grid gap-3 sm:grid-cols-3 mt-2">
                                <div>
                                  <p className="text-xs text-muted-foreground">Sent</p>
                                  <p className="text-sm font-medium">{variant.sendCount.toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Response Rate</p>
                                  <p className="text-sm font-medium">{responseRate.toFixed(1)}%</p>
                                  <ProgressBar value={responseRate} max={100} className="mt-1" />
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Unlock Rate</p>
                                  <p className="text-sm font-medium">{unlockRate.toFixed(1)}%</p>
                                  <ProgressBar value={unlockRate} max={100} className="mt-1" />
                                </div>
                              </div>
                            )}
                          </div>

                          {isDraft && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive ml-2"
                              onClick={() => handleRemoveVariant(variant.id)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-sm text-muted-foreground">No variants yet. Add at least one variant below.</p>
              </div>
            )}

            {/* Add Variant Form (draft only) */}
            {isDraft && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add Variant</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Message Templates */}
                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">Message Templates</Label>
                    <div className="flex gap-2 flex-wrap">
                      {MESSAGE_TEMPLATES.map((tpl) => (
                        <Button
                          key={tpl.label}
                          variant="outline"
                          size="sm"
                          onClick={() => setNewVariant({
                            ...newVariant,
                            variantName: newVariant.variantName || tpl.label,
                            messageText: tpl.text,
                          })}
                        >
                          {tpl.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Variant Name</Label>
                      <Input
                        placeholder="e.g. Variant A"
                        value={newVariant.variantName}
                        onChange={(e) => setNewVariant({ ...newVariant, variantName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Weight (%)</Label>
                      <Input
                        type="number"
                        min={1}
                        max={100}
                        value={newVariant.weightPercent}
                        onChange={(e) => setNewVariant({ ...newVariant, weightPercent: parseInt(e.target.value) || 50 })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Message Text</Label>
                    <Textarea
                      placeholder="Write the message text for this variant..."
                      value={newVariant.messageText}
                      onChange={(e) => setNewVariant({ ...newVariant, messageText: e.target.value })}
                      rows={4}
                    />
                  </div>

                  {/* Preview */}
                  {newVariant.messageText && (
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">Preview</Label>
                      <div className="rounded-lg border bg-muted/50 p-4 max-w-sm">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/20 shrink-0" />
                          <div className="rounded-lg bg-background p-3 shadow-sm">
                            <p className="text-sm whitespace-pre-wrap">{newVariant.messageText}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleAddVariant}
                    disabled={addingVariant || !newVariant.variantName.trim() || !newVariant.messageText.trim()}
                  >
                    {addingVariant ? "Adding..." : "Add Variant"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Schedule Tab */}
        {isDraft && (
          <TabsContent value="schedule">
            <div className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Schedule Broadcast</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Time</Label>
                      <Input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleSchedule}
                      disabled={scheduling || !scheduleDate || !scheduleTime || (broadcast.variants?.length ?? 0) === 0}
                    >
                      {scheduling ? "Scheduling..." : "Schedule"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleSendNow}
                      disabled={(broadcast.variants?.length ?? 0) === 0}
                    >
                      Send Immediately
                    </Button>
                  </div>

                  {(broadcast.variants?.length ?? 0) === 0 && (
                    <p className="text-xs text-muted-foreground">Add at least one variant before scheduling.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}

        {/* Targeting Tab */}
        <TabsContent value="targeting">
          <div className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Targeting</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Estimated Recipients</span>
                  <span className="text-sm font-medium">{broadcast.estimatedRecipients.toLocaleString()}</span>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Target Query</p>
                  <div className="rounded-lg bg-muted p-3 font-mono text-xs overflow-auto">
                    {(() => {
                      try {
                        return JSON.stringify(JSON.parse(broadcast.targetingQueryJson), null, 2);
                      } catch {
                        return broadcast.targetingQueryJson || "{}";
                      }
                    })()}
                  </div>
                </div>
                {isDraft && (
                  <Link href="/segments">
                    <Button variant="outline" size="sm">Edit in Segment Builder</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
    </AppShell>
  );
}
