"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SubscriptionTier {
  id: string;
  name: string;
  priceCoins: number;
  priceEur?: number;
  perks: string[];
  subscriberCount: number;
}

interface SubscriptionTiersProps {
  creatorId: string;
}

export function SubscriptionTiers({ creatorId }: SubscriptionTiersProps) {
  const t = useTranslations();
  const { client, isAuthenticated } = useAuth();

  const { data } = useQuery({
    queryKey: ["subscription-tiers", creatorId],
    queryFn: () => client.get<SubscriptionTier[]>(`/subscriptions/tiers/${creatorId}`),
  });

  const tiers = data?.success ? data.data ?? [] : [];

  if (tiers.length === 0) return null;

  async function handleSubscribe(tierId: string) {
    await client.post("/subscriptions/subscribe", { tierId });
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">{t("creator.subscriptions")}</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tiers.map((tier) => (
          <Card key={tier.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">{tier.name}</CardTitle>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{tier.priceCoins}</span>
                <span className="text-sm text-muted-foreground">Coins/month</span>
              </div>
              {tier.priceEur !== undefined && tier.priceEur > 0 && (
                <p className="text-xs text-muted-foreground">
                  or {tier.priceEur.toFixed(2)} EUR/month
                </p>
              )}
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-1 text-sm">
                {tier.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {isAuthenticated ? (
                <Button className="w-full" onClick={() => handleSubscribe(tier.id)}>
                  Subscribe
                </Button>
              ) : (
                <Button className="w-full" variant="outline" disabled>
                  Login to subscribe
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
