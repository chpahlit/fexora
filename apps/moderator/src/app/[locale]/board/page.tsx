"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AppShell } from "@/components/app-shell";
import { KpiBar } from "@/components/kpi-bar";
import { cn } from "@/lib/utils";

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
  isOnline?: boolean;
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

interface Snippet {
  id: string;
  title: string;
  body: string;
  category: string;
}

export default function BoardPage() {
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [filter, setFilter] = useState<"all" | "unanswered" | "vip">("all");
  const [newNote, setNewNote] = useState("");
  const [threadSearch, setThreadSearch] = useState("");
  const [showSnippets, setShowSnippets] = useState(false);
  const [ppvPrice, setPpvPrice] = useState<number | null>(null);
  const [showPpv, setShowPpv] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

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

  // Thread queue for selected creator (auto-refresh every 10s)
  const { data: threadsData } = useQuery({
    queryKey: ["moderator", "threads", selectedCreatorId, filter],
    queryFn: () =>
      client.get<Thread[]>(`/moderator/creators/${selectedCreatorId}/threads?filter=${filter}`),
    enabled: !!selectedCreatorId,
    refetchInterval: 10000,
  });
  const threads = threadsData?.success ? threadsData.data ?? [] : [];

  // Filter threads by search
  const filteredThreads = useMemo(() => {
    if (!threadSearch.trim()) return threads;
    const q = threadSearch.toLowerCase();
    return threads.filter(
      (t) =>
        t.username.toLowerCase().includes(q) ||
        t.lastMessage?.toLowerCase().includes(q)
    );
  }, [threads, threadSearch]);

  // Messages for selected thread (auto-refresh every 5s)
  const { data: messagesData } = useQuery({
    queryKey: ["moderator", "messages", selectedThreadId],
    queryFn: () =>
      client.get<Message[]>(`/moderator/threads/${selectedThreadId}/messages`),
    enabled: !!selectedThreadId,
    refetchInterval: 5000,
  });
  const messages = messagesData?.success ? messagesData.data ?? [] : [];

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // User profile for selected thread
  const selectedThread = threads.find((t) => t.id === selectedThreadId);
  const { data: profileData } = useQuery({
    queryKey: ["moderator", "user-profile", selectedThread?.userId],
    queryFn: () =>
      client.get<UserProfile>(`/moderator/users/${selectedThread?.userId}/profile`),
    enabled: !!selectedThread?.userId,
  });
  const userProfile = profileData?.success ? profileData.data : null;

  // Snippets for quick insert
  const { data: snippetsData } = useQuery({
    queryKey: ["moderator", "snippets"],
    queryFn: () => client.get<Snippet[]>("/moderator/snippets"),
  });
  const snippets = snippetsData?.success ? snippetsData.data ?? [] : [];

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!messageText.trim() || !selectedThreadId || !selectedCreatorId) return;
    await client.post(`/moderator/threads/${selectedThreadId}/send`, {
      body: messageText,
      asCreatorId: selectedCreatorId,
      ...(ppvPrice && ppvPrice > 0 ? { priceCoins: ppvPrice } : {}),
    });
    setMessageText("");
    setPpvPrice(null);
    setShowPpv(false);
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

  function insertSnippet(body: string) {
    const processed = body.replace(
      /\{\{username\}\}/g,
      selectedThread?.username ?? "User"
    );
    setMessageText((prev) => (prev ? prev + "\n" + processed : processed));
    setShowSnippets(false);
  }

  // Hotkeys
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.altKey && e.key === "n") { e.preventDefault(); handleNextDialog(); }
      if (e.altKey && e.key === "1") { e.preventDefault(); document.getElementById("col-queue")?.focus(); }
      if (e.altKey && e.key === "2") { e.preventDefault(); document.getElementById("chat-input")?.focus(); }
      if (e.altKey && e.key === "3") { e.preventDefault(); document.getElementById("col-profile")?.focus(); }
      if (e.altKey && e.key === "s") { e.preventDefault(); setShowSnippets((v) => !v); }
      if (e.key === "?" && !e.ctrlKey && !e.altKey && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        alert("Hotkeys:\n\nCtrl+Enter: Send message\nAlt+N: Next dialog\nAlt+1/2/3: Focus columns\nAlt+S: Toggle snippets\n?: This help");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCreatorId]);

  const selectedCreator = creators.find((c) => c.id === selectedCreatorId);

  return (
    <AppShell fullWidth>
      <div className="h-full flex flex-col">
        {/* Live KPIs */}
        <KpiBar />

        {/* Header with creator selection */}
        <div className="flex items-center gap-4 px-4 py-2 border-b bg-background">
          <h1 className="font-bold text-primary shrink-0">Board</h1>
          <div className="flex gap-1 overflow-x-auto">
            {creators.map((c) => (
              <Button
                key={c.id}
                variant={selectedCreatorId === c.id ? "default" : "outline"}
                size="sm"
                className="shrink-0"
                onClick={() => { setSelectedCreatorId(c.id); setSelectedThreadId(null); }}
              >
                {c.username}
              </Button>
            ))}
          </div>
          {selectedCreator && (
            <Badge variant="secondary" className="shrink-0">
              Chatting as {selectedCreator.username}
            </Badge>
          )}
          <div className="flex-1" />
          <Button variant="outline" size="sm" className="shrink-0" onClick={handleNextDialog}>
            Next (Alt+N)
          </Button>
        </div>

        {/* 3-Column Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Column 1: Queue */}
          <div id="col-queue" className="w-72 border-r flex flex-col shrink-0" tabIndex={0}>
            {/* Search */}
            <div className="p-2 border-b">
              <Input
                placeholder="Search threads..."
                value={threadSearch}
                onChange={(e) => setThreadSearch(e.target.value)}
                className="text-xs h-8"
              />
            </div>
            {/* Filters */}
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
              <span className="flex-1" />
              <span className="text-[10px] text-muted-foreground self-center">
                {filteredThreads.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredThreads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => setSelectedThreadId(thread.id)}
                  className={cn(
                    "w-full flex items-center gap-2 p-3 hover:bg-muted/50 transition-colors text-left border-b",
                    selectedThreadId === thread.id && "bg-muted"
                  )}
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      {thread.avatarUrl && <AvatarImage src={thread.avatarUrl} />}
                      <AvatarFallback>{thread.username[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {thread.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-medium truncate">{thread.username}</p>
                      {thread.isVip && <Badge variant="warning" className="text-[10px] px-1">VIP</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{thread.lastMessage}</p>
                  </div>
                  {thread.unreadCount > 0 && (
                    <Badge variant="default" className="text-xs shrink-0">{thread.unreadCount}</Badge>
                  )}
                </button>
              ))}
              {filteredThreads.length === 0 && (
                <p className="p-4 text-center text-xs text-muted-foreground">
                  {threadSearch ? "No matches" : "No threads"}
                </p>
              )}
            </div>
          </div>

          {/* Column 2: Chat */}
          <div className="flex-1 flex flex-col min-w-0">
            {selectedThreadId ? (
              <>
                {/* Messages */}
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
                        {msg.priceCoins && msg.priceCoins > 0 && (
                          <Badge variant="warning" className="mb-1 text-[10px]">
                            PPV: {msg.priceCoins} coins
                          </Badge>
                        )}
                        <p className="whitespace-pre-wrap">{msg.body}</p>
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
                  <div ref={chatEndRef} />
                </div>

                {/* Snippet Panel */}
                {showSnippets && (
                  <div className="border-t bg-muted/30 max-h-48 overflow-y-auto">
                    <div className="p-2 flex items-center justify-between">
                      <span className="text-xs font-medium">Snippets (Alt+S)</span>
                      <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setShowSnippets(false)}>
                        Close
                      </Button>
                    </div>
                    <div className="px-2 pb-2 grid gap-1 grid-cols-2">
                      {snippets.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => insertSnippet(s.body)}
                          className="text-left rounded border p-2 hover:bg-muted transition-colors"
                        >
                          <p className="text-xs font-medium truncate">{s.title}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{s.body}</p>
                        </button>
                      ))}
                      {snippets.length === 0 && (
                        <p className="col-span-2 text-xs text-muted-foreground text-center py-2">No snippets</p>
                      )}
                    </div>
                  </div>
                )}

                {/* PPV Price Input */}
                {showPpv && (
                  <div className="px-3 py-2 border-t bg-muted/30 flex items-center gap-2">
                    <Badge variant="warning" className="text-xs shrink-0">PPV</Badge>
                    <Input
                      type="number"
                      min={1}
                      placeholder="Price in coins..."
                      value={ppvPrice ?? ""}
                      onChange={(e) => setPpvPrice(e.target.value ? parseInt(e.target.value) : null)}
                      className="h-8 w-32 text-xs"
                    />
                    <span className="text-xs text-muted-foreground">coins</span>
                    <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => { setShowPpv(false); setPpvPrice(null); }}>
                      Cancel
                    </Button>
                  </div>
                )}

                {/* Input Area */}
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSend(e); }}
                  className="p-3 border-t flex gap-2"
                >
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant={showSnippets ? "default" : "ghost"}
                      size="sm"
                      className="h-9 w-9 p-0 shrink-0"
                      title="Snippets (Alt+S)"
                      onClick={() => setShowSnippets(!showSnippets)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </Button>
                    <Button
                      type="button"
                      variant={showPpv ? "default" : "ghost"}
                      size="sm"
                      className="h-9 w-9 p-0 shrink-0"
                      title="PPV Message"
                      onClick={() => setShowPpv(!showPpv)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </Button>
                  </div>
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
                  <Button type="submit" disabled={!messageText.trim()}>
                    {ppvPrice && ppvPrice > 0 ? `Send PPV (${ppvPrice}c)` : "Send"}
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center space-y-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-muted-foreground/30"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  <p className="text-sm">Select a conversation or press <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">Alt+N</kbd></p>
                </div>
              </div>
            )}
          </div>

          {/* Column 3: Profile / History */}
          <div id="col-profile" className="w-80 border-l overflow-y-auto p-4 space-y-4 shrink-0" tabIndex={0}>
            {userProfile ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      {userProfile.avatarUrl && <AvatarImage src={userProfile.avatarUrl} />}
                      <AvatarFallback>{userProfile.username[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {selectedThread?.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-background" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-medium">{userProfile.username}</p>
                      {selectedThread?.isOnline ? (
                        <Badge variant="success" className="text-[10px] px-1">Online</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] px-1">Offline</Badge>
                      )}
                    </div>
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

                {selectedThread?.isVip && (
                  <div className="rounded-lg bg-yellow-500/10 p-3 text-center">
                    <Badge variant="warning">VIP User</Badge>
                    <p className="text-xs text-muted-foreground mt-1">Priority support</p>
                  </div>
                )}

                <Separator />

                <div>
                  <h3 className="text-sm font-semibold mb-2">Internal Notes</h3>
                  <div className="space-y-1 mb-2 max-h-36 overflow-y-auto">
                    {userProfile.notes.length > 0 ? (
                      userProfile.notes.map((note, i) => (
                        <p key={i} className="text-xs bg-muted rounded p-2">{note}</p>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground">No notes yet</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Input
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add note..."
                      className="text-xs"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") { e.preventDefault(); handleAddNote(); }
                      }}
                    />
                    <Button size="sm" onClick={handleAddNote} disabled={!newNote.trim()}>Add</Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center h-full">
                <p className="text-sm text-muted-foreground text-center">
                  Select a conversation to view profile
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
