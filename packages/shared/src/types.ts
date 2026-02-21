// Mirrors .NET Core enums - keep in sync

export type Role = "Guest" | "User" | "Creator" | "Moderator" | "Admin";

export type ContentStatus =
  | "Draft"
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Removed";

export type ContentType = "Image" | "Video" | "Audio" | "Text";

export interface User {
  id: string;
  email: string;
  role: Role;
  isVerified18: boolean;
  isActive: boolean;
  createdAt: string;
  profile?: Profile;
}

export interface Profile {
  userId: string;
  username: string;
  age?: number;
  country?: string;
  badges: string[];
  offersCustom: boolean;
  bio?: string;
  avatarUrl?: string;
}

export interface Content {
  id: string;
  ownerId: string;
  type: ContentType;
  title: string;
  coverUrl?: string;
  blurPreviewUrl?: string;
  mediaUrl?: string;
  priceCredits: number;
  status: ContentStatus;
  createdAt: string;
}

export interface Thread {
  id: string;
  userAId: string;
  userBId: string;
  assignedModeratorId?: string;
  lastActivityAt: string;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  receiverId: string;
  body: string;
  mediaUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface CreditWallet {
  userId: string;
  balance: number;
  updatedAt: string;
}

export interface Purchase {
  id: string;
  buyerId: string;
  contentId: string;
  priceCredits: number;
  attributedToModeratorId?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
