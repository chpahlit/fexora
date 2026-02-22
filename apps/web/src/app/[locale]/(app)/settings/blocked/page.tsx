"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListSkeleton } from "@/components/ui/page-skeleton";

interface BlockedUser {
  userId: string;
  username: string;
  avatarUrl?: string;
  blockedAt: string;
}

function BlockedContent() {
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [unblocking, setUnblocking] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["user", "blocked"],
    queryFn: () => client.get<BlockedUser[]>("/users/me/blocked"),
  });

  const blocked = data?.success ? data.data ?? [] : [];

  async function handleUnblock(userId: string) {
    setUnblocking(userId);
    await client.delete(`/users/${userId}/block`);
    queryClient.invalidateQueries({ queryKey: ["user", "blocked"] });
    setUnblocking(null);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Blocked Users</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your block list. Blocked users cannot see your profile, content, or message you.
        </p>
      </div>

      {isLoading ? (
        <ListSkeleton count={5} />
      ) : blocked.length > 0 ? (
        <div className="space-y-3">
          {blocked.map((user) => (
            <Card key={user.userId}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
                    <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-xs text-muted-foreground">
                      Blocked {new Date(user.blockedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUnblock(user.userId)}
                  disabled={unblocking === user.userId}
                >
                  {unblocking === user.userId ? "Unblocking..." : "Unblock"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No blocked users</p>
            <p className="text-xs text-muted-foreground mt-1">
              You can block users from their profile page.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function BlockedPage() {
  return (
    <ProtectedRoute>
      <BlockedContent />
    </ProtectedRoute>
  );
}
