"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AgencyDetail {
  id: string;
  name: string;
  ownerUsername: string;
  status: "active" | "suspended";
  createdAt: string;
  creators: { id: string; username: string; isOwned: boolean; revenue: number }[];
  moderators: { id: string; username: string; status: string; assignedCreators: number }[];
}

export default function AgencyDetailPage() {
  const params = useParams<{ id: string }>();
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [assignSearch, setAssignSearch] = useState("");
  const [searchResults, setSearchResults] = useState<{ id: string; username: string }[]>([]);

  const { data } = useQuery({
    queryKey: ["admin", "agency", params.id],
    queryFn: () => client.get<AgencyDetail>(`/admin/agencies/${params.id}`),
  });

  const agency = data?.success ? data.data : null;

  async function handleSearchCreator() {
    if (!assignSearch.trim()) return;
    const res = await client.get<{ id: string; username: string }[]>(
      `/admin/users/search?q=${encodeURIComponent(assignSearch)}&role=Creator`
    );
    if (res.success) {
      setSearchResults(res.data ?? []);
    }
  }

  async function handleAssignCreator(creatorId: string) {
    await client.post(`/admin/agencies/${params.id}/assign-creator`, { creatorId });
    queryClient.invalidateQueries({ queryKey: ["admin", "agency", params.id] });
    setSearchResults([]);
    setAssignSearch("");
  }

  async function handleRemoveCreator(creatorId: string) {
    await client.post(`/admin/agencies/${params.id}/remove-creator`, { creatorId });
    queryClient.invalidateQueries({ queryKey: ["admin", "agency", params.id] });
  }

  if (!agency) {
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
          <h1 className="text-2xl font-bold">{agency.name}</h1>
          <p className="text-sm text-muted-foreground">Owner: {agency.ownerUsername}</p>
        </div>
        <Badge variant={agency.status === "active" ? "success" : "destructive"}>
          {agency.status}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{agency.creators.length}</p>
            <p className="text-xs text-muted-foreground">Creators</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{agency.moderators.length}</p>
            <p className="text-xs text-muted-foreground">Moderators</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">
              {agency.creators.reduce((sum, c) => sum + c.revenue, 0)}
            </p>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="creators">
        <TabsList>
          <TabsTrigger value="creators">Creators</TabsTrigger>
          <TabsTrigger value="moderators">Moderators</TabsTrigger>
          <TabsTrigger value="assign">Assign External</TabsTrigger>
        </TabsList>

        <TabsContent value="creators">
          <div className="mt-4 rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">Creator</th>
                  <th className="px-4 py-3 text-left font-medium">Type</th>
                  <th className="px-4 py-3 text-left font-medium">Revenue</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {agency.creators.map((c) => (
                  <tr key={c.id} className="border-b">
                    <td className="px-4 py-3 font-medium">{c.username}</td>
                    <td className="px-4 py-3">
                      <Badge variant={c.isOwned ? "default" : "secondary"}>
                        {c.isOwned ? "Owned" : "Assigned"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-mono">{c.revenue}</td>
                    <td className="px-4 py-3">
                      {!c.isOwned && (
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveCreator(c.id)}>
                          Remove
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="moderators">
          <div className="mt-4 rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">Moderator</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Assigned Creators</th>
                </tr>
              </thead>
              <tbody>
                {agency.moderators.map((m) => (
                  <tr key={m.id} className="border-b">
                    <td className="px-4 py-3 font-medium">{m.username}</td>
                    <td className="px-4 py-3">
                      <Badge variant={m.status === "active" ? "success" : "secondary"}>
                        {m.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">{m.assignedCreators}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="assign">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Assign External Creator</CardTitle>
              <CardDescription>Search for a creator to assign to this agency</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={assignSearch}
                  onChange={(e) => setAssignSearch(e.target.value)}
                  placeholder="Search by username..."
                />
                <Button onClick={handleSearchCreator}>Search</Button>
              </div>
              {searchResults.length > 0 && (
                <div className="space-y-2">
                  {searchResults.map((r) => (
                    <div key={r.id} className="flex items-center justify-between rounded border p-3">
                      <span className="font-medium">{r.username}</span>
                      <Button size="sm" onClick={() => handleAssignCreator(r.id)}>
                        Assign
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
