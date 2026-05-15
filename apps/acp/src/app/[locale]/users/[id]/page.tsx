"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@/i18n/navigation";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    queryFn: () =>
      client.get<ActivityLog[]>(`/admin/users/${params.id}/activity`),
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
      <AppShell>
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/users" className="hover:text-foreground">
            Users
          </Link>
          <span>/</span>
          <span className="text-foreground">{user.username}</span>
        </div>

        {/* Profile Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-xl font-bold">
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              user.username.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <Badge
                variant={
                  user.status === "active"
                    ? "success"
                    : user.status === "blocked"
                      ? "destructive"
                      : "warning"
                }
              >
                {user.status}
              </Badge>
              <Badge variant="secondary">{user.role}</Badge>
              {user.isVerified18 && (
                <Badge variant="outline">18+ Verified</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
            {user.bio && (
              <p className="text-sm text-muted-foreground mt-1">{user.bio}</p>
            )}
            <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
              {user.country && <span>Country: {user.country}</span>}
              <span>
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </span>
              {user.lastLogin && (
                <span>
                  Last login: {new Date(user.lastLogin).toLocaleDateString()}
                </span>
              )}
              {user.agencyName && <span>Agency: {user.agencyName}</span>}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Followers</p>
                  <p className="text-2xl font-bold">
                    {user.followerCount.toLocaleString()}
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Content</p>
                  <p className="text-2xl font-bold">{user.contentCount}</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">
                    {user.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-muted-foreground">coins</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Last Login</p>
                  <p className="text-2xl font-bold">
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="actions">
          <TabsList>
            <TabsTrigger value="actions">Admin Actions</TabsTrigger>
            <TabsTrigger value="activity">
              Activity Log ({logs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="actions">
            <div className="grid gap-4 sm:grid-cols-2 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                    Role Assignment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Current role:{" "}
                    <span className="font-semibold text-foreground">
                      {user.role}
                    </span>
                  </p>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select new role...</option>
                    <option value="User">User</option>
                    <option value="Creator">Creator</option>
                    <option value="Moderator">Moderator</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <Button
                    size="sm"
                    onClick={handleRoleChange}
                    disabled={!newRole}
                  >
                    Change Role
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                    Account Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {user.status === "active" ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => handleAction("block")}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-red-500"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
                        Block User
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => handleAction("shadowban")}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-yellow-500"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                        Shadowban
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleAction("unblock")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                      Unblock User
                    </Button>
                  )}
                  <Separator />
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleAction("reset-2fa")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    Reset 2FA
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleAction("force-password-reset")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.78 7.78 5.5 5.5 0 0 1 7.78-7.78m0 0L12 8l4-4 4 4-4 4"/></svg>
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
                  <div
                    key={log.id}
                    className="flex items-center justify-between rounded border p-3 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      </div>
                      <div>
                        <p className="font-medium">{log.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {log.details}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">
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
    </AppShell>
  );
}
