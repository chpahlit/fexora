"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth";
import { useInfiniteFeed } from "@fexora/api-client";
import { ContentCard } from "@/components/content/content-card";
import { StoryBar } from "@/components/content/story-bar";
import { Button } from "@/components/ui/button";

export default function FeedPage() {
  const t = useTranslations();
  const { isAuthenticated } = useAuth();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteFeed(20);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Infinite scroll observer
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allContent =
    data?.pages.flatMap((page) =>
      page.success ? page.data?.data ?? [] : []
    ) ?? [];

  return (
    <div className="space-y-6">
      {/* Story Bar */}
      <StoryBar />

      <h1 className="text-2xl font-bold">{t("nav.home")}</h1>

      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}

      {allContent.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allContent.map((content) => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
          <div ref={loadMoreRef} className="flex justify-center py-4">
            {isFetchingNextPage && (
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            )}
            {!hasNextPage && allContent.length > 0 && (
              <p className="text-sm text-muted-foreground">
                You&apos;ve reached the end
              </p>
            )}
          </div>
        </>
      ) : (
        !isLoading && (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <p className="text-muted-foreground">
              {isAuthenticated
                ? "No content in your feed yet. Follow creators to see their posts!"
                : "Sign in to see your personalized feed."}
            </p>
          </div>
        )
      )}
    </div>
  );
}
