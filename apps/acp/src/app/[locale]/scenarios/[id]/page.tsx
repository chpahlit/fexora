"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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
  steps: ScenarioStep[];
}

export default function ScenarioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { client, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [newStep, setNewStep] = useState({
    dayOffset: 0,
    timeOffsetMinutes: 0,
    actionType: "Message",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "scenarios", id],
    queryFn: () => client.get<Scenario>(`/scenarios/${id}`),
    enabled: isAuthenticated && !!id,
  });

  const scenario = data?.success ? data.data : null;

  async function handleAddStep() {
    await client.post(`/scenarios/${id}/steps`, {
      dayOffset: newStep.dayOffset,
      timeOffsetMinutes: newStep.timeOffsetMinutes,
      actionType: newStep.actionType,
    });
    queryClient.invalidateQueries({ queryKey: ["admin", "scenarios", id] });
  }

  async function handleRemoveStep(stepId: string) {
    await client.delete(`/scenarios/steps/${stepId}`);
    queryClient.invalidateQueries({ queryKey: ["admin", "scenarios", id] });
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!scenario) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">Scenario not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{scenario.name}</h1>
          {scenario.description && (
            <p className="text-sm text-muted-foreground mt-1">{scenario.description}</p>
          )}
        </div>
        <Badge>{scenario.status}</Badge>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Steps Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {scenario.steps.length > 0 ? (
            <div className="space-y-3">
              {scenario.steps.map((step, i) => (
                <div key={step.id} className="flex items-center gap-4 p-3 rounded-lg border">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Day {step.dayOffset} + {step.timeOffsetMinutes}min
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {step.actionType}
                      {step.templateId && ` (Template: ${step.templateId.slice(0, 8)}...)`}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveStep(step.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No steps yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Add Step */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add Step</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
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
                <option value="Visit">Visit</option>
                <option value="Message">Message</option>
                <option value="Follow">Follow</option>
                <option value="Like">Like</option>
              </Select>
            </div>
          </div>
          <Button onClick={handleAddStep}>Add Step</Button>
        </CardContent>
      </Card>
    </div>
  );
}
