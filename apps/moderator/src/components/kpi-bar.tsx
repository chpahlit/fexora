"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LiveKPIs {
  messagesSent: number;
  avgResponseTimeSeconds: number;
  dialogsPerHour: number;
  unlocksToday: number;
  revenueToday: number;
}

function KpiValue({ label, value, unit, threshold }: {
  label: string;
  value: number;
  unit?: string;
  threshold?: { good: number; warn: number; direction: "above" | "below" };
}) {
  const [animate, setAnimate] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current !== value) {
      setAnimate(true);
      prevValue.current = value;
      const timer = setTimeout(() => setAnimate(false), 600);
      return () => clearTimeout(timer);
    }
  }, [value]);

  let color = "text-foreground";
  if (threshold) {
    const isGood = threshold.direction === "above"
      ? value >= threshold.good
      : value <= threshold.good;
    const isWarn = threshold.direction === "above"
      ? value >= threshold.warn && value < threshold.good
      : value > threshold.good && value <= threshold.warn;
    if (isGood) color = "text-green-500";
    else if (isWarn) color = "text-yellow-500";
    else color = "text-red-500";
  }

  const displayValue = unit === "s"
    ? value < 60 ? `${Math.round(value)}s` : `${Math.round(value / 60)}m`
    : value.toLocaleString();

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-muted-foreground">{label}:</span>
      <span className={cn("text-sm font-bold tabular-nums transition-transform", color, animate && "scale-110")}>
        {displayValue}
      </span>
    </div>
  );
}

export function KpiBar() {
  const { client } = useAuth();

  const { data } = useQuery({
    queryKey: ["moderator", "kpis", "live"],
    queryFn: () => client.get<LiveKPIs>("/mod/kpis/live"),
    refetchInterval: 30000,
  });

  const kpis = data?.success ? data.data : null;

  if (!kpis) return null;

  return (
    <div className="flex items-center gap-4 px-4 py-1.5 border-b bg-muted/30 text-xs">
      <Badge variant="secondary" className="text-[10px]">LIVE</Badge>
      <KpiValue
        label="Messages"
        value={kpis.messagesSent}
        threshold={{ good: 50, warn: 20, direction: "above" }}
      />
      <KpiValue
        label="Avg Response"
        value={kpis.avgResponseTimeSeconds}
        unit="s"
        threshold={{ good: 60, warn: 180, direction: "below" }}
      />
      <KpiValue
        label="Dialogs/h"
        value={kpis.dialogsPerHour}
        threshold={{ good: 5, warn: 2, direction: "above" }}
      />
      <KpiValue
        label="Unlocks"
        value={kpis.unlocksToday}
        threshold={{ good: 10, warn: 3, direction: "above" }}
      />
      <KpiValue
        label="Revenue"
        value={kpis.revenueToday}
        threshold={{ good: 1000, warn: 300, direction: "above" }}
      />
    </div>
  );
}
