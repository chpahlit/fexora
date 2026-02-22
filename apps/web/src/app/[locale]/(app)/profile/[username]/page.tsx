"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useProfile } from "@fexora/api-client";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FollowButton } from "@/components/profile/follow-button";
import { ProfileContentGrid } from "@/components/profile/profile-content-grid";
import { SubscriptionTiers } from "@/components/profile/subscription-tiers";
import { ProfileHeaderSkeleton } from "@/components/ui/page-skeleton";
import { FollowerListModal } from "@/components/profile/follower-list-modal";
import { StoryHighlights } from "@/components/profile/story-highlights";
import { ReportModal } from "@/components/report-modal";

export default function ProfilePage() {
  const params = useParams<{ username: string }>();
  const t = useTranslations("profile");
  const { user, isAuthenticated } = useAuth();
  const { data, isLoading } = useProfile(params.username);
  const [showReport, setShowReport] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  if (isLoading) {
    return <ProfileHeaderSkeleton />;
  }

  const profile = data?.data;

  if (!profile || !data?.success) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    );
  }

  const isOwnProfile = user?.id === profile.userId;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <Avatar className="h-24 w-24">
          {profile.avatarUrl && <AvatarImage src={profile.avatarUrl} />}
          <AvatarFallback className="text-2xl">
            {profile.username[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <h1 className="text-2xl font-bold">{profile.username}</h1>
            {profile.badges?.includes("verified") && (
              <Badge variant="default">{t("verified")}</Badge>
            )}
          </div>

          {profile.bio && (
            <p className="mt-2 text-muted-foreground max-w-lg">{profile.bio}</p>
          )}

          <div className="mt-3 flex items-center gap-6 justify-center sm:justify-start text-sm">
            <div>
              <span className="font-bold">{profile.postCount ?? 0}</span>{" "}
              <span className="text-muted-foreground">{t("posts")}</span>
            </div>
            <button onClick={() => setShowFollowers(true)} className="hover:underline">
              <span className="font-bold">{profile.followerCount ?? 0}</span>{" "}
              <span className="text-muted-foreground">{t("followers")}</span>
            </button>
            <button onClick={() => setShowFollowing(true)} className="hover:underline">
              <span className="font-bold">{profile.followingCount ?? 0}</span>{" "}
              <span className="text-muted-foreground">{t("following")}</span>
            </button>
          </div>

          <div className="mt-4 flex gap-2 justify-center sm:justify-start">
            {isOwnProfile ? (
              <Button variant="outline" size="sm">
                {t("editProfile")}
              </Button>
            ) : (
              <>
                <FollowButton
                  userId={profile.userId}
                  isFollowing={profile.isFollowing ?? false}
                />
                {isAuthenticated && (
                  <Button variant="ghost" size="sm" onClick={() => setShowReport(true)}>
                    Report
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Story Highlights */}
      <StoryHighlights userId={profile.userId} isOwnProfile={isOwnProfile} />

      {/* Subscription Tiers */}
      {!isOwnProfile && profile.badges?.includes("creator") && (
        <>
          <Separator />
          <SubscriptionTiers creatorId={profile.userId} />
        </>
      )}

      <Separator />

      {/* Content Tabs */}
      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts">{t("posts")}</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <ProfileContentGrid username={params.username} />
        </TabsContent>
      </Tabs>

      {showReport && (
        <ReportModal
          targetType="profile"
          targetId={profile.userId}
          onClose={() => setShowReport(false)}
        />
      )}

      {showFollowers && (
        <FollowerListModal
          userId={profile.userId}
          type="followers"
          onClose={() => setShowFollowers(false)}
        />
      )}

      {showFollowing && (
        <FollowerListModal
          userId={profile.userId}
          type="following"
          onClose={() => setShowFollowing(false)}
        />
      )}
    </div>
  );
}
