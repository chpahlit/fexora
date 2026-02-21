"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    queryFn: () => client.get<AuditLog[]>(`/admin/audit-logs?search=${encodeURIComponent(auditSearch)}&page=1&pageSize=50`),
  });

  const reports = reportsData?.success ? reportsData.data ?? [] : [];
  const auditLogs = auditData?.success ? auditData.data ?? [] : [];

  async function handleReport(id: string, action: "remove" | "warn" | "block" | "dismiss") {
    await client.post(`/admin/reports/${id}/${action}`);
    queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
  }

  function categoryVariant(category: string) {
    switch (category) {
      case "spam": return "secondary" as const;
      case "harassment": return "destructive" as const;
      case "illegal": return "destructive" as const;
      default: return "warning" as const;
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Risk & Trust</h1>

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
                            <Badge variant={categoryVariant(report.category)}>{report.category}</Badge>
                            <Badge variant="outline">{report.targetType}</Badge>
                          </div>
                          <p className="text-sm mt-2">
                            <span className="font-medium">{report.reporterUsername}</span>
                            {" reported "}
                            <span className="font-medium">{report.targetUsername}</span>
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">{report.reason}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(report.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {report.status === "open" && (
                          <div className="flex flex-col gap-1">
                            <Button size="sm" variant="destructive" onClick={() => handleReport(report.id, "remove")}>
                              Remove Content
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleReport(report.id, "warn")}>
                              Warn User
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleReport(report.id, "block")}>
                              Block User
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleReport(report.id, "dismiss")}>
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
                <p className="text-muted-foreground">No {reportFilter} reports</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="audit">
          <div className="mt-4 space-y-4">
            <Input
              placeholder="Search audit logs..."
              value={auditSearch}
              onChange={(e) => setAuditSearch(e.target.value)}
              className="max-w-sm"
            />

            <div className="rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">Actor</th>
                    <th className="px-4 py-3 text-left font-medium">Action</th>
                    <th className="px-4 py-3 text-left font-medium">Entity</th>
                    <th className="px-4 py-3 text-left font-medium">IP</th>
                    <th className="px-4 py-3 text-left font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="border-b">
                      <td className="px-4 py-3 font-medium">{log.actor}</td>
                      <td className="px-4 py-3">{log.action}</td>
                      <td className="px-4 py-3">
                        <span className="text-muted-foreground">{log.entityType}</span>
                        <span className="text-xs ml-1">#{log.entityId.slice(0, 8)}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{log.ipAddress}</td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                  {auditLogs.length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No audit logs</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
