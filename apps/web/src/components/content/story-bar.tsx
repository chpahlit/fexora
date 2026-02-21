"use client";

import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "@fexora/shared";

interface Story {
  id: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  hasUnread: boolean;
}

export function StoryBar() {
  const { client, isAuthenticated } = useAuth();

  const { data } = useQuery({
    queryKey: ["stories"],
    queryFn: () => client.get<Story[]>("/stories"),
    enabled: isAuthenticated,
  });

  const stories = data?.success ? data.data ?? [] : [];

  if (stories.length === 0) return null;

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {stories.map((story) => (
        <button
          key={story.id}
          className="flex flex-col items-center gap-1 min-w-[72px]"
        >
          <div
            className={`rounded-full p-[2px] ${
              story.hasUnread
                ? "bg-gradient-to-tr from-primary to-accent"
                : "bg-muted"
            }`}
          >
            <Avatar className="h-14 w-14 border-2 border-background">
              {story.avatarUrl && <AvatarImage src={story.avatarUrl} />}
              <AvatarFallback>
                {story.username[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <span className="text-xs text-muted-foreground truncate max-w-[72px]">
            {story.username}
          </span>
        </button>
      ))}
    </div>
  );
}
