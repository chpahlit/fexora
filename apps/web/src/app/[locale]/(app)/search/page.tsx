"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { ContentCard } from "@/components/content/content-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select } from "@/components/ui/select";
import { Link } from "@/i18n/navigation";
import type { ContentResponse } from "@fexora/api-client";
import type { PaginatedResponse } from "@fexora/shared";
import { ContentGridSkeleton } from "@/components/content/content-card-skeleton";
import { ListSkeleton } from "@/components/ui/page-skeleton";

interface ProfileSearchResult {
  userId: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  badges: string[];
  followerCount: number;
}

interface TagSearchResult {
  id: string;
  name: string;
  slug: string;
  usageCount: number;
}

export default function SearchPage() {
  const t = useTranslations();
  const { client } = useAuth();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");
  const [contentType, setContentType] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [page, setPage] = useState(1);

  const enabled = query.length >= 2;

  const { data: contentData, isLoading: contentLoading } = useQuery({
    queryKey: ["search", "content", query, contentType, sortBy, page],
    queryFn: () => {
      const params = new URLSearchParams({ search: query, page: String(page), pageSize: "20" });
      if (contentType !== "all") params.set("type", contentType);
      if (sortBy !== "relevance") params.set("sort", sortBy);
      return client.get<PaginatedResponse<ContentResponse>>(`/search/content?${params}`);
    },
    enabled,
  });
  const contents = contentData?.success ? contentData.data?.data ?? [] : [];
  const contentTotal = contentData?.success ? contentData.data?.total ?? 0 : 0;
  const totalPages = Math.ceil(contentTotal / 20) || 1;

  const { data: profilesData, isLoading: profilesLoading } = useQuery({
    queryKey: ["search", "profiles", query],
    queryFn: () => client.get<ProfileSearchResult[]>(`/search/profiles?q=${encodeURIComponent(query)}&limit=20`),
    enabled,
  });
  const profiles = profilesData?.success ? profilesData.data ?? [] : [];

  const { data: tagsData, isLoading: tagsLoading } = useQuery({
    queryKey: ["search", "tags", query],
    queryFn: () => client.get<TagSearchResult[]>(`/search/tags?q=${encodeURIComponent(query)}&limit=30`),
    enabled,
  });
  const tags = tagsData?.success ? tagsData.data ?? [] : [];

  const isLoading = contentLoading || profilesLoading || tagsLoading;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("common.search")}</h1>

      <Input
        placeholder="Search profiles, content, tags..."
        value={query}
        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
        className="max-w-xl"
        autoFocus
      />

      {enabled && (
        <Tabs defaultValue="all" value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="content">Content ({contentTotal})</TabsTrigger>
            <TabsTrigger value="profiles">Profiles ({profiles.length})</TabsTrigger>
            <TabsTrigger value="tags">Tags ({tags.length})</TabsTrigger>
          </TabsList>

          {/* Content Results */}
          <TabsContent value="all" className="space-y-6 mt-4">
            {/* Profiles Preview */}
            {profiles.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Profiles</h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {profiles.slice(0, 6).map((p) => (
                    <Link key={p.userId} href={`/profile/${p.username}`}>
                      <Card className="w-32 shrink-0 hover:border-primary/50 transition-colors cursor-pointer">
                        <CardContent className="flex flex-col items-center gap-2 p-3">
                          <Avatar>
                            {p.avatarUrl && <AvatarImage src={p.avatarUrl} />}
                            <AvatarFallback>{p.username[0]?.toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <p className="text-xs font-medium truncate w-full text-center">{p.username}</p>
                          <p className="text-[10px] text-muted-foreground">{p.followerCount} followers</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tags Preview */}
            {tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 10).map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => setQuery(`#${tag.name}`)}
                    >
                      #{tag.name} ({tag.usageCount})
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            {contents.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Content</h3>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {contents.map((content) => (
                    <ContentCard key={content.id} content={content} />
                  ))}
                </div>
              </div>
            )}

            {!isLoading && profiles.length === 0 && tags.length === 0 && contents.length === 0 && (
              <div className="rounded-lg border border-dashed p-12 text-center">
                <p className="text-muted-foreground">No results for &quot;{query}&quot;</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="content" className="space-y-4 mt-4">
            <div className="flex gap-3">
              <Select value={contentType} onChange={(e) => { setContentType(e.target.value); setPage(1); }} className="w-36">
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="audio">Audio</option>
                <option value="text">Text</option>
              </Select>
              <Select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }} className="w-36">
                <option value="relevance">Relevance</option>
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="price_low">Price: Low</option>
                <option value="price_high">Price: High</option>
              </Select>
            </div>

            {contentLoading ? (
              <ContentGridSkeleton count={6} />
            ) : contents.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {contents.map((content) => (
                  <ContentCard key={content.id} content={content} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-12 text-center">
                <p className="text-muted-foreground">No content found</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}>Prev</Button>
                <span className="text-sm py-2">{page} / {totalPages}</span>
                <Button variant="outline" size="sm" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages}>Next</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="profiles" className="space-y-3 mt-4">
            {profilesLoading ? (
              <ListSkeleton count={4} />
            ) : profiles.length > 0 ? (
              profiles.map((p) => (
                <Link key={p.userId} href={`/profile/${p.username}`}>
                  <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="flex items-center gap-4 p-4">
                      <Avatar>
                        {p.avatarUrl && <AvatarImage src={p.avatarUrl} />}
                        <AvatarFallback>{p.username[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{p.username}</p>
                          {p.badges?.includes("verified") && <Badge variant="default">Verified</Badge>}
                          {p.badges?.includes("creator") && <Badge variant="secondary">Creator</Badge>}
                        </div>
                        {p.bio && <p className="text-sm text-muted-foreground truncate">{p.bio}</p>}
                      </div>
                      <p className="text-sm text-muted-foreground">{p.followerCount} followers</p>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="rounded-lg border border-dashed p-12 text-center">
                <p className="text-muted-foreground">No profiles found</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="tags" className="mt-4">
            {tagsLoading ? (
              <ListSkeleton count={4} />
            ) : tags.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {tags.map((tag) => (
                  <Card key={tag.id} className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setQuery(`#${tag.name}`)}>
                    <CardContent className="flex items-center justify-between p-4">
                      <span className="font-medium">#{tag.name}</span>
                      <span className="text-sm text-muted-foreground">{tag.usageCount} posts</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-12 text-center">
                <p className="text-muted-foreground">No tags found</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {!enabled && (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">Enter at least 2 characters to search</p>
        </div>
      )}
    </div>
  );
}
