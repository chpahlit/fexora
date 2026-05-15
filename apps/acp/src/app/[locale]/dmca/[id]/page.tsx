"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppShell } from "@/components/app-shell";

interface DmcaReport {
  id: string;
  reporterId: string;
  contentId: string;
  originalUrl: string;
  description: string;
  evidenceUrlsJson?: string;
  status: "Pending" | "Reviewing" | "TakenDown" | "Rejected";
  reviewedById?: string;
  reviewComment?: string;
  createdAt: string;
  reviewedAt?: string;
}

export default function DmcaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { client, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "dmca", id],
    queryFn: () => client.get<DmcaReport>(`/dmca/${id}`),
    enabled: isAuthenticated && !!id,
  });

  const report = data?.success ? data.data : null;

  async function handleReview(approve: boolean) {
    setIsSubmitting(true);
    try {
      await client.post(`/dmca/${id}/review`, {
        approve,
        comment: comment || null,
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "dmca"] });
      router.push("/dmca");
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false);
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

  let evidenceUrls: string[] = [];
  if (report?.evidenceUrlsJson) {
    try {
      evidenceUrls = JSON.parse(report.evidenceUrlsJson);
    } catch {
      // invalid JSON
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">DMCA report not found.</p>
      </div>
    );
  }

  return (
    <AppShell>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">DMCA Report</h1>
        <Badge variant={statusVariant(report.status)}>{report.status}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Report Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Report ID
              </p>
              <p className="font-mono text-sm">{report.id}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Reporter ID
              </p>
              <p className="font-mono text-sm">{report.reporterId}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Content ID
              </p>
              <p className="font-mono text-sm">{report.contentId}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Submitted
              </p>
              <p className="text-sm">
                {new Date(report.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Original URL
            </p>
            <a
              href={report.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline break-all"
            >
              {report.originalUrl}
            </a>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Description
            </p>
            <p className="text-sm whitespace-pre-wrap">{report.description}</p>
          </div>

          {evidenceUrls.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Evidence URLs
              </p>
              <ul className="list-disc pl-4 space-y-1">
                {evidenceUrls.map((url, i) => (
                  <li key={i}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline break-all"
                    >
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {report.reviewedAt && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Reviewed By
                </p>
                <p className="font-mono text-sm">
                  {report.reviewedById ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Reviewed At
                </p>
                <p className="text-sm">
                  {new Date(report.reviewedAt).toLocaleString()}
                </p>
              </div>
            </div>
            {report.reviewComment && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Comment
                </p>
                <p className="text-sm whitespace-pre-wrap">
                  {report.reviewComment}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {report.status === "Pending" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Review Action</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="comment">Comment (optional)</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a review comment..."
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleReview(true)}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Approve Takedown"}
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleReview(false)}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Reject Report"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
    </AppShell>
  );
}
