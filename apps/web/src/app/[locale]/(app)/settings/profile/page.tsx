"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth";
import { useUpdateProfile, useUploadAvatar } from "@fexora/api-client";
import { updateProfileSchema } from "@fexora/shared";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function ProfileSettingsContent() {
  const t = useTranslations();
  const { user } = useAuth();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const data = {
      username: (formData.get("username") as string) || undefined,
      bio: (formData.get("bio") as string) || undefined,
      country: (formData.get("country") as string) || undefined,
    };

    const validation = updateProfileSchema.safeParse(data);
    if (!validation.success) {
      setError(validation.error.issues[0]?.message ?? t("common.error"));
      return;
    }

    updateProfile.mutate(data, {
      onSuccess: (res) => {
        if (res.success) {
          setSuccess(true);
        } else {
          setError(res.error ?? t("common.error"));
        }
      },
      onError: () => setError(t("common.error")),
    });
  }

  function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadAvatar.mutate(file, {
      onError: () => setError(t("common.error")),
    });
  }

  const profile = user?.profile;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{t("profile.editProfile")}</h1>

      {/* Avatar Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Avatar</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            {profile?.avatarUrl && <AvatarImage src={profile.avatarUrl} />}
            <AvatarFallback className="text-xl">
              {(profile?.username ?? user?.email ?? "?")[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <Label htmlFor="avatar" className="cursor-pointer">
              <span className="inline-flex h-9 items-center rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
                {t("content.upload")}
              </span>
            </Label>
            <input
              id="avatar"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>
        </CardContent>
      </Card>

      {/* Profile Form */}
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-lg">{t("profile.editProfile")}</CardTitle>
            <CardDescription>
              Update your public profile information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
                {t("common.success")}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                defaultValue={profile?.username}
                minLength={3}
                maxLength={30}
                pattern="^[a-zA-Z0-9_]+$"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                defaultValue={profile?.bio ?? ""}
                maxLength={500}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country (2-letter code)</Label>
              <Input
                id="country"
                name="country"
                defaultValue={profile?.country ?? ""}
                maxLength={2}
                placeholder="DE"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? t("common.loading") : t("common.save")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function ProfileSettingsPage() {
  return (
    <ProtectedRoute>
      <ProfileSettingsContent />
    </ProtectedRoute>
  );
}
