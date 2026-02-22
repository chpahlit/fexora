"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface EarningsSummary {
  totalEarnings: number;
  pendingPayout: number;
  totalPaidOut: number;
  minPayout: number;
  monthlyEarnings: number;
  weeklyEarnings: number;
}

interface EarningsByType {
  unlocks: number;
  subscriptions: number;
  tips: number;
  ppv: number;
  chat: number;
  customRequests: number;
}

interface PayoutRequest {
  id: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "rejected";
  requestedAt: string;
  processedAt?: string;
  method: string;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
  fromUser?: string;
}

export default function CreatorEarningsPage() {
  return (
    <ProtectedRoute roles={["Creator", "Admin"]}>
      <EarningsContent />
    </ProtectedRoute>
  );
}

function EarningsContent() {
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [requestingPayout, setRequestingPayout] = useState(false);
  const [page, setPage] = useState(1);

  const { data: summaryData } = useQuery({
    queryKey: ["creator", "earnings", "summary"],
    queryFn: () => client.get<EarningsSummary>("/creator/earnings/summary"),
  });
  const summary = summaryData?.success ? summaryData.data : null;

  const { data: byTypeData } = useQuery({
    queryKey: ["creator", "earnings", "by-type"],
    queryFn: () => client.get<EarningsByType>("/creator/earnings/by-type"),
  });
  const byType = byTypeData?.success ? byTypeData.data : null;

  const { data: payoutsData } = useQuery({
    queryKey: ["creator", "payouts"],
    queryFn: () => client.get<PayoutRequest[]>("/creator/payouts"),
  });
  const payouts = payoutsData?.success ? payoutsData.data ?? [] : [];

  const { data: txData } = useQuery({
    queryKey: ["creator", "transactions", page],
    queryFn: () => client.getPaginated<Transaction>("/creator/transactions", { page, pageSize: 20 }),
  });
  const transactions = txData?.success ? txData.data?.data ?? [] : [];
  const totalPages = txData?.success ? Math.ceil((txData.data?.total ?? 0) / 20) || 1 : 1;

  async function handleRequestPayout() {
    setRequestingPayout(true);
    await client.post("/creator/payouts/request");
    queryClient.invalidateQueries({ queryKey: ["creator"] });
    setRequestingPayout(false);
  }

  const canRequestPayout = summary && summary.pendingPayout >= (summary.minPayout ?? 5000);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Earnings & Payouts</h1>
        <Button onClick={handleRequestPayout} disabled={requestingPayout || !canRequestPayout}>
          {requestingPayout ? "Requesting..." : "Request Payout"}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold">{summary?.totalEarnings?.toLocaleString() ?? 0}</p>
            <p className="text-xs text-muted-foreground">Total Earnings (Coins)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold text-primary">{summary?.pendingPayout?.toLocaleString() ?? 0}</p>
            <p className="text-xs text-muted-foreground">Available for Payout</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold">{summary?.totalPaidOut?.toLocaleString() ?? 0}</p>
            <p className="text-xs text-muted-foreground">Total Paid Out</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold">{summary?.monthlyEarnings?.toLocaleString() ?? 0}</p>
            <p className="text-xs text-muted-foreground">This Month</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Type */}
      {byType && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: "Unlocks", value: byType.unlocks },
                { label: "Subscriptions", value: byType.subscriptions },
                { label: "Tips", value: byType.tips },
                { label: "PPV Messages", value: byType.ppv },
                { label: "Chat", value: byType.chat },
                { label: "Custom Requests", value: byType.customRequests },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm">{item.label}</span>
                  <span className="font-bold">{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Payout History</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4 mt-4">
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-medium">Type</th>
                  <th className="p-3 text-left font-medium">Description</th>
                  <th className="p-3 text-left font-medium">From</th>
                  <th className="p-3 text-right font-medium">Amount</th>
                  <th className="p-3 text-right font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b last:border-0">
                    <td className="p-3"><Badge variant="secondary">{tx.type}</Badge></td>
                    <td className="p-3">{tx.description}</td>
                    <td className="p-3 text-muted-foreground">{tx.fromUser ?? "—"}</td>
                    <td className="p-3 text-right font-bold text-primary">+{tx.amount}</td>
                    <td className="p-3 text-right text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No transactions</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}>Prev</Button>
              <span className="text-sm py-2">{page} / {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages}>Next</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="payouts" className="space-y-4 mt-4">
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-medium">Amount</th>
                  <th className="p-3 text-left font-medium">Method</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-right font-medium">Requested</th>
                  <th className="p-3 text-right font-medium">Processed</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="p-3 font-bold">{p.amount.toLocaleString()} coins</td>
                    <td className="p-3">{p.method}</td>
                    <td className="p-3">
                      <Badge variant={
                        p.status === "completed" ? "default" :
                        p.status === "processing" ? "secondary" :
                        p.status === "rejected" ? "destructive" : "outline"
                      }>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-right text-muted-foreground">{new Date(p.requestedAt).toLocaleDateString()}</td>
                    <td className="p-3 text-right text-muted-foreground">{p.processedAt ? new Date(p.processedAt).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
                {payouts.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No payout requests</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
