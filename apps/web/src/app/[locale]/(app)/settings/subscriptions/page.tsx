"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ListSkeleton } from "@/components/ui/page-skeleton";

interface Subscription {
  id: string;
  creatorId: string;
  creatorUsername: string;
  creatorAvatarUrl?: string;
  tier: string;
  pricePerMonth: number;
  status: "active" | "cancelled" | "expired";
  renewsAt: string;
}

function SubscriptionsContent() {
  const t = useTranslations();
  const { client } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => client.get<Subscription[]>("/subscriptions/mine"),
  });

  const subscriptions = data?.success ? data.data ?? [] : [];

  async function handleCancel(subId: string) {
    await client.post(`/subscriptions/${subId}/cancel`);
    queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{t("creator.subscriptions")}</h1>

      {isLoading ? (
        <ListSkeleton count={5} />
      ) : subscriptions.length > 0 ? (
        <div className="space-y-3">
          {subscriptions.map((sub) => (
            <Card key={sub.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    {sub.creatorAvatarUrl && <AvatarImage src={sub.creatorAvatarUrl} />}
                    <AvatarFallback>{sub.creatorUsername[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{sub.creatorUsername}</p>
                    <p className="text-xs text-muted-foreground">
                      {sub.tier} · {sub.pricePerMonth} coins/month
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Renews: {new Date(sub.renewsAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={sub.status === "active" ? "success" : "secondary"}>
                    {sub.status}
                  </Badge>
                  {sub.status === "active" && (
                    <Button variant="ghost" size="sm" onClick={() => handleCancel(sub.id)}>
                      {t("common.cancel")}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No active subscriptions</p>
        </div>
      )}
    </div>
  );
}

export default function SubscriptionsPage() {
  return (
    <ProtectedRoute>
      <SubscriptionsContent />
    </ProtectedRoute>
  );
}
