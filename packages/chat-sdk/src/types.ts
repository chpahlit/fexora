export interface ChatMessage {
  id: string;
  threadId: string;
  senderId: string;
  senderUsername: string;
  body: string;
  mediaUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ChatThread {
  id: string;
  otherUserId: string;
  otherUsername: string;
  otherAvatarUrl?: string;
  lastMessage?: ChatMessage;
  unreadCount: number;
  lastActivityAt: string;
}

export type ConnectionState = "disconnected" | "connecting" | "connected" | "reconnecting";
