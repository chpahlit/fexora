"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PromoCode {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  maxUses: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
}

function PromosContent() {
  const t = useTranslations();
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    code: "",
    type: "percentage" as "percentage" | "fixed",
    value: "",
    maxUses: "",
    expiresAt: "",
  });

  const { data } = useQuery({
    queryKey: ["creator", "promos"],
    queryFn: () => client.get<PromoCode[]>("/promos"),
  });
  const promos = data?.success ? data.data ?? [] : [];

  async function handleCreate() {
    await client.post("/promos", {
      code: form.code,
      type: form.type,
      value: parseInt(form.value, 10),
      maxUses: form.maxUses ? parseInt(form.maxUses, 10) : null,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
    });
    queryClient.invalidateQueries({ queryKey: ["creator", "promos"] });
    setShowCreate(false);
    setForm({ code: "", type: "percentage", value: "", maxUses: "", expiresAt: "" });
  }

  async function handleToggle(id: string, active: boolean) {
    await client.post(`/promos/${id}/${active ? "deactivate" : "activate"}`);
    queryClient.invalidateQueries({ queryKey: ["creator", "promos"] });
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Promo Codes</h1>
        <Button onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? t("common.cancel") : "Create Code"}
        </Button>
      </div>

      {showCreate && (
        <Card>
          <CardHeader>
            <CardTitle>New Promo Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Code</Label>
              <Input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="e.g. SUMMER25"
                maxLength={20}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as "percentage" | "fixed" })}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed (Coins)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Value</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  placeholder={form.type === "percentage" ? "e.g. 25" : "e.g. 50"}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Max Uses (optional)</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.maxUses}
                  onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                  placeholder="Unlimited"
                />
              </div>
              <div className="space-y-2">
                <Label>Expires (optional)</Label>
                <Input
                  type="datetime-local"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleCreate} disabled={!form.code || !form.value}>
              Create
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="space-y-3">
        {promos.length > 0 ? (
          promos.map((promo) => (
            <Card key={promo.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-mono font-bold">{promo.code}</p>
                    <Badge variant={promo.isActive ? "success" : "secondary"}>
                      {promo.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {promo.type === "percentage" ? `${promo.value}% off` : `${promo.value} coins off`}
                    {" · "}
                    {promo.usedCount}/{promo.maxUses || "∞"} uses
                    {promo.expiresAt && ` · Expires ${new Date(promo.expiresAt).toLocaleDateString()}`}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggle(promo.id, promo.isActive)}
                >
                  {promo.isActive ? "Deactivate" : "Activate"}
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">No promo codes yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PromosPage() {
  return (
    <ProtectedRoute roles={["Creator", "Admin"]}>
      <PromosContent />
    </ProtectedRoute>
  );
}
