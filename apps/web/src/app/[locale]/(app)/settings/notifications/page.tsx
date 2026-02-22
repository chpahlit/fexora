"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ListSkeleton } from "@/components/ui/page-skeleton";
import { PushNotificationToggle } from "@/components/push-notification-toggle";

interface NotificationSettings {
  emailLikes: boolean;
  emailComments: boolean;
  emailFollows: boolean;
  emailUnlocks: boolean;
  emailMentions: boolean;
  emailMessages: boolean;
  emailSystem: boolean;
  pushLikes: boolean;
  pushComments: boolean;
  pushFollows: boolean;
  pushUnlocks: boolean;
  pushMentions: boolean;
  pushMessages: boolean;
  pushSystem: boolean;
}

const defaultSettings: NotificationSettings = {
  emailLikes: true,
  emailComments: true,
  emailFollows: true,
  emailUnlocks: true,
  emailMentions: true,
  emailMessages: true,
  emailSystem: true,
  pushLikes: true,
  pushComments: true,
  pushFollows: true,
  pushUnlocks: true,
  pushMentions: true,
  pushMessages: true,
  pushSystem: true,
};

function NotificationSettingsContent() {
  const t = useTranslations();
  const { client } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notification-settings"],
    queryFn: () => client.get<NotificationSettings>("/users/me/notification-settings"),
  });

  const settings: NotificationSettings = data?.success && data.data ? data.data : defaultSettings;
  const [local, setLocal] = useState<NotificationSettings | null>(null);
  const current = local ?? settings;

  const save = useMutation({
    mutationFn: (body: NotificationSettings) =>
      client.put("/users/me/notification-settings", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-settings"] });
      setLocal(null);
    },
  });

  function toggle(key: keyof NotificationSettings) {
    const next = { ...current, [key]: !current[key] };
    setLocal(next);
  }

  const hasChanges = local !== null;

  const categories = [
    {
      titleKey: "notificationSettings.likes",
      descKey: "notificationSettings.likesDesc",
      emailKey: "emailLikes" as const,
      pushKey: "pushLikes" as const,
    },
    {
      titleKey: "notificationSettings.comments",
      descKey: "notificationSettings.commentsDesc",
      emailKey: "emailComments" as const,
      pushKey: "pushComments" as const,
    },
    {
      titleKey: "notificationSettings.follows",
      descKey: "notificationSettings.followsDesc",
      emailKey: "emailFollows" as const,
      pushKey: "pushFollows" as const,
    },
    {
      titleKey: "notificationSettings.unlocks",
      descKey: "notificationSettings.unlocksDesc",
      emailKey: "emailUnlocks" as const,
      pushKey: "pushUnlocks" as const,
    },
    {
      titleKey: "notificationSettings.mentions",
      descKey: "notificationSettings.mentionsDesc",
      emailKey: "emailMentions" as const,
      pushKey: "pushMentions" as const,
    },
    {
      titleKey: "notificationSettings.messages",
      descKey: "notificationSettings.messagesDesc",
      emailKey: "emailMessages" as const,
      pushKey: "pushMessages" as const,
    },
    {
      titleKey: "notificationSettings.system",
      descKey: "notificationSettings.systemDesc",
      emailKey: "emailSystem" as const,
      pushKey: "pushSystem" as const,
    },
  ];

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">{t("notificationSettings.title")}</h1>
        <ListSkeleton count={7} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("notificationSettings.title")}</h1>
        <p className="text-muted-foreground">{t("notificationSettings.description")}</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{t("notificationSettings.title")}</CardTitle>
            <div className="flex items-center gap-6 text-xs font-medium text-muted-foreground">
              <span>{t("notificationSettings.email")}</span>
              <span>{t("notificationSettings.push")}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          {categories.map((cat, i) => (
            <div key={cat.emailKey}>
              {i > 0 && <Separator className="my-3" />}
              <div className="flex items-center justify-between py-1">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-sm font-medium">{t(cat.titleKey)}</p>
                  <p className="text-xs text-muted-foreground">{t(cat.descKey)}</p>
                </div>
                <div className="flex items-center gap-6">
                  <Switch
                    checked={current[cat.emailKey]}
                    onCheckedChange={() => toggle(cat.emailKey)}
                  />
                  <Switch
                    checked={current[cat.pushKey]}
                    onCheckedChange={() => toggle(cat.pushKey)}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Browser Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("push.browserPush")}</CardTitle>
          <CardDescription>{t("push.browserPushDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <PushNotificationToggle />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        {hasChanges && (
          <Button variant="ghost" onClick={() => setLocal(null)}>
            {t("common.cancel")}
          </Button>
        )}
        <Button
          onClick={() => save.mutate(current)}
          disabled={!hasChanges || save.isPending}
        >
          {save.isPending ? t("common.loading") : t("common.save")}
        </Button>
      </div>
    </div>
  );
}

export default function NotificationSettingsPage() {
  return (
    <ProtectedRoute>
      <NotificationSettingsContent />
    </ProtectedRoute>
  );
}
