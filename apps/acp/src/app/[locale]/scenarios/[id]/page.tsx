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
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { AppShell } from "@/components/app-shell";

interface ScenarioStep {
  id: string;
  stepOrder: number;
  dayOffset: number;
  timeOffsetMinutes: number;
  actionType: string;
  senderProfileId?: string;
  templateId?: string;
}

interface Scenario {
  id: string;
  name: string;
  description?: string;
  status: string;
  priority: number;
  steps: ScenarioStep[];
}

const ACTION_TYPES = [
  { value: "Visit", label: "Profile Visit", icon: "\u{1F440}", color: "bg-blue-500" },
  { value: "Message", label: "Send Message", icon: "\u{1F4AC}", color: "bg-primary" },
  { value: "Follow", label: "Follow User", icon: "\u2795", color: "bg-green-500" },
  { value: "Like", label: "Like Content", icon: "\u2764\uFE0F", color: "bg-pink-500" },
];

const TEMPLATES = [
  { label: "Welcome", value: "welcome" },
  { label: "Follow-up", value: "followup" },
  { label: "Promotion", value: "promo" },
  { label: "Re-engagement", value: "reengage" },
  { label: "Custom", value: "custom" },
];

function statusVariant(status: string) {
  switch (status) {
    case "Active": return "default" as const;
    case "Draft": return "secondary" as const;
    case "Paused": return "warning" as const;
    case "Archived": return "outline" as const;
    default: return "secondary" as const;
  }
}

function formatTime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

export default function ScenarioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { client, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const [editingMeta, setEditingMeta] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editPriority, setEditPriority] = useState(0);
  const [savingMeta, setSavingMeta] = useState(false);

  const [newStep, setNewStep] = useState({
    dayOffset: 0,
    timeOffsetMinutes: 0,
    actionType: "Message",
    templateId: "",
  });
  const [addingStep, setAddingStep] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "scenarios", id],
    queryFn: () => client.get<Scenario>(`/scenarios/${id}`),
    enabled: isAuthenticated && !!id,
  });

  const scenario = data?.success ? data.data : null;

  function startEditMeta() {
    if (!scenario) return;
    setEditName(scenario.name);
    setEditDesc(scenario.description ?? "");
    setEditPriority(scenario.priority);
    setEditingMeta(true);
  }

  async function saveMeta() {
    setSavingMeta(true);
    try {
      await client.patch(`/scenarios/${id}`, {
        name: editName,
        description: editDesc || null,
        priority: editPriority,
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "scenarios", id] });
      setEditingMeta(false);
    } finally {
      setSavingMeta(false);
    }
  }

  async function handleAddStep() {
    setAddingStep(true);
    try {
      await client.post(`/scenarios/${id}/steps`, {
        dayOffset: newStep.dayOffset,
        timeOffsetMinutes: newStep.timeOffsetMinutes,
        actionType: newStep.actionType,
        templateId: newStep.templateId || null,
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "scenarios", id] });
      setNewStep({ dayOffset: 0, timeOffsetMinutes: 0, actionType: "Message", templateId: "" });
    } finally {
      setAddingStep(false);
    }
  }

  async function handleRemoveStep(stepId: string) {
    await client.delete(`/scenarios/steps/${stepId}`);
    queryClient.invalidateQueries({ queryKey: ["admin", "scenarios", id] });
  }

  async function handleAction(action: string) {
    await client.post(`/scenarios/${id}/${action}`);
    queryClient.invalidateQueries({ queryKey: ["admin", "scenarios", id] });
    queryClient.invalidateQueries({ queryKey: ["admin", "scenarios"] });
  }

  if (isLoading) {
    return (
      <AppShell>
        <div className="space-y-6">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="h-64 animate-pulse rounded-lg bg-muted" />
          <div className="h-48 animate-pulse rounded-lg bg-muted" />
        </div>
      </AppShell>
    );
  }

  if (!scenario) {
    return (
      <AppShell>
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">Scenario not found.</p>
          <Link href="/scenarios">
            <Button variant="outline" className="mt-4">Back to Scenarios</Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  const sortedSteps = [...scenario.steps].sort((a, b) => {
    const dayDiff = a.dayOffset - b.dayOffset;
    if (dayDiff !== 0) return dayDiff;
    return a.timeOffsetMinutes - b.timeOffsetMinutes;
  });

  const actionMeta = (type: string) => ACTION_TYPES.find((a) => a.value === type) ?? ACTION_TYPES[0];

  return (
    <AppShell>
      <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/orchestrator" className="hover:text-foreground">Orchestrator</Link>
        <span>/</span>
        <Link href="/scenarios" className="hover:text-foreground">Scenarios</Link>
        <span>/</span>
        <span className="text-foreground">{scenario.name}</span>
      </div>

      {/* Header */}
      <Card>
        <CardContent className="pt-6">
          {editingMeta ? (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={editPriority}
                    onChange={(e) => setEditPriority(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Describe the purpose of this scenario..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={saveMeta} disabled={savingMeta || !editName.trim()}>
                  {savingMeta ? "Saving..." : "Save"}
                </Button>
                <Button variant="ghost" onClick={() => setEditingMeta(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">{scenario.name}</h1>
                  <Badge variant={statusVariant(scenario.status)}>{scenario.status}</Badge>
                </div>
                {scenario.description && (
                  <p className="text-sm text-muted-foreground">{scenario.description}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Priority: {scenario.priority} &middot; {scenario.steps.length} steps
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={startEditMeta}>Edit</Button>
                {scenario.status === "Draft" && (
                  <Button size="sm" onClick={() => handleAction("activate")}>Activate</Button>
                )}
                {scenario.status === "Active" && (
                  <Button size="sm" variant="secondary" onClick={() => handleAction("pause")}>Pause</Button>
                )}
                {scenario.status === "Paused" && (
                  <Button size="sm" onClick={() => handleAction("activate")}>Resume</Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Visual Timeline */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg">Steps Timeline</CardTitle>
          <span className="text-xs text-muted-foreground">{sortedSteps.length} steps</span>
        </CardHeader>
        <CardContent>
          {sortedSteps.length > 0 ? (
            <div className="relative">
              {/* Timeline line */}
              {sortedSteps.length > 1 && (
                <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-border" />
              )}

              <div className="space-y-4">
                {sortedSteps.map((step, i) => {
                  const meta = actionMeta(step.actionType);
                  return (
                    <div key={step.id} className="relative flex gap-4">
                      {/* Timeline node */}
                      <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white text-sm font-bold ${meta.color}`}>
                        {i + 1}
                      </div>

                      {/* Step content */}
                      <div className="flex-1 rounded-lg border p-3 hover:border-primary/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{meta.icon}</span>
                              <span className="text-sm font-medium">{meta.label}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Day {step.dayOffset} + {formatTime(step.timeOffsetMinutes)}
                              {step.templateId && (
                                <span className="ml-2">
                                  Template: {TEMPLATES.find((t) => t.value === step.templateId)?.label ?? step.templateId.slice(0, 8)}
                                </span>
                              )}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleRemoveStep(step.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-sm text-muted-foreground">No steps yet. Add your first step below.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Step Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add Step</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick templates */}
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Quick Start Templates</Label>
            <div className="flex gap-2 flex-wrap">
              {[
                { label: "Day 0: Welcome Message", dayOffset: 0, timeOffsetMinutes: 0, actionType: "Message", templateId: "welcome" },
                { label: "Day 1: Profile Visit", dayOffset: 1, timeOffsetMinutes: 0, actionType: "Visit", templateId: "" },
                { label: "Day 1: Follow", dayOffset: 1, timeOffsetMinutes: 60, actionType: "Follow", templateId: "" },
                { label: "Day 3: Follow-up", dayOffset: 3, timeOffsetMinutes: 0, actionType: "Message", templateId: "followup" },
                { label: "Day 7: Re-engage", dayOffset: 7, timeOffsetMinutes: 0, actionType: "Message", templateId: "reengage" },
              ].map((tpl) => (
                <Button
                  key={tpl.label}
                  variant="outline"
                  size="sm"
                  onClick={() => setNewStep({
                    dayOffset: tpl.dayOffset,
                    timeOffsetMinutes: tpl.timeOffsetMinutes,
                    actionType: tpl.actionType,
                    templateId: tpl.templateId,
                  })}
                >
                  {tpl.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Day Offset</Label>
              <Input
                type="number"
                min={0}
                value={newStep.dayOffset}
                onChange={(e) => setNewStep({ ...newStep, dayOffset: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label>Time Offset (min)</Label>
              <Input
                type="number"
                min={0}
                value={newStep.timeOffsetMinutes}
                onChange={(e) => setNewStep({ ...newStep, timeOffsetMinutes: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label>Action Type</Label>
              <Select
                value={newStep.actionType}
                onChange={(e) => setNewStep({ ...newStep, actionType: e.target.value })}
              >
                {ACTION_TYPES.map((a) => (
                  <option key={a.value} value={a.value}>{a.icon} {a.label}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Template</Label>
              <Select
                value={newStep.templateId}
                onChange={(e) => setNewStep({ ...newStep, templateId: e.target.value })}
              >
                <option value="">None</option>
                {TEMPLATES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </Select>
            </div>
          </div>

          <Button onClick={handleAddStep} disabled={addingStep}>
            {addingStep ? "Adding..." : "Add Step"}
          </Button>
        </CardContent>
      </Card>
    </div>
    </AppShell>
  );
}
