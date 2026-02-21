"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface TwoFactorStatus {
  isEnabled: boolean;
}

interface TwoFactorSetup {
  qrCodeUrl: string;
  secret: string;
}

function SecurityContent() {
  const t = useTranslations();
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [setupData, setSetupData] = useState<TwoFactorSetup | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [error, setError] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const { data: statusData } = useQuery({
    queryKey: ["2fa", "status"],
    queryFn: () => client.get<TwoFactorStatus>("/auth/2fa/status"),
  });

  const is2FAEnabled = statusData?.success ? statusData.data?.isEnabled ?? false : false;

  async function handleEnable2FA() {
    const res = await client.post<TwoFactorSetup>("/auth/2fa/enable");
    if (res.success && res.data) {
      setSetupData(res.data);
    }
  }

  async function handleVerify2FA() {
    setError("");
    const res = await client.post<{ backupCodes: string[] }>("/auth/2fa/verify", {
      code: verifyCode,
    });
    if (res.success && res.data) {
      setBackupCodes(res.data.backupCodes);
      setSetupData(null);
      queryClient.invalidateQueries({ queryKey: ["2fa"] });
    } else {
      setError(res.error ?? "Invalid code");
    }
  }

  async function handleDisable2FA() {
    await client.post("/auth/2fa/disable");
    queryClient.invalidateQueries({ queryKey: ["2fa"] });
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Security</h1>

      {/* 2FA Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("auth.twoFactor")}</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </div>
            <Badge variant={is2FAEnabled ? "success" : "secondary"}>
              {is2FAEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {setupData && (
            <div className="space-y-4">
              <p className="text-sm">Scan the QR code with your authenticator app:</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={setupData.qrCodeUrl} alt="QR Code" className="mx-auto" />
              <p className="text-xs text-muted-foreground text-center">
                Manual entry: {setupData.secret}
              </p>
              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                />
                <Button onClick={handleVerify2FA}>{t("common.confirm")}</Button>
              </div>
            </div>
          )}

          {backupCodes.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">{t("auth.backupCodes")}:</p>
              <div className="grid grid-cols-2 gap-1 rounded-md bg-muted p-3 font-mono text-sm">
                {backupCodes.map((code) => (
                  <span key={code}>{code}</span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Save these codes in a safe place. Each can only be used once.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {is2FAEnabled ? (
            <Button variant="destructive" onClick={handleDisable2FA}>
              Disable 2FA
            </Button>
          ) : !setupData ? (
            <Button onClick={handleEnable2FA}>Enable 2FA</Button>
          ) : null}
        </CardFooter>
      </Card>

      <Separator />

      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input type="password" />
          </div>
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input type="password" />
          </div>
          <div className="space-y-2">
            <Label>Confirm New Password</Label>
            <Input type="password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>{t("common.save")}</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function SecurityPage() {
  return (
    <ProtectedRoute>
      <SecurityContent />
    </ProtectedRoute>
  );
}
