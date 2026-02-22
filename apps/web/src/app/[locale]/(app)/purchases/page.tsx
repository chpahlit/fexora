"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ContentResponse } from "@fexora/api-client";
import type { PaginatedResponse } from "@fexora/shared";
import { ListSkeleton } from "@/components/ui/page-skeleton";

function PurchasesContent() {
  const t = useTranslations();
  const { client } = useAuth();
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading } = useQuery({
    queryKey: ["purchases", page],
    queryFn: () =>
      client.get<PaginatedResponse<ContentResponse>>(
        `/content/purchased?page=${page}&pageSize=${pageSize}`
      ),
  });

  const purchases =
    data?.success
      ? (data.data as PaginatedResponse<ContentResponse>)?.data ?? []
      : [];
  const total =
    data?.success
      ? (data.data as PaginatedResponse<ContentResponse>)?.total ?? 0
      : 0;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("purchases.title")}</h1>
        <p className="text-muted-foreground">{t("purchases.description")}</p>
      </div>

      {isLoading ? (
        <ListSkeleton count={5} />
      ) : purchases.length > 0 ? (
        <div className="space-y-3">
          {purchases.map((content) => (
            <Link key={content.id} href={`/content/${content.id}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                    {content.coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={content.coverUrl}
                        alt={content.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                        {content.type}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{content.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="h-5 w-5">
                        {content.ownerAvatarUrl && (
                          <AvatarImage src={content.ownerAvatarUrl} />
                        )}
                        <AvatarFallback className="text-[10px]">
                          {(content.ownerUsername ?? "?")[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground truncate">
                        {content.ownerUsername}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <Badge variant="secondary">
                      {content.priceCredits} {t("content.coins")}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(content.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                {t("common.back")}
              </Button>
              <span className="text-sm text-muted-foreground">
                {page} / {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                {t("common.next")}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">{t("purchases.empty")}</p>
        </div>
      )}
    </div>
  );
}

export default function PurchasesPage() {
  return (
    <ProtectedRoute>
      <PurchasesContent />
    </ProtectedRoute>
  );
}
