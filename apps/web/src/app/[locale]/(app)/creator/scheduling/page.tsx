"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Link } from "@/i18n/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ListSkeleton } from "@/components/ui/page-skeleton";
import type { ContentResponse } from "@fexora/api-client";

interface ScheduledContent extends ContentResponse {
  scheduledAt?: string;
}

function SchedulingContent() {
  const t = useTranslations();
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const { data, isLoading } = useQuery({
    queryKey: ["scheduled-content", year, month],
    queryFn: () =>
      client.get<ScheduledContent[]>(
        `/creator/content/scheduled?year=${year}&month=${month + 1}`
      ),
  });

  const scheduledItems = data?.success ? data.data ?? [] : [];

  const unschedule = useMutation({
    mutationFn: (contentId: string) =>
      client.delete(`/content/${contentId}/schedule`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduled-content"] });
    },
  });

  // Calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDow = (firstDay.getDay() + 6) % 7; // Monday = 0
    const daysInMonth = lastDay.getDate();

    const days: { date: number; isCurrentMonth: boolean; dateStr: string }[] = [];

    // Previous month padding
    const prevMonthLast = new Date(year, month, 0).getDate();
    for (let i = startDow - 1; i >= 0; i--) {
      const d = prevMonthLast - i;
      const m = month === 0 ? 12 : month;
      const y = month === 0 ? year - 1 : year;
      days.push({
        date: d,
        isCurrentMonth: false,
        dateStr: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      });
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({
        date: d,
        isCurrentMonth: true,
        dateStr: `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      });
    }

    // Next month padding to fill 6 rows
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const m = month + 2 > 12 ? 1 : month + 2;
      const y = month + 2 > 12 ? year + 1 : year;
      days.push({
        date: d,
        isCurrentMonth: false,
        dateStr: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      });
    }

    return days;
  }, [year, month]);

  // Map by date
  const itemsByDate = useMemo(() => {
    const map: Record<string, ScheduledContent[]> = {};
    for (const item of scheduledItems) {
      if (item.scheduledAt) {
        const dateStr = item.scheduledAt.slice(0, 10);
        if (!map[dateStr]) map[dateStr] = [];
        map[dateStr].push(item);
      }
    }
    return map;
  }, [scheduledItems]);

  const todayStr = new Date().toISOString().slice(0, 10);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const selectedItems = selectedDate ? itemsByDate[selectedDate] ?? [] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("scheduling.title")}</h1>
        <Link href="/creator/content" className={cn(buttonVariants({ variant: "outline" }))}>
          {t("common.back")}
        </Link>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </Button>
            <CardTitle>
              {monthNames[month]} {year}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <ListSkeleton count={5} />
          ) : (
            <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="bg-muted/50 px-2 py-2 text-center text-xs font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}

              {calendarDays.map((day, i) => {
                const items = itemsByDate[day.dateStr] ?? [];
                const isToday = day.dateStr === todayStr;
                const isSelected = day.dateStr === selectedDate;

                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(day.dateStr)}
                    className={cn(
                      "bg-background min-h-[4.5rem] p-1.5 text-left transition-colors hover:bg-muted/50",
                      !day.isCurrentMonth && "text-muted-foreground/40",
                      isSelected && "ring-2 ring-primary ring-inset",
                      isToday && "bg-primary/5"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs",
                        isToday && "bg-primary text-primary-foreground font-bold"
                      )}
                    >
                      {day.date}
                    </span>
                    {items.length > 0 && (
                      <div className="mt-0.5 space-y-0.5">
                        {items.slice(0, 2).map((item) => (
                          <div
                            key={item.id}
                            className="truncate rounded bg-primary/10 px-1 text-[10px] text-primary"
                          >
                            {item.title}
                          </div>
                        ))}
                        {items.length > 2 && (
                          <div className="text-[10px] text-muted-foreground px-1">
                            +{items.length - 2} {t("common.more").toLowerCase()}
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected date detail */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {new Date(selectedDate + "T00:00:00").toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardTitle>
              <Badge variant="secondary">
                {selectedItems.length} {t("scheduling.scheduled")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {selectedItems.length > 0 ? (
              <div className="space-y-2">
                {selectedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {item.coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.coverUrl}
                          alt=""
                          className="h-10 w-10 rounded object-cover shrink-0"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-xs shrink-0">
                          {item.type}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.scheduledAt
                            ? new Date(item.scheduledAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Link
                        href={`/content/${item.id}`}
                        className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                      >
                        {t("common.edit")}
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => unschedule.mutate(item.id)}
                        disabled={unschedule.isPending}
                      >
                        {t("common.cancel")}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-sm text-muted-foreground">{t("scheduling.noContent")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upcoming list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("scheduling.upcoming")}</CardTitle>
        </CardHeader>
        <CardContent>
          {scheduledItems.length > 0 ? (
            <div className="space-y-2">
              {scheduledItems
                .sort((a, b) => (a.scheduledAt ?? "").localeCompare(b.scheduledAt ?? ""))
                .slice(0, 10)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Badge variant="secondary" className="shrink-0 text-[10px]">
                        {item.type}
                      </Badge>
                      <span className="truncate">{item.title}</span>
                    </div>
                    <span className="text-muted-foreground text-xs shrink-0 ml-2">
                      {item.scheduledAt
                        ? new Date(item.scheduledAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{t("scheduling.noUpcoming")}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function SchedulingPage() {
  return (
    <ProtectedRoute roles={["Creator", "Admin"]}>
      <SchedulingContent />
    </ProtectedRoute>
  );
}
