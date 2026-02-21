"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth";
import { useMyContent } from "@fexora/api-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface Bundle {
  id: string;
  title: string;
  description: string;
  priceCoins: number;
  originalPrice: number;
  itemCount: number;
  purchaseCount: number;
  isActive: boolean;
}

function BundlesContent() {
  const t = useTranslations();
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const { data: contentData } = useMyContent({ page: 1, pageSize: 200 });
  const contents = contentData?.success ? contentData.data?.data ?? [] : [];
  const paidContents = contents.filter((c) => c.priceCredits > 0 && c.status === "Approved");

  const { data: bundleData } = useQuery({
    queryKey: ["creator", "bundles"],
    queryFn: () => client.get<Bundle[]>("/bundles/mine"),
  });
  const bundles = bundleData?.success ? bundleData.data ?? [] : [];

  function toggleItem(id: string) {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  const originalTotal = paidContents
    .filter((c) => selectedItems.includes(c.id))
    .reduce((sum, c) => sum + c.priceCredits, 0);

  async function handleCreate() {
    if (!title || !price || selectedItems.length < 2) return;
    await client.post("/bundles", {
      title,
      description,
      priceCoins: parseInt(price, 10),
      contentIds: selectedItems,
    });
    queryClient.invalidateQueries({ queryKey: ["creator", "bundles"] });
    setShowCreate(false);
    setTitle("");
    setDescription("");
    setPrice("");
    setSelectedItems([]);
  }

  async function handleToggle(id: string, active: boolean) {
    await client.post(`/bundles/${id}/${active ? "deactivate" : "activate"}`);
    queryClient.invalidateQueries({ queryKey: ["creator", "bundles"] });
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bundles & Collections</h1>
        <Button onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? t("common.cancel") : "Create Bundle"}
        </Button>
      </div>

      {showCreate && (
        <Card>
          <CardHeader>
            <CardTitle>New Bundle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Bundle Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Best of 2025"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's in this bundle?"
              />
            </div>

            <div className="space-y-2">
              <Label>Select Content (min. 2)</Label>
              <div className="max-h-48 overflow-y-auto rounded border p-2 space-y-2">
                {paidContents.map((c) => (
                  <label key={c.id} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={selectedItems.includes(c.id)}
                      onCheckedChange={() => toggleItem(c.id)}
                    />
                    <span className="flex-1 truncate">{c.title}</span>
                    <span className="text-muted-foreground">{c.priceCredits} coins</span>
                  </label>
                ))}
                {paidContents.length === 0 && (
                  <p className="text-xs text-muted-foreground p-2">No paid content available</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Bundle Price (must be less than {originalTotal} coins)</Label>
              <Input
                type="number"
                min={1}
                max={originalTotal - 1 || undefined}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Bundle discount price"
              />
              {originalTotal > 0 && price && (
                <p className="text-xs text-muted-foreground">
                  Save {originalTotal - parseInt(price, 10)} coins ({Math.round((1 - parseInt(price, 10) / originalTotal) * 100)}% off)
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleCreate}
              disabled={!title || !price || selectedItems.length < 2 || parseInt(price, 10) >= originalTotal}
            >
              Create Bundle
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="space-y-3">
        {bundles.length > 0 ? (
          bundles.map((bundle) => (
            <Card key={bundle.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{bundle.title}</p>
                    <Badge variant={bundle.isActive ? "success" : "secondary"}>
                      {bundle.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {bundle.itemCount} items · {bundle.priceCoins} coins
                    <span className="line-through ml-1">{bundle.originalPrice}</span>
                    {" · "}{bundle.purchaseCount} purchases
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggle(bundle.id, bundle.isActive)}
                >
                  {bundle.isActive ? "Deactivate" : "Activate"}
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">No bundles yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BundlesPage() {
  return (
    <ProtectedRoute roles={["Creator", "Admin"]}>
      <BundlesContent />
    </ProtectedRoute>
  );
}
