"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppShell } from "@/components/app-shell";

interface DmcaReport {
  id: string;
  reporterId: string;
  contentId: string;
  originalUrl: string;
  description: string;
  status: "Pending" | "Reviewing" | "TakenDown" | "Rejected";
  reviewedById?: string;
  reviewComment?: string;
  createdAt: string;
  reviewedAt?: string;
}

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export default function DmcaListPage() {
  const { client, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("Pending");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "dmca", activeTab],
    queryFn: () =>
      client.get<PaginatedResult<DmcaReport>>(
        `/dmca?status=${activeTab}&page=1&pageSize=50`
      ),
    enabled: isAuthenticated,
  });

  const items = data?.success ? data.data?.data ?? [] : [];

  async function handleQuickReview(id: string, approve: boolean) {
    try {
      await client.post(`/dmca/${id}/review`, { approve, comment: null });
      queryClient.invalidateQueries({ queryKey: ["admin", "dmca"] });
    } catch {
      // ignore
    }
  }

  function statusVariant(status: string) {
    switch (status) {
      case "Pending":
        return "warning" as const;
      case "Reviewing":
        return "secondary" as const;
      case "TakenDown":
        return "destructive" as const;
      case "Rejected":
        return "outline" as const;
      default:
        return "secondary" as const;
    }
  }

  return (
    <AppShell>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">DMCA Reports</h1>
        <Badge variant="secondary">{items.length} reports</Badge>
      </div>

      <Tabs defaultValue="Pending" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="Pending">Pending</TabsTrigger>
          <TabsTrigger value="Reviewing">Reviewing</TabsTrigger>
          <TabsTrigger value="TakenDown">Taken Down</TabsTrigger>
          <TabsTrigger value="Rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : items.length > 0 ? (
            <div className="rounded-lg border mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left font-medium">ID</th>
                    <th className="p-3 text-left font-medium">Content</th>
                    <th className="p-3 text-left font-medium">Original URL</th>
                    <th className="p-3 text-left font-medium">Status</th>
                    <th className="p-3 text-left font-medium">Submitted</th>
                    <th className="p-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((report) => (
                    <tr key={report.id} className="border-b last:border-0">
                      <td className="p-3">
                        <Link
                          href={`/dmca/${report.id}`}
                          className="text-primary hover:underline font-mono text-xs"
                        >
                          {report.id.slice(0, 8)}...
                        </Link>
                      </td>
                      <td className="p-3 font-mono text-xs">
                        {report.contentId.slice(0, 8)}...
                      </td>
                      <td className="p-3 max-w-[200px] truncate">
                        <a
                          href={report.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-xs"
                        >
                          {report.originalUrl}
                        </a>
                      </td>
                      <td className="p-3">
                        <Badge variant={statusVariant(report.status)}>
                          {report.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Link href={`/dmca/${report.id}`}>
                            <Button variant="outline" size="sm">
                              Details
                            </Button>
                          </Link>
                          {report.status === "Pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleQuickReview(report.id, true)
                                }
                              >
                                Takedown
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  handleQuickReview(report.id, false)
                                }
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-12 text-center mt-4">
              <p className="text-muted-foreground">
                No {activeTab.toLowerCase()} DMCA reports
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
    </AppShell>
  );
}
