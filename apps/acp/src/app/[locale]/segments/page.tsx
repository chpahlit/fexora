"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

interface SegmentFilter {
  registeredAfterDays?: number;
  registeredBeforeDays?: number;
  role?: string;
  hasPurchased?: boolean;
  hasSubscription?: boolean;
  minCoinBalance?: number;
  maxCoinBalance?: number;
}

export default function SegmentsPage() {
  const { client } = useAuth();
  const [filters, setFilters] = useState<SegmentFilter>({});
  const [previewCount, setPreviewCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handlePreview() {
    setIsLoading(true);
    try {
      const queryJson = JSON.stringify(filters);
      const res = await client.post<number>("/segments/preview", { queryJson });
      if (res.success) setPreviewCount(res.data ?? 0);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Segment Builder</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Registered after (days ago)</Label>
              <Input
                type="number"
                placeholder="e.g. 7"
                onChange={(e) =>
                  setFilters({ ...filters, registeredAfterDays: e.target.value ? parseInt(e.target.value) : undefined })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Registered before (days ago)</Label>
              <Input
                type="number"
                placeholder="e.g. 30"
                onChange={(e) =>
                  setFilters({ ...filters, registeredBeforeDays: e.target.value ? parseInt(e.target.value) : undefined })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                defaultValue="all"
                onChange={(e) => setFilters({ ...filters, role: e.target.value === "all" ? undefined : e.target.value })}
              >
                <option value="all">Any</option>
                <option value="User">User</option>
                <option value="Creator">Creator</option>
                <option value="Moderator">Moderator</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Has Purchased</Label>
              <Select
                defaultValue="any"
                onChange={(e) => setFilters({ ...filters, hasPurchased: e.target.value === "any" ? undefined : e.target.value === "yes" })}
              >
                <option value="any">Any</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Has Subscription</Label>
              <Select
                defaultValue="any"
                onChange={(e) => setFilters({ ...filters, hasSubscription: e.target.value === "any" ? undefined : e.target.value === "yes" })}
              >
                <option value="any">Any</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Min Coin Balance</Label>
              <Input
                type="number"
                placeholder="e.g. 100"
                onChange={(e) =>
                  setFilters({ ...filters, minCoinBalance: e.target.value ? parseInt(e.target.value) : undefined })
                }
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button onClick={handlePreview} disabled={isLoading}>
              {isLoading ? "Calculating..." : "Preview Segment"}
            </Button>
            {previewCount !== null && (
              <p className="text-sm font-medium">
                Estimated: <span className="text-primary">{previewCount.toLocaleString()}</span> users
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Preset Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { label: "New Users (last 7 days)", filters: { registeredAfterDays: 7 } },
              { label: "Inactive Users (30+ days)", filters: { registeredBeforeDays: 30 } },
              { label: "Buyers", filters: { hasPurchased: true } },
              { label: "Non-Buyers", filters: { hasPurchased: false } },
              { label: "Subscribers", filters: { hasSubscription: true } },
              { label: "High Balance (500+)", filters: { minCoinBalance: 500 } },
            ].map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                size="sm"
                className="justify-start"
                onClick={() => setFilters(preset.filters)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
