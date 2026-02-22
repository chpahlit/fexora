"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth";
import {
  isPushSupported,
  getPermissionState,
  registerServiceWorker,
  subscribeToPush,
  getExistingSubscription,
  unsubscribeFromPush,
  subscriptionToJSON,
} from "@/lib/push-notifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const DISMISSED_KEY = "fexora_push_dismissed";

export function PushNotificationPrompt() {
  const t = useTranslations("push");
  const { isAuthenticated, client } = useAuth();
  const [show, setShow] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!isPushSupported()) return;

    const dismissed = sessionStorage.getItem(DISMISSED_KEY);
    if (dismissed) return;

    const permission = getPermissionState();
    if (permission === "granted") {
      // Already granted, ensure subscription is synced
      syncSubscription();
      return;
    }
    if (permission === "denied") return;

    // Show the prompt for "default" permission state
    const timer = setTimeout(() => setShow(true), 5000);
    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  const syncSubscription = useCallback(async () => {
    const existing = await getExistingSubscription();
    if (existing) {
      await client.post("/push/subscribe", subscriptionToJSON(existing));
    }
  }, [client]);

  async function handleEnable() {
    setSubscribing(true);
    try {
      const registration = await registerServiceWorker();
      if (!registration) return;

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setShow(false);
        return;
      }

      const subscription = await subscribeToPush(registration);
      if (subscription) {
        await client.post("/push/subscribe", subscriptionToJSON(subscription));
      }
    } finally {
      setSubscribing(false);
      setShow(false);
    }
  }

  function handleDismiss() {
    sessionStorage.setItem(DISMISSED_KEY, "1");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-4">
      <Card className="shadow-lg border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{t("promptTitle")}</p>
              <p className="text-xs text-muted-foreground mt-1">{t("promptDescription")}</p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={handleEnable} disabled={subscribing}>
                  {subscribing ? t("enabling") : t("enable")}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleDismiss}>
                  {t("later")}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
