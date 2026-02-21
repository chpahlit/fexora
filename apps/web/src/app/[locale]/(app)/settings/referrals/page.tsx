"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ReferralInfo {
  code: string;
  totalReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
}

function ReferralsContent() {
  const { client } = useAuth();
  const [copied, setCopied] = useState(false);

  const { data } = useQuery({
    queryKey: ["referrals"],
    queryFn: () => client.get<ReferralInfo>("/referrals/me"),
  });

  const referral = data?.success ? data.data : null;
  const referralLink = referral
    ? `${window.location.origin}/register?ref=${referral.code}`
    : "";

  function handleCopy() {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Referrals</h1>

      <Card>
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
          <CardDescription>Share this link to earn rewards for each new sign-up</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input value={referralLink} readOnly />
            <Button onClick={handleCopy} variant="outline">
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{referral?.totalReferrals ?? 0}</p>
            <p className="text-sm text-muted-foreground">Total Referrals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{referral?.totalEarnings ?? 0}</p>
            <p className="text-sm text-muted-foreground">Total Earnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{referral?.pendingEarnings ?? 0}</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ReferralsPage() {
  return (
    <ProtectedRoute>
      <ReferralsContent />
    </ProtectedRoute>
  );
}
