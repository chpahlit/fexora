"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PaginatedResponse } from "@fexora/shared";

interface TipReceived {
  id: string;
  senderId: string;
  senderUsername: string;
  senderAvatarUrl?: string;
  amount: number;
  giftItemName?: string;
  giftItemIcon?: string;
  message?: string;
  createdAt: string;
}

interface TopTipper {
  userId: string;
  username: string;
  avatarUrl?: string;
  totalAmount: number;
  tipCount: number;
}

interface TipStats {
  totalTips: number;
  totalAmount: number;
  averageTip: number;
  tipsThisMonth: number;
  amountThisMonth: number;
}

export default function CreatorTipsPage() {
  return (
    <ProtectedRoute roles={["Creator", "Admin"]}>
      <TipsContent />
    </ProtectedRoute>
  );
}

function TipsContent() {
  const { client } = useAuth();
  const [page, setPage] = useState(1);

  const { data: statsData } = useQuery({
    queryKey: ["creator", "tips", "stats"],
    queryFn: () => client.get<TipStats>("/creator/tips/stats"),
  });
  const stats = statsData?.success ? statsData.data : null;

  const { data: tipsData } = useQuery({
    queryKey: ["creator", "tips", "history", page],
    queryFn: () => client.getPaginated<TipReceived>("/creator/tips", { page, pageSize: 20 }),
  });
  const tips = tipsData?.success ? tipsData.data?.data ?? [] : [];
  const totalPages = tipsData?.success ? Math.ceil((tipsData.data?.total ?? 0) / 20) || 1 : 1;

  const { data: topData } = useQuery({
    queryKey: ["creator", "tips", "top"],
    queryFn: () => client.get<TopTipper[]>("/creator/tips/top?limit=10"),
  });
  const topTippers = topData?.success ? topData.data ?? [] : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tips & Gifts</h1>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-5">
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold">{stats?.totalAmount?.toLocaleString() ?? 0}</p>
            <p className="text-xs text-muted-foreground">Total Earned (Coins)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold">{stats?.totalTips ?? 0}</p>
            <p className="text-xs text-muted-foreground">Total Tips</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold">{stats?.averageTip?.toFixed(0) ?? 0}</p>
            <p className="text-xs text-muted-foreground">Avg. Tip</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold">{stats?.amountThisMonth?.toLocaleString() ?? 0}</p>
            <p className="text-xs text-muted-foreground">This Month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold">{stats?.tipsThisMonth ?? 0}</p>
            <p className="text-xs text-muted-foreground">Tips This Month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="history">
        <TabsList>
          <TabsTrigger value="history">Tip History</TabsTrigger>
          <TabsTrigger value="top">Top Tippers</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-3 mt-4">
          {tips.map((tip) => (
            <Card key={tip.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    {tip.senderAvatarUrl && <AvatarImage src={tip.senderAvatarUrl} />}
                    <AvatarFallback>{tip.senderUsername[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{tip.senderUsername}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(tip.createdAt).toLocaleString()}
                    </p>
                    {tip.message && (
                      <p className="text-sm text-muted-foreground mt-1">&quot;{tip.message}&quot;</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {tip.giftItemName ? (
                    <div className="flex items-center gap-2">
                      {tip.giftItemIcon && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={tip.giftItemIcon} alt="" className="h-6 w-6" />
                      )}
                      <Badge variant="secondary">{tip.giftItemName}</Badge>
                    </div>
                  ) : null}
                  <span className="text-sm font-bold">{tip.amount.toLocaleString()} coins</span>
                </div>
              </CardContent>
            </Card>
          ))}
          {tips.length === 0 && (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">No tips received yet</p>
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}>Prev</Button>
              <span className="text-sm py-2">{page} / {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages}>Next</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="top" className="space-y-3 mt-4">
          {topTippers.map((tipper, i) => (
            <Card key={tipper.userId}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 text-center">
                    {i < 3 ? (
                      <Badge variant={i === 0 ? "default" : "secondary"}>#{i + 1}</Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">#{i + 1}</span>
                    )}
                  </div>
                  <Avatar>
                    {tipper.avatarUrl && <AvatarImage src={tipper.avatarUrl} />}
                    <AvatarFallback>{tipper.username[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <p className="font-medium">{tipper.username}</p>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-right">
                    <p className="font-bold">{tipper.totalAmount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Coins</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{tipper.tipCount}</p>
                    <p className="text-xs text-muted-foreground">Tips</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {topTippers.length === 0 && (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">No top tipper data yet</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
