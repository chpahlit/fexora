"use client";

import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Payments & Payouts</h1>
            <p className="text-sm text-muted-foreground">Revenue overview and transaction management</p>
          </div>
          <Button variant="outline" onClick={() => handleExport("payments")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            CSV Export
          </Button>
        </div>

        {/* Revenue KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Revenue (EUR)</p>
                  <p className="text-2xl font-bold">{revenue?.totalRevenueEur?.toFixed(2) ?? "0.00"}</p>
                  <p className="text-xs text-muted-foreground">{revenue?.monthlyRevenueEur?.toFixed(2) ?? "0.00"} this month</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><line x1="12" x2="12" y1="1" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Revenue (Coins)</p>
                  <p className="text-2xl font-bold">{(revenue?.totalRevenueCoins ?? 0).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{(revenue?.monthlyRevenueCoins ?? 0).toLocaleString()} this month</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Platform Fees</p>
                  <p className="text-2xl font-bold">{(revenue?.platformFees ?? 0).toLocaleString()}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Transactions</p>
                  <p className="text-2xl font-bold">
                    {(revenue?.totalUnlocks ?? 0) + (revenue?.totalSubscriptions ?? 0) + (revenue?.totalTips ?? 0)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {revenue?.totalUnlocks ?? 0} unlocks · {revenue?.totalSubscriptions ?? 0} subs · {revenue?.totalTips ?? 0} tips
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                </div>
              </div>
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
                    <tr key={p.id} className="border-b hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{p.creatorUsername}</td>
                      <td className="px-4 py-3 font-mono">{p.amount} {p.currency}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{p.method}</Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(p.requestedAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button size="sm" onClick={() => handlePayout(p.id, "approve")}>Approve</Button>
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handlePayout(p.id, "reject")}>Reject</Button>
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
                    <th className="px-4 py-3 text-right font-medium">Amount</th>
                    <th className="px-4 py-3 text-right font-medium">Coins</th>
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((s) => (
                    <tr key={s.id} className="border-b hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{s.username}</td>
                      <td className="px-4 py-3">{s.packName}</td>
                      <td className="px-4 py-3 text-right font-mono">{s.amountEur.toFixed(2)} EUR</td>
                      <td className="px-4 py-3 text-right font-mono">{s.coinsReceived.toLocaleString()}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(s.createdAt).toLocaleDateString()}</td>
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
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive">{d.type}</Badge>
                          <span className="text-sm font-mono">{d.amountCoins} Coins</span>
                        </div>
                        <p className="text-sm mt-2">
                          <span className="font-medium">{d.buyerUsername}</span>
                          <span className="text-muted-foreground"> vs </span>
                          <span className="font-medium">{d.creatorUsername}</span>
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">{d.reason}</p>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(d.createdAt).toLocaleString()}</p>
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
    </AppShell>
  );
}
