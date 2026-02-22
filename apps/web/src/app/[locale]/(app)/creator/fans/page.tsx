"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Fan {
  userId: string;
  username: string;
  avatarUrl?: string;
  totalSpent: number;
  lastActivity: string;
  isSubscriber: boolean;
  subscriptionTier?: string;
}

interface TopFan {
  userId: string;
  username: string;
  avatarUrl?: string;
  totalSpent: number;
  unlocks: number;
  tips: number;
  rank: number;
}

interface Subscriber {
  userId: string;
  username: string;
  avatarUrl?: string;
  tier: string;
  subscribedAt: string;
  expiresAt: string;
  totalPaid: number;
}

interface ActiveChatter {
  userId: string;
  username: string;
  avatarUrl?: string;
  messageCount: number;
  lastMessage: string;
  chatRevenue: number;
}

export default function CreatorFansPage() {
  return (
    <ProtectedRoute roles={["Creator", "Admin"]}>
      <FansContent />
    </ProtectedRoute>
  );
}

function FansContent() {
  const { client } = useAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data: fansData } = useQuery({
    queryKey: ["creator", "fans", search, page],
    queryFn: () => client.getPaginated<Fan>(`/creator/fans${search ? `?search=${encodeURIComponent(search)}` : ""}`, { page, pageSize: 20 }),
  });
  const fans = fansData?.success ? fansData.data?.data ?? [] : [];
  const totalPages = fansData?.success ? Math.ceil((fansData.data?.total ?? 0) / 20) || 1 : 1;

  const { data: topFansData } = useQuery({
    queryKey: ["creator", "top-fans"],
    queryFn: () => client.get<TopFan[]>("/creator/fans/top?limit=10"),
  });
  const topFans = topFansData?.success ? topFansData.data ?? [] : [];

  const { data: subscribersData } = useQuery({
    queryKey: ["creator", "subscribers"],
    queryFn: () => client.get<Subscriber[]>("/creator/subscribers"),
  });
  const subscribers = subscribersData?.success ? subscribersData.data ?? [] : [];

  const { data: chattersData } = useQuery({
    queryKey: ["creator", "active-chatters"],
    queryFn: () => client.get<ActiveChatter[]>("/creator/fans/chatters?limit=20"),
  });
  const chatters = chattersData?.success ? chattersData.data ?? [] : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Fan Management</h1>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold">{fansData?.success ? fansData.data?.total ?? 0 : 0}</p>
            <p className="text-xs text-muted-foreground">Total Fans</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold">{subscribers.length}</p>
            <p className="text-xs text-muted-foreground">Subscribers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold">{topFans[0]?.totalSpent?.toLocaleString() ?? 0}</p>
            <p className="text-xs text-muted-foreground">Top Spender</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold">{chatters.length}</p>
            <p className="text-xs text-muted-foreground">Active Chatters</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Fans</TabsTrigger>
          <TabsTrigger value="top">Top Fans</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="chatters">Active Chatters</TabsTrigger>
        </TabsList>

        {/* All Fans */}
        <TabsContent value="all" className="space-y-4 mt-4">
          <Input
            placeholder="Search fans..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <div className="space-y-2">
            {fans.map((fan) => (
              <Card key={fan.userId}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {fan.avatarUrl && <AvatarImage src={fan.avatarUrl} />}
                      <AvatarFallback>{fan.username[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{fan.username}</p>
                      <p className="text-xs text-muted-foreground">
                        Last active: {new Date(fan.lastActivity).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {fan.isSubscriber && (
                      <Badge variant="default">{fan.subscriptionTier ?? "Subscriber"}</Badge>
                    )}
                    <span className="text-sm font-bold">{fan.totalSpent.toLocaleString()} coins</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {fans.length === 0 && (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground">No fans found</p>
              </div>
            )}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}>Prev</Button>
              <span className="text-sm py-2">{page} / {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages}>Next</Button>
            </div>
          )}
        </TabsContent>

        {/* Top Fans */}
        <TabsContent value="top" className="space-y-4 mt-4">
          <div className="space-y-2">
            {topFans.map((fan) => (
              <Card key={fan.userId}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 text-center">
                      {fan.rank <= 3 ? (
                        <Badge variant={fan.rank === 1 ? "default" : "secondary"}>#{fan.rank}</Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">#{fan.rank}</span>
                      )}
                    </div>
                    <Avatar>
                      {fan.avatarUrl && <AvatarImage src={fan.avatarUrl} />}
                      <AvatarFallback>{fan.username[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <p className="font-medium">{fan.username}</p>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-right">
                      <p className="font-bold">{fan.totalSpent.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Total Spent</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{fan.unlocks}</p>
                      <p className="text-xs text-muted-foreground">Unlocks</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{fan.tips.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Tips</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {topFans.length === 0 && (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground">No top fan data yet</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Subscribers */}
        <TabsContent value="subscribers" className="space-y-4 mt-4">
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-medium">User</th>
                  <th className="p-3 text-left font-medium">Tier</th>
                  <th className="p-3 text-right font-medium">Since</th>
                  <th className="p-3 text-right font-medium">Expires</th>
                  <th className="p-3 text-right font-medium">Total Paid</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub) => (
                  <tr key={sub.userId} className="border-b last:border-0">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          {sub.avatarUrl && <AvatarImage src={sub.avatarUrl} />}
                          <AvatarFallback className="text-xs">{sub.username[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{sub.username}</span>
                      </div>
                    </td>
                    <td className="p-3"><Badge variant="secondary">{sub.tier}</Badge></td>
                    <td className="p-3 text-right text-muted-foreground">{new Date(sub.subscribedAt).toLocaleDateString()}</td>
                    <td className="p-3 text-right text-muted-foreground">{new Date(sub.expiresAt).toLocaleDateString()}</td>
                    <td className="p-3 text-right font-bold">{sub.totalPaid.toLocaleString()}</td>
                  </tr>
                ))}
                {subscribers.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No subscribers yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Active Chatters */}
        <TabsContent value="chatters" className="space-y-4 mt-4">
          <div className="space-y-2">
            {chatters.map((chatter) => (
              <Card key={chatter.userId}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {chatter.avatarUrl && <AvatarImage src={chatter.avatarUrl} />}
                      <AvatarFallback>{chatter.username[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{chatter.username}</p>
                      <p className="text-xs text-muted-foreground">{chatter.messageCount} messages</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{chatter.chatRevenue.toLocaleString()} coins</p>
                    <p className="text-xs text-muted-foreground">Chat revenue</p>
                  </div>
                </CardContent>
              </Card>
            ))}
            {chatters.length === 0 && (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground">No active chatters</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
