"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppShell } from "@/components/app-shell";

interface Agency {
  id: string;
  name: string;
  ownerUsername: string;
  status: "active" | "suspended";
  creatorCount: number;
  moderatorCount: number;
  totalRevenue: number;
  createdAt: string;
}

export default function AgenciesPage() {
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data } = useQuery({
    queryKey: ["admin", "agencies", search],
    queryFn: () => client.get<Agency[]>(`/admin/agencies?search=${encodeURIComponent(search)}`),
  });

  const agencies = data?.success ? data.data ?? [] : [];

  async function handleToggleStatus(id: string, currentStatus: string) {
    const action = currentStatus === "active" ? "suspend" : "activate";
    await client.post(`/admin/agencies/${id}/${action}`);
    queryClient.invalidateQueries({ queryKey: ["admin", "agencies"] });
  }

  return (
    <AppShell>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Agency Management</h1>
      </div>

      <Input
        placeholder="Search agencies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Agency</th>
              <th className="px-4 py-3 text-left font-medium">Owner</th>
              <th className="px-4 py-3 text-left font-medium">Creators</th>
              <th className="px-4 py-3 text-left font-medium">Moderators</th>
              <th className="px-4 py-3 text-left font-medium">Revenue</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {agencies.map((agency) => (
              <tr key={agency.id} className="border-b hover:bg-muted/30">
                <td className="px-4 py-3">
                  <Link href={`/agencies/${agency.id}`} className="font-medium hover:underline">
                    {agency.name}
                  </Link>
                </td>
                <td className="px-4 py-3">{agency.ownerUsername}</td>
                <td className="px-4 py-3">{agency.creatorCount}</td>
                <td className="px-4 py-3">{agency.moderatorCount}</td>
                <td className="px-4 py-3 font-mono">{agency.totalRevenue}</td>
                <td className="px-4 py-3">
                  <Badge variant={agency.status === "active" ? "success" : "destructive"}>
                    {agency.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Link href={`/agencies/${agency.id}`}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(agency.id, agency.status)}
                    >
                      {agency.status === "active" ? "Suspend" : "Activate"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {agencies.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No agencies found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </AppShell>
  );
}
