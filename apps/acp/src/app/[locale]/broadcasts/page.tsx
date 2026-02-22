"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppShell } from "@/components/app-shell";

interface BroadcastVariant {
  id: string;
  variantName: string;
  sendCount: number;
  responseCount: number;
  unlockCount: number;
  weightPercent: number;
}

interface Broadcast {
  id: string;
  name: string;
  status: "Draft" | "Scheduled" | "Sending" | "Completed" | "Aborted";
  estimatedRecipients: number;
  scheduledAt?: string;
  completedAt?: string;
  isDryRun: boolean;
  createdAt: string;
  variants: BroadcastVariant[];
}

interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export default function BroadcastsPage() {
  const { client, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "broadcasts"],
    queryFn: () => client.get<PaginatedResult<Broadcast>>("/broadcasts?page=1&pageSize=50"),
    enabled: isAuthenticated,
  });

  const items = data?.success ? data.data?.data ?? [] : [];

  async function handleCreate() {
    if (!name.trim()) return;
    await client.post("/broadcasts", {
      name,
      targetingQueryJson: "{}",
      senderProfileId: "00000000-0000-0000-0000-000000000000",
      isDryRun: false,
    });
    setName("");
    queryClient.invalidateQueries({ queryKey: ["admin", "broadcasts"] });
  }

  async function handleAbort(id: string) {
    await client.post(`/broadcasts/${id}/abort`);
    queryClient.invalidateQueries({ queryKey: ["admin", "broadcasts"] });
  }

  function statusVariant(status: string) {
    switch (status) {
      case "Sending": return "default" as const;
      case "Completed": return "secondary" as const;
      case "Scheduled": return "warning" as const;
      case "Aborted": return "destructive" as const;
      default: return "outline" as const;
    }
  }

  return (
    <AppShell>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Broadcasts</h1>
        <div className="flex gap-2">
          <Input
            placeholder="New broadcast name..."
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
        <div className="rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-3 text-left font-medium">Name</th>
                <th className="p-3 text-left font-medium">Status</th>
                <th className="p-3 text-right font-medium">Recipients</th>
                <th className="p-3 text-right font-medium">Variants</th>
                <th className="p-3 text-left font-medium">Created</th>
                <th className="p-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((bc) => (
                <tr key={bc.id} className="border-b last:border-0">
                  <td className="p-3 font-medium">
                    <Link href={`/broadcasts/${bc.id}`} className="text-primary hover:underline">
                      {bc.name}
                    </Link>
                    {bc.isDryRun && <Badge variant="outline" className="ml-2">Dry Run</Badge>}
                  </td>
                  <td className="p-3">
                    <Badge variant={statusVariant(bc.status)}>{bc.status}</Badge>
                  </td>
                  <td className="p-3 text-right">{bc.estimatedRecipients.toLocaleString()}</td>
                  <td className="p-3 text-right">{bc.variants?.length ?? 0}</td>
                  <td className="p-3 text-muted-foreground">{new Date(bc.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Link href={`/broadcasts/${bc.id}`}>
                        <Button variant="outline" size="sm">Details</Button>
                      </Link>
                      {(bc.status === "Scheduled" || bc.status === "Sending") && (
                        <Button size="sm" variant="destructive" onClick={() => handleAbort(bc.id)}>Abort</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No broadcasts yet.</p>
        </div>
      )}
    </div>
    </AppShell>
  );
}
