"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { ContentCard } from "@/components/content/content-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@/i18n/navigation";
import type { ContentResponse } from "@fexora/api-client";
import { ContentGridSkeleton } from "@/components/content/content-card-skeleton";

interface TrendingCreator {
  userId: string;
  username: string;
  avatarUrl?: string;
  badges: string[];
  followerCount: number;
  score: number;
}

interface TrendingTag {
  id: string;
  name: string;
  slug: string;
  usageCount: number;
  score: number;
}

export default function TrendingPage() {
  const t = useTranslations();
  const { client } = useAuth();
  const [period, setPeriod] = useState<"daily" | "weekly">("daily");

  const { data: contentData, isLoading: contentLoading } = useQuery({
    queryKey: ["trending", "content", period],
    queryFn: () => client.get<ContentResponse[]>(`/trending/content?period=${period}&limit=30`),
  });
  const contents = contentData?.success ? contentData.data ?? [] : [];

  const { data: creatorsData } = useQuery({
    queryKey: ["trending", "creators", period],
    queryFn: () => client.get<TrendingCreator[]>(`/trending/creators?period=${period}&limit=20`),
  });
  const creators = creatorsData?.success ? creatorsData.data ?? [] : [];

  const { data: tagsData } = useQuery({
    queryKey: ["trending", "tags", period],
    queryFn: () => client.get<TrendingTag[]>(`/trending/tags?period=${period}&limit=30`),
  });
  const tags = tagsData?.success ? tagsData.data ?? [] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Trending</h1>
        <div className="flex gap-2">
          <Button
            variant={period === "daily" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("daily")}
          >
            Today
          </Button>
          <Button
            variant={period === "weekly" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("weekly")}
          >
            This Week
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="creators">Creators</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-4">
          {contentLoading ? (
            <ContentGridSkeleton count={6} />
          ) : contents.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {contents.map((content, i) => (
                <div key={content.id} className="relative">
                  {i < 3 && (
                    <Badge className="absolute -top-2 -left-2 z-10" variant={i === 0 ? "default" : "secondary"}>
                      #{i + 1}
                    </Badge>
                  )}
                  <ContentCard content={content} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-12 text-center">
              <p className="text-muted-foreground">No trending content yet</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="creators" className="space-y-3 mt-4">
          {creators.length > 0 ? (
            creators.map((creator, i) => (
              <Link key={creator.userId} href={`/profile/${creator.username}`}>
                <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="w-8 text-center">
                      {i < 3 ? (
                        <Badge variant={i === 0 ? "default" : "secondary"}>#{i + 1}</Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">#{i + 1}</span>
                      )}
                    </div>
                    <Avatar>
                      {creator.avatarUrl && <AvatarImage src={creator.avatarUrl} />}
                      <AvatarFallback>{creator.username[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{creator.username}</p>
                        {creator.badges?.includes("verified") && <Badge variant="default">Verified</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">{creator.followerCount.toLocaleString()} followers</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{creator.score.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Score</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="rounded-lg border border-dashed p-12 text-center">
              <p className="text-muted-foreground">No trending creators yet</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="tags" className="mt-4">
          {tags.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {tags.map((tag, i) => (
                <Card key={tag.id} className="hover:border-primary/50 transition-colors">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="w-6 text-center">
                      {i < 3 ? (
                        <Badge variant={i === 0 ? "default" : "secondary"} className="text-xs">#{i + 1}</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">#{i + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">#{tag.name}</p>
                      <p className="text-xs text-muted-foreground">{tag.usageCount.toLocaleString()} posts</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{tag.score.toLocaleString()} score</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-12 text-center">
              <p className="text-muted-foreground">No trending tags yet</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
