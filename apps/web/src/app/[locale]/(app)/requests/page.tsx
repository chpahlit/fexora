"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CustomRequest {
  id: string;
  creatorId: string;
  creatorUsername: string;
  creatorAvatarUrl?: string;
  description: string;
  priceCoins: number;
  status: "pending" | "accepted" | "in_progress" | "delivered" | "completed" | "cancelled" | "disputed";
  createdAt: string;
  acceptedAt?: string;
  deliveredAt?: string;
  completedAt?: string;
}

export default function RequestsPage() {
  return (
    <ProtectedRoute>
      <RequestsContent />
    </ProtectedRoute>
  );
}

function RequestsContent() {
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [processing, setProcessing] = useState<string | null>(null);

  const { data: requestsData } = useQuery({
    queryKey: ["my", "requests"],
    queryFn: () => client.get<CustomRequest[]>("/requests/my"),
  });
  const requests = requestsData?.success ? requestsData.data ?? [] : [];

  const active = requests.filter((r) => ["pending", "accepted", "in_progress", "delivered"].includes(r.status));
  const completed = requests.filter((r) => r.status === "completed");
  const other = requests.filter((r) => ["cancelled", "disputed"].includes(r.status));

  async function handleConfirm(id: string) {
    setProcessing(id);
    await client.post(`/requests/${id}/confirm`);
    queryClient.invalidateQueries({ queryKey: ["my", "requests"] });
    setProcessing(null);
  }

  async function handleDispute(id: string) {
    setProcessing(id);
    await client.post(`/requests/${id}/dispute`);
    queryClient.invalidateQueries({ queryKey: ["my", "requests"] });
    setProcessing(null);
  }

  function statusColor(status: string) {
    switch (status) {
      case "pending": return "warning";
      case "accepted": case "in_progress": return "secondary";
      case "delivered": return "default";
      case "completed": return "success";
      case "cancelled": return "destructive";
      case "disputed": return "destructive";
      default: return "secondary";
    }
  }

  function RequestCard({ request }: { request: CustomRequest }) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                {request.creatorAvatarUrl && <AvatarImage src={request.creatorAvatarUrl} />}
                <AvatarFallback>{request.creatorUsername[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{request.creatorUsername}</p>
                <p className="text-xs text-muted-foreground">{new Date(request.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={statusColor(request.status) as "default" | "secondary" | "destructive" | "success" | "warning"}>
                {request.status.replace("_", " ")}
              </Badge>
              <span className="text-sm font-bold">{request.priceCoins.toLocaleString()} coins</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{request.description}</p>
          {request.acceptedAt && (
            <p className="text-xs text-muted-foreground mt-2">Accepted: {new Date(request.acceptedAt).toLocaleDateString()}</p>
          )}
          {request.deliveredAt && (
            <p className="text-xs text-muted-foreground">Delivered: {new Date(request.deliveredAt).toLocaleDateString()}</p>
          )}
        </CardContent>
        {request.status === "delivered" && (
          <CardFooter className="flex gap-2">
            <Button size="sm" onClick={() => handleConfirm(request.id)} disabled={processing === request.id}>
              {processing === request.id ? "Processing..." : "Confirm & Release Payment"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleDispute(request.id)} disabled={processing === request.id}>
              Dispute
            </Button>
          </CardFooter>
        )}
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Custom Requests</h1>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold">{active.length}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold">{completed.length}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold">{requests.reduce((s, r) => s + r.priceCoins, 0).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Spent (Coins)</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
          <TabsTrigger value="other">Cancelled/Disputed ({other.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-3 mt-4">
          {active.length > 0 ? (
            active.map((r) => <RequestCard key={r.id} request={r} />)
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">No active requests</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-3 mt-4">
          {completed.length > 0 ? (
            completed.map((r) => <RequestCard key={r.id} request={r} />)
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">No completed requests</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="other" className="space-y-3 mt-4">
          {other.length > 0 ? (
            other.map((r) => <RequestCard key={r.id} request={r} />)
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">No cancelled or disputed requests</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
