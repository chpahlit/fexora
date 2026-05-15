"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth";
import { useCreateComment, useDeleteComment } from "@fexora/api-client";
import type { CommentResponse } from "@fexora/api-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface CommentItemProps {
  comment: CommentResponse;
  contentId: string;
  depth?: number;
}

function CommentItem({ comment, contentId, depth = 0 }: CommentItemProps) {
  const t = useTranslations();
  const { user, isAuthenticated } = useAuth();
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const createComment = useCreateComment(contentId);
  const deleteComment = useDeleteComment(contentId);

  const isOwn = user?.id === comment.userId;
  const maxDepth = 3;

  function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyText.trim()) return;
    createComment.mutate(
      { body: replyText, parentId: comment.id },
      {
        onSuccess: () => {
          setReplyText("");
          setShowReply(false);
        },
      }
    );
  }

  return (
    <div className={cn("space-y-2", depth > 0 && "ml-6 pl-4 border-l")}>
      <div className="flex items-start gap-3">
        <Link href={`/profile/${comment.username}`}>
          <Avatar className="h-7 w-7">
            {comment.avatarUrl && <AvatarImage src={comment.avatarUrl} />}
            <AvatarFallback className="text-xs">
              {comment.username[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link
              href={`/profile/${comment.username}`}
              className="text-sm font-medium hover:underline"
            >
              {comment.username}
            </Link>
            <span className="text-xs text-muted-foreground">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm mt-0.5">{comment.body}</p>
          <div className="flex items-center gap-3 mt-1">
            {isAuthenticated && depth < maxDepth && (
              <button
                onClick={() => setShowReply(!showReply)}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                {t("comments.reply")}
              </button>
            )}
            {isOwn && (
              <button
                onClick={() => deleteComment.mutate(comment.id)}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                {t("common.delete")}
              </button>
            )}
          </div>
        </div>
      </div>

      {showReply && (
        <form onSubmit={handleReply} className="flex gap-2 ml-10">
          <Input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={t("comments.replyPlaceholder")}
            className="h-8 text-sm"
            maxLength={1000}
          />
          <Button type="submit" size="sm" disabled={!replyText.trim() || createComment.isPending}>
            {t("comments.reply")}
          </Button>
        </form>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              contentId={contentId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CommentThreadProps {
  contentId: string;
  comments: CommentResponse[];
}

export function CommentThread({ contentId, comments }: CommentThreadProps) {
  const t = useTranslations();
  const { isAuthenticated } = useAuth();
  const [newComment, setNewComment] = useState("");
  const createComment = useCreateComment(contentId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;
    createComment.mutate(
      { body: newComment },
      { onSuccess: () => setNewComment("") }
    );
  }

  // Build tree: separate top-level from replies
  const topLevel = comments.filter((c) => !c.parentId);

  return (
    <div className="space-y-4">
      <h2 className="font-semibold">
        {t("content.comment")} ({comments.length})
      </h2>

      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={`${t("content.comment")}...`}
            maxLength={1000}
          />
          <Button type="submit" disabled={!newComment.trim() || createComment.isPending}>
            {t("chat.sendMessage")}
          </Button>
        </form>
      )}

      {topLevel.length > 0 ? (
        <div className="space-y-4">
          {topLevel.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              contentId={contentId}
            />
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground text-center py-4">
          {t("comments.empty")}
        </div>
      )}
    </div>
  );
}
