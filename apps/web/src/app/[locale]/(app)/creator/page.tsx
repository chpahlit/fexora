"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth";
import { useMyContent, useWalletBalance } from "@fexora/api-client";
import { useQuery } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Link } from "@/i18n/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface CreatorStats {
  totalEarnings: number;
  totalFans: number;
  totalContent: number;
  monthlyEarnings: number;
}

function CreatorDashboardContent() {
  const t = useTranslations();
  const { client } = useAuth();
  const { data: contentData } = useMyContent({ page: 1, pageSize: 50 });
  const { data: balanceData } = useWalletBalance();

  const { data: statsData } = useQuery({
    queryKey: ["creator", "stats"],
    queryFn: () => client.get<CreatorStats>("/creator/stats"),
  });

  const stats = statsData?.success ? statsData.data : null;
  const contents = contentData?.success
    ? contentData.data?.data ?? []
    : [];
  const balance = balanceData?.success ? balanceData.data?.balance ?? 0 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("creator.dashboard")}</h1>
        <Link href="/upload" className={cn(buttonVariants())}>
          {t("content.upload")}
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t("creator.earnings")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.totalEarnings ?? 0}</p>
            <p className="text-xs text-muted-foreground">
              {stats?.monthlyEarnings ?? 0} this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t("creator.fans")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.totalFans ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t("creator.content")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.totalContent ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t("wallet.balance")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{balance} Coins</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Management */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">{t("common.all")}</TabsTrigger>
          <TabsTrigger value="published">{t("content.approved")}</TabsTrigger>
          <TabsTrigger value="pending">{t("content.pending")}</TabsTrigger>
          <TabsTrigger value="draft">{t("content.draft")}</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {contents.length > 0 ? (
            <div className="space-y-3 mt-4">
              {contents.map((content) => (
                <Card key={content.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {content.coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={content.coverUrl}
                          alt=""
                          className="h-12 w-12 rounded object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded bg-muted flex items-center justify-center text-xs">
                          {content.type}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium truncate">{content.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {content.priceCredits > 0
                            ? `${content.priceCredits} coins`
                            : "Free"}{" "}
                          · {new Date(content.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right text-sm">
                        <p>♡ {content.likeCount ?? 0}</p>
                        <p>💬 {content.commentCount ?? 0}</p>
                      </div>
                      <Badge
                        variant={
                          content.status === "Approved"
                            ? "success"
                            : content.status === "Pending"
                              ? "warning"
                              : content.status === "Rejected"
                                ? "destructive"
                                : "secondary"
                        }
                      >
                        {content.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-12 text-center mt-4">
              <p className="text-muted-foreground">
                No content yet. Start creating!
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function CreatorDashboardPage() {
  return (
    <ProtectedRoute roles={["Creator", "Admin"]}>
      <CreatorDashboardContent />
    </ProtectedRoute>
  );
}
