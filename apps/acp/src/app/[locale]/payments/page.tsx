"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface RevenueOverview {
  totalRevenueEur: number;
  totalRevenueCoins: number;
  monthlyRevenueEur: number;
  monthlyRevenueCoins: number;
  totalUnlocks: number;
  totalSubscriptions: number;
  totalTips: number;
  platformFees: number;
}

interface PayoutRequest {
  id: string;
  creatorUsername: string;
  amount: number;
  currency: string;
  method: string;
  status: "pending" | "approved" | "rejected" | "completed";
  requestedAt: string;
}

interface CoinSale {
  id: string;
  username: string;
  packName: string;
  amountEur: number;
  coinsReceived: number;
  createdAt: string;
}

interface Dispute {
  id: string;
  type: string;
  buyerUsername: string;
  creatorUsername: string;
  amountCoins: number;
  reason: string;
  status: "open" | "resolved";
  createdAt: string;
}

export default function PaymentsPage() {
  const { client } = useAuth();
  const queryClient = useQueryClient();

  const { data: revenueData } = useQuery({
    queryKey: ["admin", "revenue"],
    queryFn: () => client.get<RevenueOverview>("/admin/revenue"),
  });

  const { data: payoutsData } = useQuery({
    queryKey: ["admin", "payouts"],
    queryFn: () => client.get<PayoutRequest[]>("/admin/payouts?status=pending"),
  });

  const { data: salesData } = useQuery({
    queryKey: ["admin", "coin-sales"],
    queryFn: () => client.get<CoinSale[]>("/admin/coin-sales?page=1&pageSize=20"),
  });

  const { data: disputesData } = useQuery({
    queryKey: ["admin", "disputes"],
    queryFn: () => client.get<Dispute[]>("/admin/disputes?status=open"),
  });

  const revenue = revenueData?.success ? revenueData.data : null;
  const payouts = payoutsData?.success ? payoutsData.data ?? [] : [];
  const sales = salesData?.success ? salesData.data ?? [] : [];
  const disputes = disputesData?.success ? disputesData.data ?? [] : [];

  async function handlePayout(id: string, action: "approve" | "reject") {
    await client.post(`/admin/payouts/${id}/${action}`);
    queryClient.invalidateQueries({ queryKey: ["admin", "payouts"] });
  }

  async function handleDispute(id: string, action: "refund" | "release") {
    await client.post(`/admin/disputes/${id}/${action}`);
    queryClient.invalidateQueries({ queryKey: ["admin", "disputes"] });
  }

  async function handleExport(type: string) {
    const res = await client.get<{ downloadUrl: string }>(`/admin/export/${type}`);
    if (res.success && res.data?.downloadUrl) {
      window.open(res.data.downloadUrl, "_blank");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Payments & Payouts</h1>
        <Button variant="outline" onClick={() => handleExport("payments")}>
          CSV Export
        </Button>
      </div>

      {/* Revenue Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Revenue (EUR)</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{revenue?.totalRevenueEur?.toFixed(2) ?? "0.00"} EUR</p>
            <p className="text-xs text-muted-foreground">{revenue?.monthlyRevenueEur?.toFixed(2) ?? "0.00"} this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Revenue (Coins)</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{revenue?.totalRevenueCoins ?? 0}</p>
            <p className="text-xs text-muted-foreground">{revenue?.monthlyRevenueCoins ?? 0} this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Platform Fees</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{revenue?.platformFees ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {(revenue?.totalUnlocks ?? 0) + (revenue?.totalSubscriptions ?? 0) + (revenue?.totalTips ?? 0)}
            </p>
            <p className="text-xs text-muted-foreground">
              {revenue?.totalUnlocks ?? 0} unlocks · {revenue?.totalSubscriptions ?? 0} subs · {revenue?.totalTips ?? 0} tips
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="payouts">
        <TabsList>
          <TabsTrigger value="payouts">Payouts ({payouts.length})</TabsTrigger>
          <TabsTrigger value="sales">Coin Sales</TabsTrigger>
          <TabsTrigger value="disputes">Disputes ({disputes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="payouts">
          <div className="mt-4 rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">Creator</th>
                  <th className="px-4 py-3 text-left font-medium">Amount</th>
                  <th className="px-4 py-3 text-left font-medium">Method</th>
                  <th className="px-4 py-3 text-left font-medium">Requested</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((p) => (
                  <tr key={p.id} className="border-b">
                    <td className="px-4 py-3 font-medium">{p.creatorUsername}</td>
                    <td className="px-4 py-3">{p.amount} {p.currency}</td>
                    <td className="px-4 py-3">{p.method}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(p.requestedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button size="sm" onClick={() => handlePayout(p.id, "approve")}>Approve</Button>
                        <Button size="sm" variant="ghost" onClick={() => handlePayout(p.id, "reject")}>Reject</Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {payouts.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No pending payouts</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="sales">
          <div className="mt-4 rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">User</th>
                  <th className="px-4 py-3 text-left font-medium">Pack</th>
                  <th className="px-4 py-3 text-left font-medium">Amount</th>
                  <th className="px-4 py-3 text-left font-medium">Coins</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((s) => (
                  <tr key={s.id} className="border-b">
                    <td className="px-4 py-3">{s.username}</td>
                    <td className="px-4 py-3">{s.packName}</td>
                    <td className="px-4 py-3">{s.amountEur.toFixed(2)} EUR</td>
                    <td className="px-4 py-3">{s.coinsReceived}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(s.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {sales.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No coin sales</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="disputes">
          <div className="mt-4 space-y-3">
            {disputes.map((d) => (
              <Card key={d.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{d.type} Dispute</p>
                      <p className="text-sm text-muted-foreground">
                        {d.buyerUsername} vs {d.creatorUsername} · {d.amountCoins} Coins
                      </p>
                      <p className="text-sm mt-1">{d.reason}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleDispute(d.id, "refund")}>
                        Refund Buyer
                      </Button>
                      <Button size="sm" onClick={() => handleDispute(d.id, "release")}>
                        Release to Creator
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {disputes.length === 0 && (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground">No open disputes</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
