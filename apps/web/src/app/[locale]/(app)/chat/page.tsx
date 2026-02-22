"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useThreads, useMessages, useSendMessage, useMarkThreadRead, useUnlockPpvMessage } from "@fexora/api-client";
import type { MessageResponse } from "@fexora/api-client";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TipDialog } from "@/components/content/tip-dialog";
import { OnlineIndicator } from "@/components/ui/online-indicator";
import { cn } from "@/lib/utils";
import { ChatListSkeleton } from "@/components/ui/page-skeleton";

function PpvMessageBubble({
  msg,
  isMine,
}: {
  msg: MessageResponse;
  isMine: boolean;
}) {
  const t = useTranslations();
  const unlockPpv = useUnlockPpvMessage();
  const isLocked = !msg.isPpvUnlocked && !isMine;

  return (
    <div className={cn("flex", isMine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[70%] rounded-lg px-3 py-2 text-sm",
          isMine ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        {/* PPV indicator */}
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="secondary" className="text-xs">
            PPV · {msg.ppvPriceCredits} {t("content.coins")}
          </Badge>
          {msg.isPpvUnlocked && (
            <Badge variant="default" className="text-xs">
              {t("content.unlocked")}
            </Badge>
          )}
        </div>

        {/* Preview or full content */}
        {isLocked ? (
          <div className="space-y-2">
            <p className="italic text-muted-foreground">
              {msg.ppvPreviewText ?? t("chat.ppvLockedMessage")}
            </p>
            {msg.mediaUrl && (
              <div className="h-32 rounded bg-muted-foreground/10 flex items-center justify-center">
                <span className="text-muted-foreground text-xs">
                  {t("chat.ppvMediaLocked")}
                </span>
              </div>
            )}
            <Button
              size="sm"
              className="w-full"
              onClick={() => unlockPpv.mutate({ messageId: msg.id })}
              disabled={unlockPpv.isPending}
            >
              {t("content.unlock")} · {msg.ppvPriceCredits} {t("content.coins")}
            </Button>
          </div>
        ) : (
          <div>
            <p>{msg.body}</p>
            {msg.mediaUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={msg.mediaUrl}
                alt="PPV content"
                className="mt-2 rounded max-h-64 object-contain"
              />
            )}
          </div>
        )}

        <p
          className={cn(
            "text-xs mt-1",
            isMine ? "text-primary-foreground/70" : "text-muted-foreground"
          )}
        >
          {new Date(msg.createdAt).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}

function ChatContent() {
  const t = useTranslations();
  const { user } = useAuth();
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [showTip, setShowTip] = useState(false);
  const [ppvMode, setPpvMode] = useState(false);
  const [ppvPrice, setPpvPrice] = useState("");

  const { data: threadsData, isLoading: threadsLoading } = useThreads();
  const { data: messagesData } = useMessages(selectedThreadId ?? "", {
    page: 1,
    pageSize: 50,
  });
  const sendMessage = useSendMessage();
  const markRead = useMarkThreadRead();

  const threads = threadsData?.success ? threadsData.data ?? [] : [];
  const messages = messagesData?.success
    ? messagesData.data?.data ?? []
    : [];

  const selectedThread = threads.find((t) => t.id === selectedThreadId);
  const isCreator = user?.role === "Creator" || user?.role === "Admin";

  function handleSelectThread(threadId: string) {
    setSelectedThreadId(threadId);
    markRead.mutate(threadId);
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!messageText.trim() || !selectedThread) return;

    const price = ppvMode ? parseInt(ppvPrice) : undefined;

    sendMessage.mutate(
      {
        receiverId: selectedThread.otherUserId,
        body: messageText,
        ...(price && price > 0 ? { ppvPriceCredits: price } : {}),
      },
      {
        onSuccess: () => {
          setMessageText("");
          setPpvMode(false);
          setPpvPrice("");
        },
      }
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Thread List */}
      <div className="w-80 shrink-0 border rounded-lg overflow-y-auto">
        <div className="p-3 border-b">
          <h2 className="font-semibold">{t("nav.chat")}</h2>
        </div>
        {threadsLoading ? (
          <ChatListSkeleton count={6} />
        ) : threads.length > 0 ? (
          <div>
            {threads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => handleSelectThread(thread.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left",
                  selectedThreadId === thread.id && "bg-muted"
                )}
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    {thread.otherAvatarUrl && (
                      <AvatarImage src={thread.otherAvatarUrl} />
                    )}
                    <AvatarFallback>
                      {thread.otherUsername[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <OnlineIndicator isOnline={(thread as unknown as { isOnline?: boolean }).isOnline} size="sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">
                      {thread.otherUsername}
                    </p>
                    {thread.unreadCount > 0 && (
                      <Badge variant="default" className="text-xs">
                        {thread.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {thread.lastMessage ?? "No messages"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No conversations yet
          </div>
        )}
      </div>

      {/* Message Area */}
      <div className="flex-1 border rounded-lg flex flex-col">
        {selectedThread ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-3 border-b">
              <div className="relative">
                <Avatar className="h-8 w-8">
                  {selectedThread.otherAvatarUrl && (
                    <AvatarImage src={selectedThread.otherAvatarUrl} />
                  )}
                  <AvatarFallback>
                    {selectedThread.otherUsername[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <OnlineIndicator isOnline={(selectedThread as unknown as { isOnline?: boolean }).isOnline} size="sm" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{selectedThread.otherUsername}</p>
                {(selectedThread as unknown as { isOnline?: boolean }).isOnline && (
                  <p className="text-xs text-green-500">Online</p>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowTip(true)}>
                🎁 Tip
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => {
                const isMine = msg.senderId === user?.id;
                const isPpv = (msg.ppvPriceCredits ?? 0) > 0;

                if (isPpv) {
                  return (
                    <PpvMessageBubble key={msg.id} msg={msg} isMine={isMine} />
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={cn("flex", isMine ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[70%] rounded-lg px-3 py-2 text-sm",
                        isMine
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <p>{msg.body}</p>
                      {msg.mediaUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={msg.mediaUrl}
                          alt=""
                          className="mt-2 rounded max-h-64 object-contain"
                        />
                      )}
                      <p
                        className={cn(
                          "text-xs mt-1",
                          isMine
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        )}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PPV toggle (creator only) */}
            {isCreator && ppvMode && (
              <div className="px-3 py-2 border-t bg-muted/30 flex items-center gap-2">
                <Badge variant="secondary">PPV</Badge>
                <Input
                  type="number"
                  min="1"
                  placeholder={t("chat.ppvPricePlaceholder")}
                  value={ppvPrice}
                  onChange={(e) => setPpvPrice(e.target.value)}
                  className="w-32 h-8"
                />
                <span className="text-xs text-muted-foreground">{t("content.coins")}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPpvMode(false);
                    setPpvPrice("");
                  }}
                  className="ml-auto h-7 text-xs"
                >
                  {t("common.cancel")}
                </Button>
              </div>
            )}

            {/* Send Message */}
            <form onSubmit={handleSend} className="p-3 border-t flex gap-2">
              {isCreator && !ppvMode && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setPpvMode(true)}
                  title="PPV Message"
                  className="shrink-0"
                >
                  💎
                </Button>
              )}
              <Input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={
                  ppvMode ? t("chat.ppvMessagePlaceholder") : t("chat.sendMessage")
                }
                maxLength={5000}
              />
              <Button type="submit" disabled={!messageText.trim() || sendMessage.isPending}>
                Send
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a conversation
          </div>
        )}
      </div>

      {showTip && selectedThread && (
        <TipDialog
          recipientId={selectedThread.otherUserId}
          recipientName={selectedThread.otherUsername}
          onClose={() => setShowTip(false)}
        />
      )}
    </div>
  );
}

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <ChatContent />
    </ProtectedRoute>
  );
}
