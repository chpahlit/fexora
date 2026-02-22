"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppShell } from "@/components/app-shell";

interface GiftItem {
  id: string;
  name: string;
  iconUrl: string;
  animationUrl?: string;
  priceCoins: number;
  isActive: boolean;
  sortOrder: number;
  category: string;
  usageCount: number;
}

interface GiftFormData {
  name: string;
  iconUrl: string;
  animationUrl: string;
  priceCoins: number;
  category: string;
}

const CATEGORIES = ["love", "funny", "celebration", "luxury", "custom"];

export default function GiftsPage() {
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<GiftFormData>({
    name: "",
    iconUrl: "",
    animationUrl: "",
    priceCoins: 10,
    category: "love",
  });
  const [saving, setSaving] = useState(false);

  const { data } = useQuery({
    queryKey: ["admin", "gifts"],
    queryFn: () => client.get<GiftItem[]>("/admin/gifts"),
  });
  const gifts = data?.success ? data.data ?? [] : [];

  function handleEdit(gift: GiftItem) {
    setForm({
      name: gift.name,
      iconUrl: gift.iconUrl,
      animationUrl: gift.animationUrl ?? "",
      priceCoins: gift.priceCoins,
      category: gift.category,
    });
    setEditingId(gift.id);
    setShowForm(true);
  }

  function handleNew() {
    setForm({ name: "", iconUrl: "", animationUrl: "", priceCoins: 10, category: "love" });
    setEditingId(null);
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    if (editingId) {
      await client.put(`/admin/gifts/${editingId}`, form);
    } else {
      await client.post("/admin/gifts", form);
    }
    queryClient.invalidateQueries({ queryKey: ["admin", "gifts"] });
    setSaving(false);
    setShowForm(false);
    setEditingId(null);
  }

  async function handleToggle(gift: GiftItem) {
    await client.patch(`/admin/gifts/${gift.id}`, { isActive: !gift.isActive });
    queryClient.invalidateQueries({ queryKey: ["admin", "gifts"] });
  }

  async function handleDelete(id: string) {
    await client.delete(`/admin/gifts/${id}`);
    queryClient.invalidateQueries({ queryKey: ["admin", "gifts"] });
  }

  const activeGifts = gifts.filter((g) => g.isActive);
  const inactiveGifts = gifts.filter((g) => !g.isActive);

  return (
    <AppShell>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gift Items</h1>
          <p className="text-sm text-muted-foreground">
            Manage gift items that users can send to creators
          </p>
        </div>
        <Button onClick={handleNew}>Add Gift Item</Button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{editingId ? "Edit Gift Item" : "New Gift Item"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Heart"
                />
              </div>
              <div className="space-y-2">
                <Label>Price (Coins)</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.priceCoins}
                  onChange={(e) => setForm({ ...form, priceCoins: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Icon URL</Label>
                <Input
                  value={form.iconUrl}
                  onChange={(e) => setForm({ ...form, iconUrl: e.target.value })}
                  placeholder="https://cdn.fexora.com/gifts/heart.png"
                />
              </div>
              <div className="space-y-2">
                <Label>Animation URL (optional)</Label>
                <Input
                  value={form.animationUrl}
                  onChange={(e) => setForm({ ...form, animationUrl: e.target.value })}
                  placeholder="https://cdn.fexora.com/gifts/heart.json"
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving || !form.name || !form.iconUrl}>
                {saving ? "Saving..." : editingId ? "Update" : "Create"}
              </Button>
              <Button variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active ({activeGifts.length})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive ({inactiveGifts.length})</TabsTrigger>
        </TabsList>

        {[
          { key: "active", items: activeGifts },
          { key: "inactive", items: inactiveGifts },
        ].map(({ key, items }) => (
          <TabsContent key={key} value={key} className="mt-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((gift) => (
                <Card key={gift.id}>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-center gap-3">
                      {gift.iconUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={gift.iconUrl} alt={gift.name} className="h-12 w-12 object-contain" />
                      ) : (
                        <div className="h-12 w-12 rounded bg-muted flex items-center justify-center text-lg">🎁</div>
                      )}
                      <div>
                        <p className="font-medium">{gift.name}</p>
                        <p className="text-sm font-bold text-primary">{gift.priceCoins} coins</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{gift.category}</Badge>
                      <span className="text-xs text-muted-foreground">{gift.usageCount} sent</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(gift)}>Edit</Button>
                      <Button variant="outline" size="sm" onClick={() => handleToggle(gift)}>
                        {gift.isActive ? "Deactivate" : "Activate"}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(gift.id)} className="text-destructive">
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {items.length === 0 && (
                <div className="col-span-full rounded-lg border border-dashed p-8 text-center">
                  <p className="text-muted-foreground">No {key} gift items</p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
    </AppShell>
  );
}
