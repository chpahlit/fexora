"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { AppShell } from "@/components/app-shell";

interface WatermarkResult {
  found: boolean;
  userId?: string;
  username?: string;
  contentId?: string;
  contentTitle?: string;
  timestamp?: string;
  confidence: number;
}

interface WatermarkConfig {
  enabled: boolean;
  algorithm: string;
  applyToImages: boolean;
  applyToVideos: boolean;
  applyToAudio: boolean;
  minPriceCoins: number;
}

interface LeakReport {
  id: string;
  contentId: string;
  contentTitle: string;
  leakedByUserId: string;
  leakedByUsername: string;
  detectedAt: string;
  source: string;
  status: "detected" | "confirmed" | "action_taken";
}

export default function WatermarkPage() {
  const { client } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<WatermarkResult | null>(null);

  const { data: configData } = useQuery({
    queryKey: ["admin", "watermark", "config"],
    queryFn: () => client.get<WatermarkConfig>("/admin/watermark/config"),
  });
  const config = configData?.success ? configData.data : null;

  const { data: leaksData } = useQuery({
    queryKey: ["admin", "watermark", "leaks"],
    queryFn: () => client.get<LeakReport[]>("/admin/watermark/leaks"),
  });
  const leaks = leaksData?.success ? leaksData.data ?? [] : [];

  async function handleAnalyze() {
    if (!file) return;
    setAnalyzing(true);
    setResult(null);
    const formData = new FormData();
    formData.append("file", file);
    const res = await client.upload<WatermarkResult>("/admin/watermark/analyze", formData);
    if (res.success && res.data) {
      setResult(res.data);
    }
    setAnalyzing(false);
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Watermark & Leak Detection</h1>
          <p className="text-sm text-muted-foreground">
            Steganographic fingerprinting for content protection and leak tracing
          </p>
        </div>

        {/* Config Status */}
        {config && (
          <div className="flex items-center gap-4">
            <Badge variant={config.enabled ? "default" : "destructive"}>
              {config.enabled ? "Active" : "Disabled"}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Algorithm: {config.algorithm} | Images: {config.applyToImages ? "Yes" : "No"} | Videos: {config.applyToVideos ? "Yes" : "No"} | Audio: {config.applyToAudio ? "Yes" : "No"} | Min Price: {config.minPriceCoins} coins
            </span>
          </div>
        )}

        <Tabs defaultValue="detect">
          <TabsList>
            <TabsTrigger value="detect">Leak Detection</TabsTrigger>
            <TabsTrigger value="history">Leak History</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
          </TabsList>

          {/* Leak Detection Tool */}
          <TabsContent value="detect" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Analyze File for Watermark</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Upload a suspected leaked file to extract the embedded watermark and identify the source user.
                </p>
                <div className="space-y-2">
                  <Label>Select File</Label>
                  <Input
                    type="file"
                    accept="image/*,video/*,audio/*"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </div>
                <Button onClick={handleAnalyze} disabled={!file || analyzing}>
                  {analyzing ? "Analyzing..." : "Extract Watermark"}
                </Button>

                {result && (
                  <div className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={result.found ? "default" : "secondary"}>
                        {result.found ? "Watermark Found" : "No Watermark"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Confidence: {Math.round(result.confidence * 100)}%
                      </span>
                    </div>
                    {result.found && (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">User</p>
                          <p className="font-medium">{result.username} ({result.userId})</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Content</p>
                          <p className="font-medium">{result.contentTitle} ({result.contentId})</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Purchased At</p>
                          <p className="font-medium">
                            {result.timestamp ? new Date(result.timestamp).toLocaleString() : "Unknown"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leak History */}
          <TabsContent value="history" className="space-y-4">
            <div className="rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left font-medium">Content</th>
                    <th className="p-3 text-left font-medium">Leaked By</th>
                    <th className="p-3 text-left font-medium">Source</th>
                    <th className="p-3 text-left font-medium">Detected</th>
                    <th className="p-3 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaks.map((leak) => (
                    <tr key={leak.id} className="border-b last:border-0">
                      <td className="p-3 font-medium">{leak.contentTitle}</td>
                      <td className="p-3">{leak.leakedByUsername}</td>
                      <td className="p-3 text-muted-foreground">{leak.source}</td>
                      <td className="p-3">{new Date(leak.detectedAt).toLocaleDateString()}</td>
                      <td className="p-3">
                        <Badge variant={
                          leak.status === "action_taken" ? "default" :
                          leak.status === "confirmed" ? "secondary" : "outline"
                        }>
                          {leak.status.replace("_", " ")}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {leaks.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">No leaks detected</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Configuration */}
          <TabsContent value="config" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Watermark Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {config ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border p-4">
                      <Label>Status</Label>
                      <p className="text-lg font-bold mt-1">{config.enabled ? "Enabled" : "Disabled"}</p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <Label>Algorithm</Label>
                      <p className="text-lg font-bold mt-1">{config.algorithm}</p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <Label>Media Types</Label>
                      <div className="flex gap-2 mt-1">
                        {config.applyToImages && <Badge>Images</Badge>}
                        {config.applyToVideos && <Badge>Videos</Badge>}
                        {config.applyToAudio && <Badge>Audio</Badge>}
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <Label>Minimum Price</Label>
                      <p className="text-lg font-bold mt-1">{config.minPriceCoins} coins</p>
                      <p className="text-xs text-muted-foreground">Only paid content above this price is watermarked</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Loading configuration...</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
