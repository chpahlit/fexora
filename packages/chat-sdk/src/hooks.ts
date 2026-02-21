import { useEffect, useRef, useState, useCallback } from "react";
import { ChatClient } from "./client";
import type { ChatMessage, ChatThread, ConnectionState } from "./types";

export function useChatConnection(hubUrl: string, token: string | null) {
  const clientRef = useRef<ChatClient | null>(null);
  const [state, setState] = useState<ConnectionState>("disconnected");

  useEffect(() => {
    if (!token) return;

    const client = new ChatClient(hubUrl, token);
    clientRef.current = client;

    client.on<ConnectionState>("stateChanged", setState);
    client.connect().catch(console.error);

    return () => {
      client.disconnect().catch(console.error);
      clientRef.current = null;
    };
  }, [hubUrl, token]);

  return { client: clientRef.current, state };
}

export function useChatMessages(client: ChatClient | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!client) return;

    const unsub1 = client.on<ChatMessage>("messageReceived", (msg) => {
      setMessages((prev) => [msg, ...prev]);
    });

    const unsub2 = client.on<ChatMessage>("messageSent", (msg) => {
      setMessages((prev) => [msg, ...prev]);
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, [client]);

  const sendMessage = useCallback(
    async (receiverId: string, body: string) => {
      if (!client) return;
      await client.sendMessage(receiverId, body);
    },
    [client]
  );

  return { messages, setMessages, sendMessage };
}

export function useChatThreads(client: ChatClient | null) {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!client) return;

    client.getOnlineUsers().then((users) => {
      setOnlineUsers(new Set(users));
    }).catch(console.error);

    const unsub1 = client.on<string>("userOnline", (userId) => {
      setOnlineUsers((prev) => new Set(prev).add(userId));
    });

    const unsub2 = client.on<string>("userOffline", (userId) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, [client]);

  return { onlineUsers };
}
