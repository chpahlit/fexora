"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@/i18n/navigation";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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

const ROLES = ["all", "User", "Creator", "Moderator", "Admin"];

export default function UsersPage() {
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users", search, roleFilter, statusFilter, page],
    queryFn: () =>
      client.get<{ data: UserListItem[]; total: number }>(
        `/admin/users?search=${encodeURIComponent(search)}&role=${roleFilter}&status=${statusFilter}&page=${page}&pageSize=20`
      ),
  });

  const users = data?.success ? data.data?.data ?? [] : [];
  const total = data?.success ? data.data?.total ?? 0 : 0;
  const totalPages = Math.ceil(total / 20);

  async function handleToggleStatus(
    userId: string,
    action: "block" | "unblock" | "shadowban"
  ) {
    await client.post(`/admin/users/${userId}/${action}`);
    queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
  }

  function statusVariant(status: string) {
    switch (status) {
      case "active":
        return "success" as const;
      case "blocked":
        return "destructive" as const;
      case "shadowbanned":
        return "warning" as const;
      default:
        return "secondary" as const;
    }
  }

  function roleColor(role: string) {
    switch (role) {
      case "Admin":
        return "text-red-500";
      case "Moderator":
        return "text-blue-500";
      case "Creator":
        return "text-purple-500";
      default:
        return "text-muted-foreground";
    }
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-sm text-muted-foreground">
              {total.toLocaleString()} users total
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <Input
            placeholder="Search by username or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-xs"
          />
          <div className="flex gap-1">
            {ROLES.map((role) => (
              <Button
                key={role}
                variant={roleFilter === role ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setRoleFilter(role);
                  setPage(1);
                }}
              >
                {role === "all" ? "All Roles" : role}
              </Button>
            ))}
          </div>
          <div className="flex gap-1">
            {["all", "active", "blocked", "shadowbanned"].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setStatusFilter(status);
                  setPage(1);
                }}
              >
                {status === "all"
                  ? "All Status"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
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
                  <th className="px-4 py-3 text-left font-medium">Verified</th>
                  <th className="px-4 py-3 text-left font-medium">Registered</th>
                  <th className="px-4 py-3 text-left font-medium">Last Login</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <Link
                            href={`/users/${user.id}`}
                            className="font-medium hover:underline"
                          >
                            {user.username}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold ${roleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant(user.status)}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {user.isVerified18 ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleDateString()
                        : "—"}
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
                            className="text-destructive"
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
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page}{totalPages > 0 ? ` of ${totalPages}` : ""}
          </span>
          <Button variant="outline" size="sm" disabled={users.length < 20} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
