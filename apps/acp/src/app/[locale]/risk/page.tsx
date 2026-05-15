"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Report {
  id: string;
  reporterUsername: string;
  targetType: "content" | "comment" | "chat" | "profile";
  targetId: string;
  targetUsername: string;
  reason: string;
  category: string;
  status: "open" | "resolved" | "dismissed";
  createdAt: string;
}

interface AuditLog {
  id: string;
  actor: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

export default function RiskTrustPage() {
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [reportFilter, setReportFilter] = useState("open");
  const [auditSearch, setAuditSearch] = useState("");

  const { data: reportsData } = useQuery({
    queryKey: ["admin", "reports", reportFilter],
    queryFn: () => client.get<Report[]>(`/admin/reports?status=${reportFilter}`),
  });

  const { data: auditData } = useQuery({
    queryKey: ["admin", "audit-logs", auditSearch],
    queryFn: () =>
      client.get<AuditLog[]>(
        `/admin/audit-logs?search=${encodeURIComponent(auditSearch)}&page=1&pageSize=50`
      ),
  });

  const reports = reportsData?.success ? reportsData.data ?? [] : [];
  const auditLogs = auditData?.success ? auditData.data ?? [] : [];

  async function handleReport(
    id: string,
    action: "remove" | "warn" | "block" | "dismiss"
  ) {
    await client.post(`/admin/reports/${id}/${action}`);
    queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
  }

  function categoryVariant(category: string) {
    switch (category) {
      case "spam":
        return "secondary" as const;
      case "harassment":
        return "destructive" as const;
      case "illegal":
        return "destructive" as const;
      default:
        return "warning" as const;
    }
  }

  function categoryIcon(category: string) {
    switch (category) {
      case "spam":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.73 18l-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
        );
      case "harassment":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
        );
    }
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Risk & Trust</h1>
          <p className="text-sm text-muted-foreground">
            User reports, content moderation, and audit trail
          </p>
        </div>

        <Tabs defaultValue="reports">
          <TabsList>
            <TabsTrigger value="reports">Reports ({reports.length})</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="reports">
            <div className="mt-4 space-y-4">
              <div className="flex gap-2">
                {["open", "resolved", "dismissed"].map((status) => (
                  <Button
                    key={status}
                    variant={reportFilter === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setReportFilter(status)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                    {status === "open" && reports.length > 0 && (
                      <Badge variant="destructive" className="ml-2 text-[10px] px-1.5">
                        {reports.length}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>

              {reports.length > 0 ? (
                <div className="space-y-3">
                  {reports.map((report) => (
                    <Card key={report.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              {categoryIcon(report.category)}
                              <Badge variant={categoryVariant(report.category)}>
                                {report.category}
                              </Badge>
                              <Badge variant="outline">{report.targetType}</Badge>
                            </div>
                            <p className="text-sm mt-2">
                              <span className="font-medium">
                                {report.reporterUsername}
                              </span>
                              {" reported "}
                              <span className="font-medium">
                                {report.targetUsername}
                              </span>
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {report.reason}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(report.createdAt).toLocaleString()}
                            </p>
                          </div>
                          {report.status === "open" && (
                            <div className="flex flex-col gap-1">
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  handleReport(report.id, "remove")
                                }
                              >
                                Remove Content
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReport(report.id, "warn")}
                              >
                                Warn User
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleReport(report.id, "block")
                                }
                              >
                                Block User
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  handleReport(report.id, "dismiss")
                                }
                              >
                                Dismiss
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2 text-muted-foreground"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <p className="text-muted-foreground">
                    No {reportFilter} reports
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="audit">
            <div className="mt-4 space-y-4">
              <Input
                placeholder="Search audit logs by actor, action, or entity..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                className="max-w-md"
              />

              <div className="rounded-lg border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left font-medium">Actor</th>
                      <th className="px-4 py-3 text-left font-medium">Action</th>
                      <th className="px-4 py-3 text-left font-medium">Entity</th>
                      <th className="px-4 py-3 text-left font-medium">Details</th>
                      <th className="px-4 py-3 text-left font-medium">IP</th>
                      <th className="px-4 py-3 text-left font-medium">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="border-b hover:bg-muted/30">
                        <td className="px-4 py-3 font-medium">{log.actor}</td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary">{log.action}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-muted-foreground">
                            {log.entityType}
                          </span>
                          <span className="text-xs ml-1 font-mono">
                            #{log.entityId.slice(0, 8)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground max-w-50 truncate">
                          {log.details}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">
                          {log.ipAddress}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    {auditLogs.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-8 text-center text-muted-foreground"
                        >
                          No audit logs
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
