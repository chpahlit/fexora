"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const settingsLinks = [
  { href: "/settings/profile", title: "Profile", description: "Update your public profile" },
  { href: "/settings/security", title: "Security & 2FA", description: "Manage password and two-factor auth" },
  { href: "/settings/subscriptions", title: "Subscriptions", description: "Manage your subscriptions" },
  { href: "/settings/referrals", title: "Referrals", description: "Your referral code and stats" },
  { href: "/settings/privacy", title: "Privacy & Data", description: "DSGVO data export and deletion" },
];

function SettingsContent() {
  const t = useTranslations();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{t("nav.settings")}</h1>

      <div className="space-y-3">
        {settingsLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader className="py-4">
                <CardTitle className="text-base">{link.title}</CardTitle>
                <CardDescription>{link.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}
