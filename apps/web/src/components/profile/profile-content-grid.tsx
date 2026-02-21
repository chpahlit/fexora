"use client";

import { useAuth } from "@/lib/auth";
import { useFeed } from "@fexora/api-client";
import { ContentCard } from "@/components/content/content-card";

interface ProfileContentGridProps {
  username: string;
}

export function ProfileContentGrid({ username }: ProfileContentGridProps) {
  const { client } = useAuth();

  // Use a direct query for user content
  const { data, isLoading } = useFeed({ page: 1, pageSize: 20 });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const contents = data?.success ? data.data?.data ?? [] : [];
  const userContents = contents.filter((c) => c.ownerUsername === username);

  if (userContents.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">No posts yet</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
      {userContents.map((content) => (
        <ContentCard key={content.id} content={content} />
      ))}
    </div>
  );
}
