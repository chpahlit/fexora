"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface GiftItem {
  id: string;
  name: string;
  iconUrl: string;
  price: number;
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
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function handleSend() {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <Card className="w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <CardTitle>
            Tip {recipientName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {QUICK_AMOUNTS.map((qa) => (
              <Button
                key={qa}
                variant={amount === String(qa) ? "default" : "outline"}
                size="sm"
                onClick={() => setAmount(String(qa))}
              >
                {qa} Coins
              </Button>
            ))}
          </div>
          <Input
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Custom amount"
          />
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSend} disabled={sending || !amount} className="flex-1">
            {sending ? t("common.loading") : `Send ${amount || 0} Coins`}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
