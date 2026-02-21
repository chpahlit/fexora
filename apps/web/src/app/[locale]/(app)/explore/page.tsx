"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth";
import { useFeed } from "@fexora/api-client";
import { useQuery } from "@tanstack/react-query";
import { ContentCard } from "@/components/content/content-card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ContentResponse } from "@fexora/api-client";
import type { ApiResponse, PaginatedResponse } from "@fexora/shared";

export default function ExplorePage() {
  const t = useTranslations();
  const { client } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("trending");

  const { data: feedData, isLoading: feedLoading } = useFeed({
    page: 1,
    pageSize: 30,
  });

  const { data: searchData, isLoading: searchLoading } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: () =>
      client.get<PaginatedResponse<ContentResponse>>(
        `/content/feed?search=${encodeURIComponent(searchQuery)}&pageSize=30`
      ),
    enabled: searchQuery.length >= 2,
  });

  const { data: trendingData } = useQuery({
    queryKey: ["trending"],
    queryFn: () =>
      client.get<string[]>("/content/trending-tags"),
  });

  const isSearching = searchQuery.length >= 2;
  const data = isSearching ? searchData : feedData;
  const isLoading = isSearching ? searchLoading : feedLoading;
  const contents = data?.success
    ? (data.data as PaginatedResponse<ContentResponse>)?.data ?? []
    : [];
  const trendingTags = trendingData?.success ? trendingData.data ?? [] : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("nav.explore")}</h1>

      {/* Search */}
      <Input
        placeholder={`${t("common.search")}...`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="max-w-md"
      />

      {/* Trending Tags */}
      {trendingTags.length > 0 && !isSearching && (
        <div className="flex flex-wrap gap-2">
          {trendingTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => setSearchQuery(tag)}
            >
              #{tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Content Tabs */}
      {!isSearching && (
        <Tabs defaultValue="trending" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="top">Top</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : contents.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {contents.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">
            {isSearching
              ? `No results for "${searchQuery}"`
              : "No content to explore yet."}
          </p>
        </div>
      )}
    </div>
  );
}
