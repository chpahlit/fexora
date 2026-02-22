"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { ContentCard } from "@/components/content/content-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ContentResponse } from "@fexora/api-client";
import type { PaginatedResponse } from "@fexora/shared";
import { ContentGridSkeleton } from "@/components/content/content-card-skeleton";

function FavoritesContent() {
  const t = useTranslations();
  const { client } = useAuth();

  const { data: favData, isLoading: favLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: () =>
      client.get<PaginatedResponse<ContentResponse>>(
        "/content/favorites?pageSize=50"
      ),
  });

  const { data: purchaseData, isLoading: purchaseLoading } = useQuery({
    queryKey: ["purchases"],
    queryFn: () =>
      client.get<PaginatedResponse<ContentResponse>>(
        "/content/purchased?pageSize=50"
      ),
  });

  const favorites = favData?.success
    ? (favData.data as PaginatedResponse<ContentResponse>)?.data ?? []
    : [];
  const purchases = purchaseData?.success
    ? (purchaseData.data as PaginatedResponse<ContentResponse>)?.data ?? []
    : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("nav.favorites")}</h1>

      <Tabs defaultValue="favorites">
        <TabsList>
          <TabsTrigger value="favorites">{t("nav.favorites")}</TabsTrigger>
          <TabsTrigger value="purchased">Purchased</TabsTrigger>
        </TabsList>

        <TabsContent value="favorites">
          {favLoading ? (
            <ContentGridSkeleton count={6} />
          ) : favorites.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
              {favorites.map((content) => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-12 text-center mt-4">
              <p className="text-muted-foreground">No favorites yet</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="purchased">
          {purchaseLoading ? (
            <ContentGridSkeleton count={6} />
          ) : purchases.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
              {purchases.map((content) => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-12 text-center mt-4">
              <p className="text-muted-foreground">No purchases yet</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function FavoritesPage() {
  return (
    <ProtectedRoute>
      <FavoritesContent />
    </ProtectedRoute>
  );
}
