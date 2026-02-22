"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AppShell } from "@/components/app-shell";

interface SegmentFilter {
  registeredAfterDays?: number;
  registeredBeforeDays?: number;
  role?: string;
  hasPurchased?: boolean;
  hasSubscription?: boolean;
  minCoinBalance?: number;
  maxCoinBalance?: number;
  isVerified?: boolean;
  hasProfilePicture?: boolean;
  minFollowers?: number;
  maxFollowers?: number;
  lastActiveWithinDays?: number;
}

interface SavedSegment {
  id: string;
  name: string;
  queryJson: string;
  estimatedCount?: number;
  createdAt: string;
}

interface PaginatedResult<T> {
  data: T[];
  total: number;
}

const PRESETS = [
  { label: "New Users (last 7 days)", filters: { registeredAfterDays: 7 } },
  { label: "Inactive (30+ days)", filters: { registeredBeforeDays: 30 } },
  { label: "Buyers", filters: { hasPurchased: true } },
  { label: "Non-Buyers", filters: { hasPurchased: false } },
  { label: "Subscribers", filters: { hasSubscription: true } },
  { label: "High Balance (500+)", filters: { minCoinBalance: 500 } },
  { label: "Verified Creators", filters: { role: "Creator", isVerified: true } },
  { label: "Active Last 3 Days", filters: { lastActiveWithinDays: 3 } },
];

function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      {children}
    </div>
  );
}

export default function SegmentsPage() {
  const { client, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<SegmentFilter>({});
  const [previewCount, setPreviewCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [segmentName, setSegmentName] = useState("");
  const [saving, setSaving] = useState(false);

  const { data: savedData } = useQuery({
    queryKey: ["admin", "segments"],
    queryFn: () => client.get<PaginatedResult<SavedSegment>>("/segments?page=1&pageSize=50"),
    enabled: isAuthenticated,
  });

  const savedSegments = savedData?.success ? savedData.data?.data ?? [] : [];

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

  async function handleSave() {
    if (!segmentName.trim()) return;
    setSaving(true);
    try {
      await client.post("/segments", {
        name: segmentName,
        queryJson: JSON.stringify(filters),
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "segments"] });
      setSegmentName("");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteSegment(id: string) {
    await client.delete(`/segments/${id}`);
    queryClient.invalidateQueries({ queryKey: ["admin", "segments"] });
  }

  function loadSegment(segment: SavedSegment) {
    try {
      const parsed = JSON.parse(segment.queryJson);
      setFilters(parsed);
      setPreviewCount(segment.estimatedCount ?? null);
    } catch {
      // invalid JSON, ignore
    }
  }

  function applyPreset(preset: { filters: Partial<SegmentFilter> }) {
    setFilters(preset.filters as SegmentFilter);
    setPreviewCount(null);
  }

  function updateFilter<K extends keyof SegmentFilter>(key: K, value: SegmentFilter[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPreviewCount(null);
  }

  const activeFilterCount = Object.values(filters).filter((v) => v !== undefined).length;

  return (
    <AppShell>
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/orchestrator" className="hover:text-foreground">Orchestrator</Link>
        <span>/</span>
        <span className="text-foreground">Segments</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Segment Builder</h1>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={() => { setFilters({}); setPreviewCount(null); }}>
            Clear All ({activeFilterCount})
          </Button>
        )}
      </div>

      <Tabs defaultValue="builder">
        <TabsList>
          <TabsTrigger value="builder">Builder</TabsTrigger>
          <TabsTrigger value="saved">Saved Segments ({savedSegments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="builder">
          <div className="space-y-6 mt-4">
            {/* Quick Presets */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Presets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  {PRESETS.map((preset) => (
                    <Button
                      key={preset.label}
                      variant="outline"
                      size="sm"
                      onClick={() => applyPreset(preset)}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Filter Builder */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Registration filters */}
                <div>
                  <p className="text-sm font-medium mb-3">Registration</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FilterField label="Registered after (days ago)">
                      <Input
                        type="number"
                        placeholder="e.g. 7"
                        value={filters.registeredAfterDays ?? ""}
                        onChange={(e) =>
                          updateFilter("registeredAfterDays", e.target.value ? parseInt(e.target.value) : undefined)
                        }
                      />
                    </FilterField>
                    <FilterField label="Registered before (days ago)">
                      <Input
                        type="number"
                        placeholder="e.g. 30"
                        value={filters.registeredBeforeDays ?? ""}
                        onChange={(e) =>
                          updateFilter("registeredBeforeDays", e.target.value ? parseInt(e.target.value) : undefined)
                        }
                      />
                    </FilterField>
                  </div>
                </div>

                <Separator />

                {/* User attributes */}
                <div>
                  <p className="text-sm font-medium mb-3">User Attributes</p>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <FilterField label="Role">
                      <Select
                        value={filters.role ?? "all"}
                        onChange={(e) => updateFilter("role", e.target.value === "all" ? undefined : e.target.value)}
                      >
                        <option value="all">Any</option>
                        <option value="User">User</option>
                        <option value="Creator">Creator</option>
                        <option value="Moderator">Moderator</option>
                      </Select>
                    </FilterField>
                    <FilterField label="Verified">
                      <Select
                        value={filters.isVerified === undefined ? "any" : filters.isVerified ? "yes" : "no"}
                        onChange={(e) => updateFilter("isVerified", e.target.value === "any" ? undefined : e.target.value === "yes")}
                      >
                        <option value="any">Any</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </Select>
                    </FilterField>
                    <FilterField label="Has Profile Picture">
                      <Select
                        value={filters.hasProfilePicture === undefined ? "any" : filters.hasProfilePicture ? "yes" : "no"}
                        onChange={(e) => updateFilter("hasProfilePicture", e.target.value === "any" ? undefined : e.target.value === "yes")}
                      >
                        <option value="any">Any</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </Select>
                    </FilterField>
                  </div>
                </div>

                <Separator />

                {/* Commerce filters */}
                <div>
                  <p className="text-sm font-medium mb-3">Commerce</p>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <FilterField label="Has Purchased">
                      <Select
                        value={filters.hasPurchased === undefined ? "any" : filters.hasPurchased ? "yes" : "no"}
                        onChange={(e) => updateFilter("hasPurchased", e.target.value === "any" ? undefined : e.target.value === "yes")}
                      >
                        <option value="any">Any</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </Select>
                    </FilterField>
                    <FilterField label="Has Subscription">
                      <Select
                        value={filters.hasSubscription === undefined ? "any" : filters.hasSubscription ? "yes" : "no"}
                        onChange={(e) => updateFilter("hasSubscription", e.target.value === "any" ? undefined : e.target.value === "yes")}
                      >
                        <option value="any">Any</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </Select>
                    </FilterField>
                    <FilterField label="Min Coin Balance">
                      <Input
                        type="number"
                        placeholder="e.g. 100"
                        value={filters.minCoinBalance ?? ""}
                        onChange={(e) =>
                          updateFilter("minCoinBalance", e.target.value ? parseInt(e.target.value) : undefined)
                        }
                      />
                    </FilterField>
                    <FilterField label="Max Coin Balance">
                      <Input
                        type="number"
                        placeholder="e.g. 10000"
                        value={filters.maxCoinBalance ?? ""}
                        onChange={(e) =>
                          updateFilter("maxCoinBalance", e.target.value ? parseInt(e.target.value) : undefined)
                        }
                      />
                    </FilterField>
                  </div>
                </div>

                <Separator />

                {/* Engagement filters */}
                <div>
                  <p className="text-sm font-medium mb-3">Engagement</p>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <FilterField label="Min Followers">
                      <Input
                        type="number"
                        placeholder="e.g. 10"
                        value={filters.minFollowers ?? ""}
                        onChange={(e) =>
                          updateFilter("minFollowers", e.target.value ? parseInt(e.target.value) : undefined)
                        }
                      />
                    </FilterField>
                    <FilterField label="Max Followers">
                      <Input
                        type="number"
                        placeholder="e.g. 1000"
                        value={filters.maxFollowers ?? ""}
                        onChange={(e) =>
                          updateFilter("maxFollowers", e.target.value ? parseInt(e.target.value) : undefined)
                        }
                      />
                    </FilterField>
                    <FilterField label="Active within (days)">
                      <Input
                        type="number"
                        placeholder="e.g. 7"
                        value={filters.lastActiveWithinDays ?? ""}
                        onChange={(e) =>
                          updateFilter("lastActiveWithinDays", e.target.value ? parseInt(e.target.value) : undefined)
                        }
                      />
                    </FilterField>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview & Save */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 flex-wrap">
                  <Button onClick={handlePreview} disabled={isLoading || activeFilterCount === 0}>
                    {isLoading ? "Calculating..." : "Preview Segment"}
                  </Button>

                  {previewCount !== null && (
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 items-center rounded-lg bg-primary/10 px-4">
                        <span className="text-lg font-bold text-primary">{previewCount.toLocaleString()}</span>
                        <span className="ml-2 text-sm text-muted-foreground">users match</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Segment name..."
                      value={segmentName}
                      onChange={(e) => setSegmentName(e.target.value)}
                      className="w-48"
                    />
                    <Button
                      variant="outline"
                      onClick={handleSave}
                      disabled={saving || !segmentName.trim() || activeFilterCount === 0}
                    >
                      {saving ? "Saving..." : "Save Segment"}
                    </Button>
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <div className="mt-3 flex gap-1 flex-wrap">
                    {Object.entries(filters).map(([key, value]) => {
                      if (value === undefined) return null;
                      return (
                        <Badge key={key} variant="secondary" className="text-xs">
                          {key}: {String(value)}
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="saved">
          <div className="mt-4">
            {savedSegments.length > 0 ? (
              <div className="space-y-3">
                {savedSegments.map((seg) => {
                  let filterCount = 0;
                  try {
                    filterCount = Object.keys(JSON.parse(seg.queryJson)).length;
                  } catch { /* ignore */ }

                  return (
                    <Card key={seg.id}>
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{seg.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {filterCount} filters
                              {seg.estimatedCount !== undefined && (
                                <> &middot; ~{seg.estimatedCount.toLocaleString()} users</>
                              )}
                              {" "}&middot; Created {new Date(seg.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => loadSegment(seg)}>
                              Load
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteSegment(seg.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-12 text-center">
                <p className="text-muted-foreground">No saved segments yet. Build one and save it.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
    </AppShell>
  );
}
