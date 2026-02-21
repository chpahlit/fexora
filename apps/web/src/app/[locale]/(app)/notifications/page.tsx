"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "unlock" | "mention" | "system";
  actorUsername?: string;
  actorAvatarUrl?: string;
  message: string;
  contentId?: string;
  isRead: boolean;
  createdAt: string;
}

function NotificationsContent() {
  const t = useTranslations();
  const { client } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => client.get<Notification[]>("/notifications"),
  });

  const notifications = data?.success ? data.data ?? [] : [];

  async function markAllRead() {
    await client.post("/notifications/read-all");
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("nav.notifications")}</h1>
        {notifications.some((n) => !n.isRead) && (
          <Button variant="ghost" size="sm" onClick={markAllRead}>
            Mark all as read
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={notification.isRead ? "opacity-60" : ""}
            >
              <CardContent className="flex items-center gap-3 p-4">
                <Avatar className="h-10 w-10">
                  {notification.actorAvatarUrl && (
                    <AvatarImage src={notification.actorAvatarUrl} />
                  )}
                  <AvatarFallback>
                    {notification.type === "system"
                      ? "S"
                      : (notification.actorUsername ?? "?")[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notification.isRead && (
                  <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No notifications yet</p>
        </div>
      )}
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <ProtectedRoute>
      <NotificationsContent />
    </ProtectedRoute>
  );
}
