"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AppShell } from "@/components/app-shell";

interface Scenario {
  id: string;
  name: string;
  description?: string;
  status: "Draft" | "Active" | "Paused" | "Archived";
  priority: number;
  createdAt: string;
  steps: { id: string; stepOrder: number; actionType: string; dayOffset: number }[];
}

interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export default function ScenariosPage() {
  const { client, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "scenarios"],
    queryFn: () => client.get<PaginatedResult<Scenario>>("/scenarios?page=1&pageSize=50"),
    enabled: isAuthenticated,
  });

  const items = data?.success ? data.data?.data ?? [] : [];

  async function handleCreate() {
    if (!name.trim()) return;
    await client.post("/scenarios", { name, description: null });
    setName("");
    queryClient.invalidateQueries({ queryKey: ["admin", "scenarios"] });
  }

  async function handleAction(id: string, action: string) {
    await client.post(`/scenarios/${id}/${action}`);
    queryClient.invalidateQueries({ queryKey: ["admin", "scenarios"] });
  }

  function statusVariant(status: string) {
    switch (status) {
      case "Active": return "default" as const;
      case "Draft": return "secondary" as const;
      case "Paused": return "warning" as const;
      case "Archived": return "outline" as const;
      default: return "secondary" as const;
    }
  }

  return (
    <AppShell>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Scenarios</h1>
        <div className="flex gap-2">
          <Input
            placeholder="New scenario name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-64"
          />
          <Button onClick={handleCreate} disabled={!name.trim()}>Create</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : items.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((scenario) => (
            <Card key={scenario.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{scenario.name}</CardTitle>
                  <Badge variant={statusVariant(scenario.status)}>{scenario.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>{scenario.steps?.length ?? 0} steps</p>
                  <p>Priority: {scenario.priority}</p>
                  <p>Created: {new Date(scenario.createdAt).toLocaleDateString()}</p>
                  {scenario.description && <p>{scenario.description}</p>}
                </div>
                <div className="flex gap-1 flex-wrap">
                  <Link href={`/scenarios/${scenario.id}`}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                  {scenario.status === "Draft" && (
                    <Button size="sm" onClick={() => handleAction(scenario.id, "activate")}>Activate</Button>
                  )}
                  {scenario.status === "Active" && (
                    <Button size="sm" variant="secondary" onClick={() => handleAction(scenario.id, "pause")}>Pause</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No scenarios yet. Create one above.</p>
        </div>
      )}
    </div>
    </AppShell>
  );
}
