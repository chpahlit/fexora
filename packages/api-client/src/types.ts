import type {
  User,
  Profile,
  Content,
  ContentType,
  ContentStatus,
  Thread,
  Message,
} from "@fexora/shared";

// ── Auth ──────────────────────────────────────────────

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  referralCode?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface UserInfo {
  id: string;
  email: string;
  role: string;
  profile: Profile | null;
}

// ── Profiles ──────────────────────────────────────────

export interface UpdateProfileRequest {
  username?: string;
  bio?: string;
  age?: number;
  country?: string;
  offersCustom?: boolean;
}

export interface ProfileResponse extends Profile {
  followerCount?: number;
  followingCount?: number;
  postCount?: number;
  isFollowing?: boolean;
}

// ── Content ───────────────────────────────────────────

export interface CreateContentRequest {
  title: string;
  type: ContentType;
  priceCredits: number;
}

export interface ContentResponse extends Content {
  ownerUsername?: string;
  ownerAvatarUrl?: string;
  isUnlocked?: boolean;
  likeCount?: number;
  commentCount?: number;
}

// ── Comments ─────────────────────────────────────────

export interface CommentResponse {
  id: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  contentId: string;
  parentId?: string;
  body: string;
  createdAt: string;
  replies?: CommentResponse[];
  likeCount?: number;
  isLiked?: boolean;
}

export interface CreateCommentRequest {
  body: string;
  parentId?: string;
}

// ── Chat ──────────────────────────────────────────────

export interface SendMessageRequest {
  receiverId: string;
  body: string;
  ppvPriceCredits?: number;
  mediaUrl?: string;
}

export interface ThreadResponse {
  id: string;
  otherUserId: string;
  otherUsername: string;
  otherAvatarUrl?: string;
  lastMessage?: string;
  lastActivityAt: string;
  unreadCount: number;
}

export interface MessageResponse {
  id: string;
  threadId: string;
  senderId: string;
  senderUsername: string;
  body: string;
  mediaUrl?: string;
  isRead: boolean;
  createdAt: string;
  ppvPriceCredits?: number;
  ppvPreviewText?: string;
  isPpvUnlocked?: boolean;
}

// ── Wallet ────────────────────────────────────────────

export interface WalletResponse {
  balance: number;
  updatedAt: string;
}

export interface TransactionResponse {
  id: string;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
}

export interface TopupRequest {
  amount: number;
}

export interface TopupResponse {
  sessionUrl: string;
}

export interface UnlockRequest {
  contentId: string;
  promoCode?: string;
}

export interface UnlockResponse {
  success: boolean;
  newBalance: number;
}

// ── Reports ───────────────────────────────────────────

export interface CreateReportRequest {
  targetType: "content" | "user" | "message";
  targetId: string;
  reason: string;
}

export interface ResolveReportRequest {
  action: "dismiss" | "warn" | "remove" | "ban";
  note?: string;
}

export interface ReportResponse {
  id: string;
  reporterId: string;
  targetType: string;
  targetId: string;
  reason: string;
  status: string;
  createdAt: string;
  resolvedAt?: string;
}

// ── Story Highlights ─────────────────────────────────

export interface HighlightResponse {
  id: string;
  title: string;
  coverUrl?: string;
  itemCount: number;
  createdAt: string;
}

export interface HighlightItemResponse {
  id: string;
  highlightId: string;
  contentId: string;
  mediaUrl: string;
  type: string;
  createdAt: string;
}

export interface CreateHighlightRequest {
  title: string;
  contentIds: string[];
}

// ── Pagination ────────────────────────────────────────

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}
