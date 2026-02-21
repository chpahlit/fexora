"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ShareModalProps {
  url: string;
  title: string;
  onClose: () => void;
  onShare?: () => void;
}

export function ShareModal({ url, title, onClose, onShare }: ShareModalProps) {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onShare?.();
  }

  function handleNativeShare() {
    if (navigator.share) {
      navigator.share({ title, url });
      onShare?.();
    }
  }

  function openExternal(base: string) {
    window.open(base + encodeURIComponent(url), "_blank", "noopener");
    onShare?.();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <Card className="w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <CardTitle>{t("content.share")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input value={url} readOnly />
            <Button onClick={handleCopy} variant="outline">
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              onClick={() => openExternal("https://twitter.com/intent/tweet?url=")}
            >
              Twitter
            </Button>
            <Button
              variant="outline"
              onClick={() => openExternal("https://wa.me/?text=")}
            >
              WhatsApp
            </Button>
            <Button
              variant="outline"
              onClick={() => openExternal("https://t.me/share/url?url=")}
            >
              Telegram
            </Button>
          </div>

          {"share" in navigator && (
            <Button className="w-full" onClick={handleNativeShare}>
              {t("content.share")}...
            </Button>
          )}

          <Button variant="ghost" className="w-full" onClick={onClose}>
            {t("common.cancel")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
