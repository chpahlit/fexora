"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth";
import { useMyContent } from "@fexora/api-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ScheduledContent {
  id: string;
  contentId: string;
  contentTitle: string;
  scheduledAt: string;
  status: "Planned" | "Published" | "Cancelled";
}

function SchedulingContent() {
  const t = useTranslations();
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [selectedContentId, setSelectedContentId] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");

  const { data: contentData } = useMyContent({ page: 1, pageSize: 100 });
  const contents = contentData?.success ? contentData.data?.data ?? [] : [];
  const approvedContents = contents.filter((c) => c.status === "Approved");

  const { data: scheduledData } = useQuery({
    queryKey: ["creator", "scheduled"],
    queryFn: () => client.get<ScheduledContent[]>("/content/scheduled"),
  });
  const scheduled = scheduledData?.success ? scheduledData.data ?? [] : [];

  async function handleSchedule() {
    if (!selectedContentId || !scheduledDate) return;
    await client.post(`/content/${selectedContentId}/schedule`, {
      scheduledAt: new Date(scheduledDate).toISOString(),
    });
    queryClient.invalidateQueries({ queryKey: ["creator", "scheduled"] });
    setSelectedContentId("");
    setScheduledDate("");
  }

  async function handleCancel(id: string) {
    await client.post(`/content/scheduled/${id}/cancel`);
    queryClient.invalidateQueries({ queryKey: ["creator", "scheduled"] });
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Content Scheduling</h1>

      <Card>
        <CardHeader>
          <CardTitle>Schedule a Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Content</label>
            <select
              value={selectedContentId}
              onChange={(e) => setSelectedContentId(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="">Choose approved content...</option>
              {approvedContents.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Publish Date & Time</label>
            <Input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
          <Button onClick={handleSchedule} disabled={!selectedContentId || !scheduledDate}>
            Schedule
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="font-semibold">Scheduled Posts</h2>
        {scheduled.length > 0 ? (
          scheduled.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{item.contentTitle}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.scheduledAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      item.status === "Published"
                        ? "success"
                        : item.status === "Cancelled"
                          ? "secondary"
                          : "warning"
                    }
                  >
                    {item.status}
                  </Badge>
                  {item.status === "Planned" && (
                    <Button variant="ghost" size="sm" onClick={() => handleCancel(item.id)}>
                      {t("common.cancel")}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">No scheduled posts</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SchedulingPage() {
  return (
    <ProtectedRoute roles={["Creator", "Admin"]}>
      <SchedulingContent />
    </ProtectedRoute>
  );
}
