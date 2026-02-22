"use client";

import { useTranslations } from "next-intl";
import { useWalletBalance, useTransactions, useTopup } from "@fexora/api-client";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ListSkeleton } from "@/components/ui/page-skeleton";

const COIN_PACKS = [
  { amount: 100, label: "100 Coins", price: "€4.99" },
  { amount: 250, label: "250 Coins", price: "€9.99" },
  { amount: 500, label: "500 Coins", price: "€18.99" },
  { amount: 1000, label: "1000 Coins", price: "€34.99" },
  { amount: 2500, label: "2500 Coins", price: "€79.99" },
  { amount: 5000, label: "5000 Coins", price: "€149.99" },
];

function WalletContent() {
  const t = useTranslations();
  const { data: balanceData, isLoading: balanceLoading } = useWalletBalance();
  const { data: txData, isLoading: txLoading } = useTransactions({
    page: 1,
    pageSize: 20,
  });
  const topup = useTopup();

  const balance = balanceData?.success ? balanceData.data?.balance ?? 0 : 0;
  const transactions = txData?.success ? txData.data?.data ?? [] : [];

  function handleTopup(amount: number) {
    topup.mutate(
      { amount },
      {
        onSuccess: (res) => {
          if (res.success && res.data?.sessionUrl) {
            window.location.href = res.data.sessionUrl;
          }
        },
      }
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{t("nav.wallet")}</h1>

      {/* Balance Card */}
      <Card>
        <CardHeader>
          <CardDescription>{t("wallet.balance")}</CardDescription>
          <CardTitle className="text-4xl">
            {balanceLoading ? "..." : balance} {t("content.coins")}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Coin Packs */}
      <div>
        <h2 className="text-lg font-semibold mb-4">{t("wallet.coinPacks")}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COIN_PACKS.map((pack) => (
            <Card key={pack.amount} className="hover:border-primary/50 transition-colors">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-bold">{pack.label}</p>
                  <p className="text-sm text-muted-foreground">{pack.price}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleTopup(pack.amount)}
                  disabled={topup.isPending}
                >
                  {t("wallet.topup")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Transaction History */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          {t("wallet.transactions")}
        </h2>
        {txLoading ? (
          <ListSkeleton count={4} />
        ) : transactions.length > 0 ? (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <Card key={tx.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(tx.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Badge
                    variant={tx.amount > 0 ? "success" : "destructive"}
                  >
                    {tx.amount > 0 ? "+" : ""}
                    {tx.amount}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">No transactions yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function WalletPage() {
  return (
    <ProtectedRoute>
      <WalletContent />
    </ProtectedRoute>
  );
}
