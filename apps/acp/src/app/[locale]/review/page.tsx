"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import type { PaginatedResponse } from "@fexora/shared";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ContentItem {
  id: string;
  title: string;
  type: string;
  status: string;
  ownerId: string;
  ownerUsername?: string;
  coverUrl?: string;
  priceCredits: number;
  createdAt: string;
}

export default function ReviewQueuePage() {
  const { client, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("pending");

  const { data: pendingData, isLoading } = useQuery({
    queryKey: ["admin", "review", activeTab],
    queryFn: async () => {
      const res = await client.get<PaginatedResponse<ContentItem>>(
        `/admin/content?status=${activeTab}&page=1&pageSize=50`
      );
      return res;
    },
    enabled: isAuthenticated,
  });

  async function handleAction(contentId: string, action: "approve" | "reject") {
    try {
      await client.post(`/admin/content/${contentId}/${action}`);
      queryClient.invalidateQueries({ queryKey: ["admin", "review"] });
    } catch {
      // Ignore
    }
  }

  const items = pendingData?.success ? pendingData.data?.data ?? [] : [];

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Content Review Queue</h1>
            <p className="text-sm text-muted-foreground">Review and moderate submitted content</p>
          </div>
          <Badge variant="secondary">{items.length} items</Badge>
        </div>

        <Tabs defaultValue="pending" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : items.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
                {items.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    {item.coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.coverUrl}
                        alt={item.title}
                        className="aspect-video w-full object-cover"
                      />
                    ) : (
                      <div className="aspect-video w-full bg-muted flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm truncate">
                          {item.title}
                        </CardTitle>
                        <Badge
                          variant={
                            item.status === "Pending"
                              ? "warning"
                              : item.status === "Approved"
                                ? "success"
                                : "destructive"
                          }
                        >
                          {item.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div className="flex justify-between">
                          <span>Creator</span>
                          <span className="font-medium text-foreground">{item.ownerUsername ?? item.ownerId.slice(0, 8)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Type</span>
                          <Badge variant="outline" className="text-[10px]">{item.type}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Price</span>
                          <span className="font-mono">{item.priceCredits} coins</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Submitted</span>
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                    {item.status === "Pending" && (
                      <CardFooter className="gap-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleAction(item.id, "approve")}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1"
                          onClick={() => handleAction(item.id, "reject")}
                        >
                          Reject
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-12 text-center mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2 text-muted-foreground"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <p className="text-muted-foreground">
                  No {activeTab} content to review
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
