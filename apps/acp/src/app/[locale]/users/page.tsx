"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UserListItem {
  id: string;
  email: string;
  username: string;
  role: string;
  status: "active" | "blocked" | "shadowbanned";
  isVerified18: boolean;
  createdAt: string;
  lastLogin?: string;
}

export default function UsersPage() {
  const t = useTranslations();
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users", search, roleFilter, page],
    queryFn: () =>
      client.get<{ data: UserListItem[]; total: number }>(
        `/admin/users?search=${encodeURIComponent(search)}&role=${roleFilter}&page=${page}&pageSize=20`
      ),
  });

  const users = data?.success ? data.data?.data ?? [] : [];
  const total = data?.success ? data.data?.total ?? 0 : 0;

  async function handleToggleStatus(userId: string, action: "block" | "unblock" | "shadowban") {
    await client.post(`/admin/users/${userId}/${action}`);
    queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
  }

  function statusVariant(status: string) {
    switch (status) {
      case "active": return "success" as const;
      case "blocked": return "destructive" as const;
      case "shadowbanned": return "warning" as const;
      default: return "secondary" as const;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-sm text-muted-foreground">{total} users total</p>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search by username or email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="max-w-sm"
        />
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="all">All Roles</option>
          <option value="User">User</option>
          <option value="Creator">Creator</option>
          <option value="Moderator">Moderator</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">User</th>
                <th className="px-4 py-3 text-left font-medium">Role</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Registered</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div>
                      <Link href={`/users/${user.id}`} className="font-medium hover:underline">
                        {user.username}
                      </Link>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{user.role}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant(user.status)}>{user.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Link href={`/users/${user.id}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                      {user.status === "active" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(user.id, "block")}
                        >
                          Block
                        </Button>
                      ) : user.status === "blocked" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(user.id, "unblock")}
                        >
                          Unblock
                        </Button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">Page {page}</span>
        <Button variant="outline" size="sm" disabled={users.length < 20} onClick={() => setPage(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
