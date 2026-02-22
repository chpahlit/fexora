"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { AppShell } from "@/components/app-shell";

interface PlatformSetting {
  key: string;
  value: string;
  category: string;
  description: string;
  updatedAt: string;
  updatedBy: string;
}

interface WordFilter {
  id: string;
  word: string;
  action: "flag" | "block";
  createdAt: string;
}

export default function PricingPolicyPage() {
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [newWord, setNewWord] = useState("");

  const { data: settingsData } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => client.get<PlatformSetting[]>("/admin/settings"),
  });

  const { data: filtersData } = useQuery({
    queryKey: ["admin", "word-filters"],
    queryFn: () => client.get<WordFilter[]>("/admin/word-filters"),
  });

  const settings = settingsData?.success ? settingsData.data ?? [] : [];
  const filters = filtersData?.success ? filtersData.data ?? [] : [];

  const categories = [...new Set(settings.map((s) => s.category))];

  async function handleSave(key: string) {
    await client.put(`/admin/settings/${key}`, { value: editValue });
    queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
    setEditingKey(null);
  }

  async function handleAddWord() {
    if (!newWord.trim()) return;
    await client.post("/admin/word-filters", { word: newWord, action: "flag" });
    queryClient.invalidateQueries({ queryKey: ["admin", "word-filters"] });
    setNewWord("");
  }

  async function handleDeleteWord(id: string) {
    await client.delete(`/admin/word-filters/${id}`);
    queryClient.invalidateQueries({ queryKey: ["admin", "word-filters"] });
  }

  return (
    <AppShell>
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pricing & Policy</h1>

      <Tabs defaultValue={categories[0] || "monetization"}>
        <TabsList>
          {categories.map((cat) => (
            <TabsTrigger key={cat} value={cat}>
              {cat}
            </TabsTrigger>
          ))}
          <TabsTrigger value="word-filter">Word Filter</TabsTrigger>
        </TabsList>

        {categories.map((cat) => (
          <TabsContent key={cat} value={cat}>
            <div className="space-y-3 mt-4">
              {settings
                .filter((s) => s.category === cat)
                .map((setting) => (
                  <Card key={setting.key}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{setting.key}</p>
                        <p className="text-xs text-muted-foreground">{setting.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Last updated by {setting.updatedBy} on {new Date(setting.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {editingKey === setting.key ? (
                          <>
                            <Input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-40"
                            />
                            <Button size="sm" onClick={() => handleSave(setting.key)}>Save</Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingKey(null)}>Cancel</Button>
                          </>
                        ) : (
                          <>
                            <Badge variant="outline" className="font-mono">{setting.value}</Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => { setEditingKey(setting.key); setEditValue(setting.value); }}
                            >
                              Edit
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}

        <TabsContent value="word-filter">
          <div className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add Word to Filter</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Input
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="Enter word or phrase..."
                />
                <Button onClick={handleAddWord} disabled={!newWord.trim()}>Add</Button>
              </CardContent>
            </Card>

            <div className="space-y-2">
              {filters.map((f) => (
                <div key={f.id} className="flex items-center justify-between rounded border p-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{f.word}</span>
                    <Badge variant={f.action === "block" ? "destructive" : "warning"}>{f.action}</Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteWord(f.id)}>
                    Remove
                  </Button>
                </div>
              ))}
              {filters.length === 0 && (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <p className="text-muted-foreground">No word filters configured</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
    </AppShell>
  );
}
