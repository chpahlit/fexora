"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { KpiBar } from "@/components/kpi-bar";

interface Creator {
  id: string;
  username: string;
  avatarUrl?: string;
}

interface Thread {
  id: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  lastMessage?: string;
  lastMessageAt: string;
  unreadCount: number;
  isVip: boolean;
}

interface Message {
  id: string;
  senderId: string;
  senderUsername: string;
  body: string;
  mediaUrl?: string;
  priceCoins?: number;
  createdAt: string;
  isModerator: boolean;
}

interface UserProfile {
  id: string;
  username: string;
  avatarUrl?: string;
  subscriptionTier?: string;
  totalPurchases: number;
  memberSince: string;
  notes: string[];
}

export default function BoardPage() {
  const { client, user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [filter, setFilter] = useState<"all" | "unanswered" | "vip">("all");
  const [newNote, setNewNote] = useState("");

  // Assigned creators
  const { data: creatorsData } = useQuery({
    queryKey: ["moderator", "creators"],
    queryFn: () => client.get<Creator[]>("/moderator/assigned-creators"),
  });
  const creators = creatorsData?.success ? creatorsData.data ?? [] : [];

  // Set default creator
  useEffect(() => {
    if (creators.length > 0 && !selectedCreatorId) {
      setSelectedCreatorId(creators[0].id);
    }
  }, [creators, selectedCreatorId]);

  // Thread queue for selected creator
  const { data: threadsData } = useQuery({
    queryKey: ["moderator", "threads", selectedCreatorId, filter],
    queryFn: () =>
      client.get<Thread[]>(`/moderator/creators/${selectedCreatorId}/threads?filter=${filter}`),
    enabled: !!selectedCreatorId,
  });
  const threads = threadsData?.success ? threadsData.data ?? [] : [];

  // Messages for selected thread
  const { data: messagesData } = useQuery({
    queryKey: ["moderator", "messages", selectedThreadId],
    queryFn: () =>
      client.get<Message[]>(`/moderator/threads/${selectedThreadId}/messages`),
    enabled: !!selectedThreadId,
  });
  const messages = messagesData?.success ? messagesData.data ?? [] : [];

  // User profile for selected thread
  const selectedThread = threads.find((t) => t.id === selectedThreadId);
  const { data: profileData } = useQuery({
    queryKey: ["moderator", "user-profile", selectedThread?.userId],
    queryFn: () =>
      client.get<UserProfile>(`/moderator/users/${selectedThread?.userId}/profile`),
    enabled: !!selectedThread?.userId,
  });
  const userProfile = profileData?.success ? profileData.data : null;

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!messageText.trim() || !selectedThreadId || !selectedCreatorId) return;
    await client.post(`/moderator/threads/${selectedThreadId}/send`, {
      body: messageText,
      asCreatorId: selectedCreatorId,
    });
    setMessageText("");
    queryClient.invalidateQueries({ queryKey: ["moderator", "messages", selectedThreadId] });
    queryClient.invalidateQueries({ queryKey: ["moderator", "threads"] });
  }

  async function handleNextDialog() {
    if (!selectedCreatorId) return;
    const res = await client.post<{ threadId: string }>(
      `/moderator/creators/${selectedCreatorId}/next-thread`
    );
    if (res.success && res.data) {
      setSelectedThreadId(res.data.threadId);
    }
  }

  async function handleAddNote() {
    if (!newNote.trim() || !selectedThread?.userId) return;
    await client.post(`/moderator/users/${selectedThread.userId}/notes`, {
      text: newNote,
    });
    setNewNote("");
    queryClient.invalidateQueries({ queryKey: ["moderator", "user-profile"] });
  }

  // Hotkeys (FEXORA-060)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Alt+N: Next dialog
      if (e.altKey && e.key === "n") { e.preventDefault(); handleNextDialog(); }
      // Alt+1: Focus queue
      if (e.altKey && e.key === "1") { e.preventDefault(); document.getElementById("col-queue")?.focus(); }
      // Alt+2: Focus chat
      if (e.altKey && e.key === "2") { e.preventDefault(); document.getElementById("chat-input")?.focus(); }
      // Alt+3: Focus profile
      if (e.altKey && e.key === "3") { e.preventDefault(); document.getElementById("col-profile")?.focus(); }
      // ?: Show help
      if (e.key === "?" && !e.ctrlKey && !e.altKey && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        alert("Hotkeys:\n\nCtrl+Enter: Send message\nAlt+N: Next dialog\nAlt+1/2/3: Focus columns\nAlt+S: Snippets\n?: This help");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCreatorId]);

  const selectedCreator = creators.find((c) => c.id === selectedCreatorId);

  return (
    <div className="h-screen flex flex-col">
      {/* Live KPIs */}
      <KpiBar />
      {/* Header with creator selection */}
      <div className="flex items-center gap-4 px-4 py-2 border-b bg-background">
        <h1 className="font-bold text-primary">Moderator Board</h1>
        <div className="flex gap-2">
          {creators.map((c) => (
            <Button
              key={c.id}
              variant={selectedCreatorId === c.id ? "default" : "outline"}
              size="sm"
              onClick={() => { setSelectedCreatorId(c.id); setSelectedThreadId(null); }}
            >
              {c.username}
            </Button>
          ))}
        </div>
        {selectedCreator && (
          <Badge variant="secondary">Chatting as {selectedCreator.username}</Badge>
        )}
        <div className="flex-1" />
        <Button variant="outline" size="sm" onClick={handleNextDialog}>
          Next Dialog (Alt+N)
        </Button>
      </div>

      {/* 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Column 1: Queue */}
        <div id="col-queue" className="w-72 border-r flex flex-col" tabIndex={0}>
          <div className="p-2 border-b flex gap-1">
            {(["all", "unanswered", "vip"] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "ghost"}
                size="sm"
                className="text-xs"
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "All" : f === "unanswered" ? "Unanswered" : "VIP"}
              </Button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto">
            {threads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => setSelectedThreadId(thread.id)}
                className={cn(
                  "w-full flex items-center gap-2 p-3 hover:bg-muted/50 transition-colors text-left border-b",
                  selectedThreadId === thread.id && "bg-muted"
                )}
              >
                <Avatar className="h-8 w-8">
                  {thread.avatarUrl && <AvatarImage src={thread.avatarUrl} />}
                  <AvatarFallback>{thread.username[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-medium truncate">{thread.username}</p>
                    {thread.isVip && <Badge variant="warning" className="text-[10px] px-1">VIP</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{thread.lastMessage}</p>
                </div>
                {thread.unreadCount > 0 && (
                  <Badge variant="default" className="text-xs">{thread.unreadCount}</Badge>
                )}
              </button>
            ))}
            {threads.length === 0 && (
              <p className="p-4 text-center text-xs text-muted-foreground">No threads</p>
            )}
          </div>
        </div>

        {/* Column 2: Chat */}
        <div className="flex-1 flex flex-col">
          {selectedThreadId ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn("flex", msg.isModerator ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[70%] rounded-lg px-3 py-2 text-sm",
                        msg.isModerator ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}
                    >
                      {msg.priceCoins && (
                        <Badge variant="warning" className="mb-1 text-[10px]">
                          PPV: {msg.priceCoins} coins
                        </Badge>
                      )}
                      <p>{msg.body}</p>
                      {msg.mediaUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={msg.mediaUrl} alt="" className="mt-1 rounded max-h-48" />
                      )}
                      <p className={cn("text-xs mt-1", msg.isModerator ? "text-primary-foreground/70" : "text-muted-foreground")}>
                        {new Date(msg.createdAt).toLocaleTimeString()}
                        {msg.isModerator && " · sent as creator"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(e);
                }}
                className="p-3 border-t flex gap-2"
              >
                <Input
                  id="chat-input"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={`Send as ${selectedCreator?.username ?? "creator"}...`}
                  onKeyDown={(e) => {
                    if (e.ctrlKey && e.key === "Enter") {
                      e.preventDefault();
                      handleSend(e as unknown as React.FormEvent);
                    }
                  }}
                />
                <Button type="submit" disabled={!messageText.trim()}>Send</Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a conversation or press Alt+N
            </div>
          )}
        </div>

        {/* Column 3: Profile / History */}
        <div id="col-profile" className="w-80 border-l overflow-y-auto p-4 space-y-4" tabIndex={0}>
          {userProfile ? (
            <>
              <div className="flex items-center gap-3">
                <Avatar>
                  {userProfile.avatarUrl && <AvatarImage src={userProfile.avatarUrl} />}
                  <AvatarFallback>{userProfile.username[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{userProfile.username}</p>
                  <p className="text-xs text-muted-foreground">
                    Member since {new Date(userProfile.memberSince).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Card>
                  <CardContent className="pt-4 pb-3 text-center">
                    <p className="text-lg font-bold">{userProfile.totalPurchases}</p>
                    <p className="text-[10px] text-muted-foreground">Purchases</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 pb-3 text-center">
                    <p className="text-lg font-bold">{userProfile.subscriptionTier ?? "None"}</p>
                    <p className="text-[10px] text-muted-foreground">Subscription</p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2">Internal Notes</h3>
                <div className="space-y-1 mb-2">
                  {userProfile.notes.map((note, i) => (
                    <p key={i} className="text-xs bg-muted rounded p-2">{note}</p>
                  ))}
                </div>
                <div className="flex gap-1">
                  <Input
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add note..."
                    className="text-xs"
                  />
                  <Button size="sm" onClick={handleAddNote}>Add</Button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              Select a conversation to view profile
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
