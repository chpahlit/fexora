"use client";

import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";

export function PushNotificationToggle() {
  const t = useTranslations("push");
  const { client } = useAuth();
  const [supported, setSupported] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    const check = async () => {
      if (!isPushSupported()) {
        setLoading(false);
        return;
      }
      setSupported(true);

      const permission = getPermissionState();
      if (permission === "granted") {
        const sub = await getExistingSubscription();
        setEnabled(!!sub);
      }
      setLoading(false);
    };
    check();
  }, []);

  async function handleToggle() {
    setToggling(true);
    try {
      if (enabled) {
        // Unsubscribe
        const sub = await getExistingSubscription();
        if (sub) {
          await client.post("/push/unsubscribe", { endpoint: sub.endpoint });
        }
        await unsubscribeFromPush();
        setEnabled(false);
      } else {
        // Subscribe
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          setToggling(false);
          return;
        }

        const registration = await registerServiceWorker();
        if (!registration) {
          setToggling(false);
          return;
        }

        const subscription = await subscribeToPush(registration);
        if (subscription) {
          await client.post("/push/subscribe", subscriptionToJSON(subscription));
          setEnabled(true);
        }
      }
    } finally {
      setToggling(false);
    }
  }

  if (!supported) {
    return (
      <div className="flex items-center justify-between py-1">
        <div>
          <p className="text-sm font-medium">{t("browserPush")}</p>
          <p className="text-xs text-muted-foreground">{t("notSupported")}</p>
        </div>
        <Switch checked={false} disabled />
      </div>
    );
  }

  if (loading) return null;

  const denied = getPermissionState() === "denied";

  return (
    <div className="flex items-center justify-between py-1">
      <div>
        <p className="text-sm font-medium">{t("browserPush")}</p>
        <p className="text-xs text-muted-foreground">
          {denied ? t("blocked") : enabled ? t("enabledDesc") : t("disabledDesc")}
        </p>
      </div>
      <Switch
        checked={enabled}
        onCheckedChange={handleToggle}
        disabled={toggling || denied}
      />
    </div>
  );
}
