"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth";
import { useMyContent } from "@fexora/api-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Link } from "@/i18n/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ListSkeleton } from "@/components/ui/page-skeleton";
import type { ContentResponse } from "@fexora/api-client";

export default function CreatorContentPage() {
  return (
    <ProtectedRoute roles={["Creator", "Admin"]}>
      <ContentManagerContent />
    </ProtectedRoute>
  );
}

function ContentManagerContent() {
  const t = useTranslations();
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pinning, setPinning] = useState<string | null>(null);

  const { data: contentData, isLoading } = useMyContent({ page, pageSize: 20 });
  const allContents = contentData?.success ? contentData.data?.data ?? [] : [];
  const total = contentData?.success ? contentData.data?.total ?? 0 : 0;
  const totalPages = Math.ceil(total / 20) || 1;

  const contents = statusFilter === "all"
    ? allContents
    : allContents.filter((c) => c.status.toLowerCase() === statusFilter);

  const { data: pinnedData } = useQuery({
    queryKey: ["creator", "pinned"],
    queryFn: () => client.get<ContentResponse[]>("/creator/content/pinned"),
  });
  const pinnedIds = new Set((pinnedData?.success ? pinnedData.data ?? [] : []).map((c) => c.id));

  async function handleTogglePin(contentId: string) {
    setPinning(contentId);
    const isPinned = pinnedIds.has(contentId);
    if (isPinned) {
      await client.delete(`/content/${contentId}/pin`);
    } else {
      await client.post(`/content/${contentId}/pin`);
    }
    queryClient.invalidateQueries({ queryKey: ["creator", "pinned"] });
    setPinning(null);
  }

  async function handleDelete(contentId: string) {
    await client.delete(`/content/${contentId}`);
    queryClient.invalidateQueries({ queryKey: ["my-content"] });
  }

  const statusCounts = {
    all: allContents.length,
    approved: allContents.filter((c) => c.status === "Approved").length,
    pending: allContents.filter((c) => c.status === "Pending").length,
    draft: allContents.filter((c) => c.status === "Draft").length,
    rejected: allContents.filter((c) => c.status === "Rejected").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Content Manager</h1>
        <div className="flex gap-2">
          <Link href="/creator/scheduling" className={cn(buttonVariants({ variant: "outline" }))}>
            Schedule
          </Link>
          <Link href="/upload" className={cn(buttonVariants())}>
            Upload
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold">{total}</p>
            <p className="text-xs text-muted-foreground">Total Content</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold text-green-500">{statusCounts.approved}</p>
            <p className="text-xs text-muted-foreground">Published</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold text-yellow-500">{statusCounts.pending}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold">{statusCounts.draft}</p>
            <p className="text-xs text-muted-foreground">Drafts</p>
          </CardContent>
        </Card>
      </div>

      <Input
        placeholder="Search your content..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      <Tabs defaultValue="all" value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
        <TabsList>
          <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
          <TabsTrigger value="approved">Published ({statusCounts.approved})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({statusCounts.pending})</TabsTrigger>
          <TabsTrigger value="draft">Drafts ({statusCounts.draft})</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <ListSkeleton count={5} />
      ) : (
        <div className="space-y-2">
          {contents
            .filter((c) => !search || c.title.toLowerCase().includes(search.toLowerCase()))
            .map((content) => (
              <Card key={content.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {content.coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={content.coverUrl} alt="" className="h-14 w-14 rounded object-cover shrink-0" />
                    ) : (
                      <div className="h-14 w-14 rounded bg-muted flex items-center justify-center text-xs shrink-0">
                        {content.type}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{content.title}</p>
                        {pinnedIds.has(content.id) && <Badge variant="default" className="text-[10px]">Pinned</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {content.priceCredits > 0 ? `${content.priceCredits} coins` : "Free"}
                        {" · "}{new Date(content.createdAt).toLocaleDateString()}
                        {" · "}♡ {content.likeCount ?? 0} · 💬 {content.commentCount ?? 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant={
                        content.status === "Approved" ? "success"
                          : content.status === "Pending" ? "warning"
                            : content.status === "Rejected" ? "destructive"
                              : "secondary"
                      }
                    >
                      {content.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTogglePin(content.id)}
                      disabled={pinning === content.id}
                    >
                      {pinnedIds.has(content.id) ? "Unpin" : "Pin"}
                    </Button>
                    <Link href={`/content/${content.id}`} className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
                      View
                    </Link>
                    {content.status === "Draft" && (
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(content.id)}>
                        Delete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          {contents.length === 0 && (
            <div className="rounded-lg border border-dashed p-12 text-center">
              <p className="text-muted-foreground">No content in this category</p>
            </div>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}>Prev</Button>
          <span className="text-sm py-2">{page} / {totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages}>Next</Button>
        </div>
      )}
    </div>
  );
}
