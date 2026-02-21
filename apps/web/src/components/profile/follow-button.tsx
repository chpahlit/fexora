"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
}

export function FollowButton({ userId, isFollowing: initialFollowing }: FollowButtonProps) {
  const t = useTranslations("profile");
  const { client, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isLoading, setIsLoading] = useState(false);

  async function handleToggle() {
    if (!isAuthenticated) return;
    setIsLoading(true);

    try {
      if (isFollowing) {
        await client.delete(`/profiles/${userId}/follow`);
        setIsFollowing(false);
      } else {
        await client.post(`/profiles/${userId}/follow`);
        setIsFollowing(true);
      }
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    } catch {
      // Revert on error
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      size="sm"
      onClick={handleToggle}
      disabled={isLoading || !isAuthenticated}
    >
      {isFollowing ? t("unfollow") : t("follow")}
    </Button>
  );
}
