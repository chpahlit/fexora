"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ConsentFlags {
  marketing: boolean;
  analytics: boolean;
  personalization: boolean;
}

function PrivacyContent() {
  const t = useTranslations();
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [exportStatus, setExportStatus] = useState<"idle" | "loading" | "done">("idle");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [consent, setConsent] = useState<ConsentFlags>({ marketing: false, analytics: false, personalization: false });
  const [savingConsent, setSavingConsent] = useState(false);

  const { data: consentData } = useQuery({
    queryKey: ["user", "consent"],
    queryFn: () => client.get<ConsentFlags>("/users/me/consent"),
  });

  useEffect(() => {
    if (consentData?.success && consentData.data) {
      setConsent(consentData.data);
    }
  }, [consentData]);

  async function handleSaveConsent() {
    setSavingConsent(true);
    await client.put("/users/me/consent", consent);
    queryClient.invalidateQueries({ queryKey: ["user", "consent"] });
    setSavingConsent(false);
  }

  async function handleExport() {
    setExportStatus("loading");
    const res = await client.post<{ downloadUrl: string }>("/gdpr/export");
    if (res.success && res.data?.downloadUrl) {
      window.open(res.data.downloadUrl, "_blank");
    }
    setExportStatus("done");
  }

  async function handleDelete() {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    await client.delete("/gdpr/delete-account");
    window.location.href = "/";
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Privacy & Data (DSGVO)</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your data privacy preferences and consent settings
        </p>
      </div>

      {/* Consent Management */}
      <Card>
        <CardHeader>
          <CardTitle>Consent Preferences</CardTitle>
          <CardDescription>
            Control how your data is used. You can change these settings at any time.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="flex items-start gap-3 rounded-lg border p-4">
            <input type="checkbox" checked disabled className="mt-0.5 rounded" />
            <div>
              <p className="font-medium text-sm">Essential</p>
              <p className="text-xs text-muted-foreground">Required for the platform to function. Cannot be disabled.</p>
            </div>
          </label>
          <label className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <input
              type="checkbox"
              checked={consent.personalization}
              onChange={(e) => setConsent({ ...consent, personalization: e.target.checked })}
              className="mt-0.5 rounded"
            />
            <div>
              <p className="font-medium text-sm">Personalization</p>
              <p className="text-xs text-muted-foreground">Personalized content recommendations and feed optimization.</p>
            </div>
          </label>
          <label className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <input
              type="checkbox"
              checked={consent.analytics}
              onChange={(e) => setConsent({ ...consent, analytics: e.target.checked })}
              className="mt-0.5 rounded"
            />
            <div>
              <p className="font-medium text-sm">Analytics</p>
              <p className="text-xs text-muted-foreground">Anonymous usage statistics to help us improve the platform.</p>
            </div>
          </label>
          <label className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <input
              type="checkbox"
              checked={consent.marketing}
              onChange={(e) => setConsent({ ...consent, marketing: e.target.checked })}
              className="mt-0.5 rounded"
            />
            <div>
              <p className="font-medium text-sm">Marketing</p>
              <p className="text-xs text-muted-foreground">Email notifications about promotions and new features.</p>
            </div>
          </label>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveConsent} disabled={savingConsent}>
            {savingConsent ? "Saving..." : "Save Preferences"}
          </Button>
        </CardFooter>
      </Card>

      <Separator />

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle>Data Export</CardTitle>
          <CardDescription>
            Download all your personal data as required by DSGVO/GDPR Art. 20.
            You will receive a download link via email within 24 hours.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={handleExport} disabled={exportStatus === "loading"}>
            {exportStatus === "loading"
              ? t("common.loading")
              : exportStatus === "done"
                ? "Export requested"
                : "Request Data Export"}
          </Button>
        </CardFooter>
      </Card>

      <Separator />

      {/* Account Deletion */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Delete Account</CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data (Art. 17 DSGVO).
            This action cannot be undone. Data will be purged within 30 days.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          {deleteConfirm ? (
            <div className="flex gap-2">
              <Button variant="destructive" onClick={handleDelete}>
                Confirm Deletion
              </Button>
              <Button variant="outline" onClick={() => setDeleteConfirm(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setDeleteConfirm(true)}>
              {t("common.delete")} Account
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <ProtectedRoute>
      <PrivacyContent />
    </ProtectedRoute>
  );
}
