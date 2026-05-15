"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface FollowUser {
  userId: string;
  username: string;
  avatarUrl?: string;
  isFollowing?: boolean;
}

interface FollowerListModalProps {
  userId: string;
  type: "followers" | "following";
  onClose: () => void;
}

export function FollowerListModal({ userId, type, onClose }: FollowerListModalProps) {
  const { client } = useAuth();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["users", userId, type, page],
    queryFn: () => client.get<FollowUser[]>(`/users/${userId}/${type}?page=${page}&pageSize=30`),
  });
  const users = data?.success ? data.data ?? [] : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <Card className="w-full max-w-md mx-4 max-h-[70vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg">
            {type === "followers" ? "Followers" : "Following"}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </CardHeader>
        <CardContent className="overflow-y-auto flex-1 space-y-2 pb-4">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}
            </div>
          ) : users.length > 0 ? (
            users.map((u) => (
              <Link key={u.userId} href={`/profile/${u.username}`} onClick={onClose}>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <Avatar className="h-10 w-10">
                    {u.avatarUrl && <AvatarImage src={u.avatarUrl} />}
                    <AvatarFallback>{u.username[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <p className="font-medium text-sm flex-1">{u.username}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">
              {type === "followers" ? "No followers yet" : "Not following anyone"}
            </div>
          )}

          {users.length === 30 && (
            <div className="flex justify-center pt-2">
              <Button variant="outline" size="sm" onClick={() => setPage(page + 1)}>
                Load more
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
