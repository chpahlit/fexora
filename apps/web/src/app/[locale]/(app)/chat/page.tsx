"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useThreads, useMessages, useSendMessage, useMarkThreadRead } from "@fexora/api-client";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { TipDialog } from "@/components/content/tip-dialog";
import { cn } from "@/lib/utils";

function ChatContent() {
  const t = useTranslations();
  const { user } = useAuth();
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [showTip, setShowTip] = useState(false);

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

  function handleSelectThread(threadId: string) {
    setSelectedThreadId(threadId);
    markRead.mutate(threadId);
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!messageText.trim() || !selectedThread) return;

    sendMessage.mutate(
      { receiverId: selectedThread.otherUserId, body: messageText },
      { onSuccess: () => setMessageText("") }
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
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
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
                <Avatar className="h-10 w-10">
                  {thread.otherAvatarUrl && (
                    <AvatarImage src={thread.otherAvatarUrl} />
                  )}
                  <AvatarFallback>
                    {thread.otherUsername[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
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
              <Avatar className="h-8 w-8">
                {selectedThread.otherAvatarUrl && (
                  <AvatarImage src={selectedThread.otherAvatarUrl} />
                )}
                <AvatarFallback>
                  {selectedThread.otherUsername[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="font-medium flex-1">{selectedThread.otherUsername}</p>
              <Button variant="ghost" size="sm" onClick={() => setShowTip(true)}>
                🎁 Tip
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => {
                const isMine = msg.senderId === user?.id;
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

            {/* Send Message */}
            <form onSubmit={handleSend} className="p-3 border-t flex gap-2">
              <Input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={t("chat.sendMessage")}
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
