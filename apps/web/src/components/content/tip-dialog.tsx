"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GiftItem {
  id: string;
  name: string;
  iconUrl: string;
  priceCoins: number;
  category: string;
}

interface TipDialogProps {
  recipientId: string;
  recipientName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const QUICK_AMOUNTS = [5, 10, 25, 50, 100];

export function TipDialog({ recipientId, recipientName, onClose, onSuccess }: TipDialogProps) {
  const t = useTranslations();
  const { client } = useAuth();
  const [amount, setAmount] = useState("");
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const { data: giftsData } = useQuery({
    queryKey: ["gifts"],
    queryFn: () => client.get<GiftItem[]>("/gifts"),
  });
  const gifts = giftsData?.success ? giftsData.data ?? [] : [];

  async function handleSendCoins() {
    const coins = parseInt(amount, 10);
    if (!coins || coins < 1) {
      setError("Enter a valid amount");
      return;
    }
    setSending(true);
    setError("");
    const res = await client.post("/tips/send", {
      recipientId,
      amount: coins,
    });
    setSending(false);
    if (res.success) {
      onSuccess?.();
      onClose();
    } else {
      setError(res.error ?? "Failed to send tip");
    }
  }

  async function handleSendGift() {
    if (!selectedGift) return;
    setSending(true);
    setError("");
    const res = await client.post("/gifts/send", {
      recipientId,
      giftItemId: selectedGift.id,
    });
    setSending(false);
    if (res.success) {
      onSuccess?.();
      onClose();
    } else {
      setError(res.error ?? "Failed to send gift");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <Card className="w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <CardTitle>
            Tip {recipientName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="coins">
            <TabsList className="w-full">
              <TabsTrigger value="coins" className="flex-1">Coins</TabsTrigger>
              <TabsTrigger value="gifts" className="flex-1">
                Gifts{gifts.length > 0 ? ` (${gifts.length})` : ""}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="coins" className="space-y-4 mt-3">
              <div className="flex flex-wrap gap-2">
                {QUICK_AMOUNTS.map((qa) => (
                  <Button
                    key={qa}
                    variant={amount === String(qa) ? "default" : "outline"}
                    size="sm"
                    onClick={() => { setAmount(String(qa)); setSelectedGift(null); }}
                  >
                    {qa} Coins
                  </Button>
                ))}
              </div>
              <Input
                type="number"
                min={1}
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setSelectedGift(null); }}
                placeholder="Custom amount"
              />
            </TabsContent>

            <TabsContent value="gifts" className="mt-3">
              {gifts.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                  {gifts.map((gift) => (
                    <button
                      key={gift.id}
                      onClick={() => { setSelectedGift(gift); setAmount(""); }}
                      className={`flex flex-col items-center gap-1 rounded-lg border p-3 transition-colors ${
                        selectedGift?.id === gift.id ? "border-primary bg-primary/10" : "hover:bg-muted/50"
                      }`}
                    >
                      {gift.iconUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={gift.iconUrl} alt={gift.name} className="h-8 w-8 object-contain" />
                      ) : (
                        <span className="text-2xl">🎁</span>
                      )}
                      <span className="text-xs font-medium truncate w-full text-center">{gift.name}</span>
                      <Badge variant="secondary" className="text-[10px]">{gift.priceCoins}</Badge>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No gift items available</p>
              )}
            </TabsContent>
          </Tabs>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            {t("common.cancel")}
          </Button>
          {selectedGift ? (
            <Button onClick={handleSendGift} disabled={sending} className="flex-1">
              {sending ? t("common.loading") : `Send ${selectedGift.name} (${selectedGift.priceCoins})`}
            </Button>
          ) : (
            <Button onClick={handleSendCoins} disabled={sending || !amount} className="flex-1">
              {sending ? t("common.loading") : `Send ${amount || 0} Coins`}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
