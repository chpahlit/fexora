"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface AuditEntry {
  id: string;
  actorId: string;
  actorUsername?: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: string;
  ipAddress?: string;
  createdAt: string;
}

interface PaginatedResult<T> {
  data: T[];
  total: number;
}

const ACTION_COLORS: Record<string, string> = {
  impersonate: "destructive",
  send_message: "default",
  review_content: "secondary",
  approve_content: "default",
  reject_content: "destructive",
  assign_thread: "secondary",
  block_user: "destructive",
  unblock_user: "default",
};

export default function AuditPage() {
  const { client, isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState("all");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["mod", "audit", page, actionFilter, search],
    queryFn: () => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: "30",
      });
      if (actionFilter !== "all") params.set("action", actionFilter);
      if (search) params.set("search", search);
      return client.get<PaginatedResult<AuditEntry>>(
        `/audit?${params.toString()}`
      );
    },
    enabled: isAuthenticated,
  });

  const entries = data?.success ? data.data?.data ?? [] : [];
  const total = data?.success ? data.data?.total ?? 0 : 0;

  function formatTime(iso: string) {
    const d = new Date(iso);
    return `${d.toLocaleDateString("de-DE")} ${d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}`;
  }

  function getActionBadge(action: string) {
    const variant = ACTION_COLORS[action] ?? ("outline" as const);
    return (
      <Badge variant={variant as "default" | "destructive" | "secondary" | "outline"}>
        {action.replace(/_/g, " ")}
      </Badge>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Audit Log</h1>
        <div className="text-sm text-muted-foreground">{total} Einträge</div>
      </div>

      <div className="flex gap-3">
        <Input
          placeholder="Suche (Username, Entity ID...)"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-72"
        />
        <Select
          value={actionFilter}
          onChange={(e) => {
            setActionFilter(e.target.value);
            setPage(1);
          }}
          className="w-48"
        >
          <option value="all">Alle Aktionen</option>
          <option value="impersonate">Impersonation</option>
          <option value="send_message">Nachricht gesendet</option>
          <option value="review_content">Content Review</option>
          <option value="approve_content">Content Approved</option>
          <option value="reject_content">Content Rejected</option>
          <option value="assign_thread">Thread Assigned</option>
          <option value="block_user">User geblockt</option>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : entries.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">Zeitpunkt</th>
                    <th className="px-4 py-3 text-left font-medium">Moderator</th>
                    <th className="px-4 py-3 text-left font-medium">Aktion</th>
                    <th className="px-4 py-3 text-left font-medium">Entity</th>
                    <th className="px-4 py-3 text-left font-medium">Details</th>
                    <th className="px-4 py-3 text-left font-medium">IP</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
                        {formatTime(entry.createdAt)}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {entry.actorUsername ?? entry.actorId.slice(0, 8)}
                      </td>
                      <td className="px-4 py-3">{getActionBadge(entry.action)}</td>
                      <td className="px-4 py-3 text-xs">
                        <span className="text-muted-foreground">{entry.entityType}</span>{" "}
                        <span className="font-mono">{entry.entityId.slice(0, 8)}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground max-w-[200px] truncate">
                        {entry.details ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                        {entry.ipAddress ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">Keine Audit-Einträge gefunden.</p>
        </div>
      )}

      {total > 30 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Zurück
          </Button>
          <span className="text-sm text-muted-foreground">
            Seite {page} von {Math.ceil(total / 30)}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= Math.ceil(total / 30)}
            onClick={() => setPage((p) => p + 1)}
          >
            Weiter
          </Button>
        </div>
      )}
    </div>
  );
}
