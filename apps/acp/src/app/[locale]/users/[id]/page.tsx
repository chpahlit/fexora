"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UserDetail {
  id: string;
  email: string;
  username: string;
  role: string;
  status: "active" | "blocked" | "shadowbanned";
  isVerified18: boolean;
  createdAt: string;
  lastLogin?: string;
  bio?: string;
  avatarUrl?: string;
  country?: string;
  followerCount: number;
  contentCount: number;
  totalRevenue: number;
  agencyId?: string;
  agencyName?: string;
}

interface ActivityLog {
  id: string;
  action: string;
  details: string;
  createdAt: string;
}

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [newRole, setNewRole] = useState("");

  const { data } = useQuery({
    queryKey: ["admin", "user", params.id],
    queryFn: () => client.get<UserDetail>(`/admin/users/${params.id}`),
  });

  const { data: logsData } = useQuery({
    queryKey: ["admin", "user", params.id, "logs"],
    queryFn: () => client.get<ActivityLog[]>(`/admin/users/${params.id}/activity`),
  });

  const user = data?.success ? data.data : null;
  const logs = logsData?.success ? logsData.data ?? [] : [];

  async function handleAction(action: string) {
    await client.post(`/admin/users/${params.id}/${action}`);
    queryClient.invalidateQueries({ queryKey: ["admin", "user", params.id] });
  }

  async function handleRoleChange() {
    if (!newRole) return;
    await client.post(`/admin/users/${params.id}/role`, { role: newRole });
    queryClient.invalidateQueries({ queryKey: ["admin", "user", params.id] });
    setNewRole("");
  }

  if (!user) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{user.username}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={user.status === "active" ? "success" : user.status === "blocked" ? "destructive" : "warning"}>
            {user.status}
          </Badge>
          <Badge variant="secondary">{user.role}</Badge>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold">{user.followerCount}</p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold">{user.contentCount}</p>
            <p className="text-xs text-muted-foreground">Content</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold">{user.totalRevenue}</p>
            <p className="text-xs text-muted-foreground">Revenue (Coins)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "-"}</p>
            <p className="text-xs text-muted-foreground">Last Login</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="actions">
        <TabsList>
          <TabsTrigger value="actions">Admin Actions</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="actions">
          <div className="grid gap-4 sm:grid-cols-2 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Role Assignment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select role...</option>
                  <option value="User">User</option>
                  <option value="Creator">Creator</option>
                  <option value="Moderator">Moderator</option>
                  <option value="Admin">Admin</option>
                </select>
                <Button size="sm" onClick={handleRoleChange} disabled={!newRole}>
                  Change Role
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {user.status === "active" ? (
                  <>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => handleAction("block")}>
                      Block User
                    </Button>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => handleAction("shadowban")}>
                      Shadowban
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleAction("unblock")}>
                    Unblock User
                  </Button>
                )}
                <Separator />
                <Button variant="outline" size="sm" className="w-full" onClick={() => handleAction("reset-2fa")}>
                  Reset 2FA
                </Button>
                <Button variant="outline" size="sm" className="w-full" onClick={() => handleAction("force-password-reset")}>
                  Force Password Reset
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <div className="mt-4 space-y-2">
            {logs.length > 0 ? (
              logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between rounded border p-3 text-sm">
                  <div>
                    <p className="font-medium">{log.action}</p>
                    <p className="text-xs text-muted-foreground">{log.details}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground">No activity logs</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
