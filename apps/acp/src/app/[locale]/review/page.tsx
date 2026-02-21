"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import type { ApiResponse, PaginatedResponse } from "@fexora/shared";
import { useQuery } from "@tanstack/react-query";
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
  const t = useTranslations();
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
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Content Review Queue</h1>
          <Badge variant="secondary">{items.length} items</Badge>
        </div>

        <Tabs defaultValue="pending" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="Pending">Pending</TabsTrigger>
            <TabsTrigger value="Approved">Approved</TabsTrigger>
            <TabsTrigger value="Rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : items.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
                {items.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
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
                    <CardContent>
                      {item.coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.coverUrl}
                          alt={item.title}
                          className="aspect-video w-full rounded-md object-cover"
                        />
                      ) : (
                        <div className="aspect-video w-full rounded-md bg-muted flex items-center justify-center text-sm text-muted-foreground">
                          {item.type}
                        </div>
                      )}
                      <div className="mt-2 text-xs text-muted-foreground space-y-1">
                        <p>Creator: {item.ownerUsername ?? item.ownerId}</p>
                        <p>Type: {item.type}</p>
                        <p>Price: {item.priceCredits} coins</p>
                        <p>
                          Submitted:{" "}
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                    {item.status === "Pending" && (
                      <CardFooter className="gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAction(item.id, "approve")}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
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
                <p className="text-muted-foreground">
                  No {activeTab.toLowerCase()} content to review
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
