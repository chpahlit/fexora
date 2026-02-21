"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CustomRequest {
  id: string;
  requesterId: string;
  requesterUsername: string;
  description: string;
  priceCoins: number;
  status: "Pending" | "Accepted" | "InProgress" | "Delivered" | "Completed" | "Disputed" | "Cancelled";
  createdAt: string;
  deadline?: string;
}

function CustomRequestsContent() {
  const t = useTranslations();
  const { client } = useAuth();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["creator", "custom-requests"],
    queryFn: () => client.get<CustomRequest[]>("/custom-requests/creator"),
  });

  const requests = data?.success ? data.data ?? [] : [];
  const pending = requests.filter((r) => r.status === "Pending");
  const active = requests.filter((r) => ["Accepted", "InProgress", "Delivered"].includes(r.status));
  const completed = requests.filter((r) => ["Completed", "Cancelled", "Disputed"].includes(r.status));

  async function handleAccept(id: string) {
    await client.post(`/custom-requests/${id}/accept`);
    queryClient.invalidateQueries({ queryKey: ["creator", "custom-requests"] });
  }

  async function handleDecline(id: string) {
    await client.post(`/custom-requests/${id}/decline`);
    queryClient.invalidateQueries({ queryKey: ["creator", "custom-requests"] });
  }

  async function handleDeliver(id: string) {
    await client.post(`/custom-requests/${id}/deliver`);
    queryClient.invalidateQueries({ queryKey: ["creator", "custom-requests"] });
  }

  function statusVariant(status: string) {
    switch (status) {
      case "Completed": return "success" as const;
      case "Pending": return "warning" as const;
      case "Disputed":
      case "Cancelled": return "destructive" as const;
      default: return "secondary" as const;
    }
  }

  function renderRequest(req: CustomRequest) {
    return (
      <Card key={req.id}>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium">{req.requesterUsername}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(req.createdAt).toLocaleDateString()}
                {req.deadline && ` · Due: ${new Date(req.deadline).toLocaleDateString()}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{req.priceCoins} Coins</span>
              <Badge variant={statusVariant(req.status)}>{req.status}</Badge>
            </div>
          </div>
          <p className="text-sm">{req.description}</p>
          <div className="flex gap-2">
            {req.status === "Pending" && (
              <>
                <Button size="sm" onClick={() => handleAccept(req.id)}>
                  Accept
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDecline(req.id)}>
                  Decline
                </Button>
              </>
            )}
            {(req.status === "Accepted" || req.status === "InProgress") && (
              <Button size="sm" onClick={() => handleDeliver(req.id)}>
                Mark Delivered
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Custom Requests</h1>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pending.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({active.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completed.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <div className="space-y-3 mt-4">
            {pending.length > 0 ? (
              pending.map(renderRequest)
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground">No pending requests</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="active">
          <div className="space-y-3 mt-4">
            {active.length > 0 ? (
              active.map(renderRequest)
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground">No active requests</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="space-y-3 mt-4">
            {completed.length > 0 ? (
              completed.map(renderRequest)
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground">No completed requests</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function CustomRequestsPage() {
  return (
    <ProtectedRoute roles={["Creator", "Admin"]}>
      <CustomRequestsContent />
    </ProtectedRoute>
  );
}
