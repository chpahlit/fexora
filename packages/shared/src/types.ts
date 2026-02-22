// ===== Enums (mirrors .NET Core enums — keep in sync) =====

export type Role = "Guest" | "User" | "Creator" | "Moderator" | "Agency" | "Admin";

export type ContentStatus =
  | "Draft"
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Removed"
  | "TakenDown";

export type ContentType = "Image" | "Video" | "Audio" | "Text";

export type NotificationType =
  | "Like"
  | "Comment"
  | "Follow"
  | "Purchase"
  | "Tip"
  | "Subscription"
  | "Message"
  | "System"
  | "ContentApproved"
  | "ContentRejected";

export type ReportStatus = "Open" | "InReview" | "Resolved" | "Dismissed";

export type ReportReason =
  | "Spam"
  | "Harassment"
  | "InappropriateContent"
  | "Underage"
  | "Scam"
  | "CopyrightViolation"
  | "Other";

export type CreditTransactionType = "Topup" | "Purchase" | "Refund";

export type PayoutStatus = "Pending" | "Processing" | "Completed" | "Failed";

export type SubscriptionStatus = "Active" | "PastDue" | "Cancelled" | "Expired";

export type CustomRequestStatus =
  | "Pending"
  | "Accepted"
  | "InProgress"
  | "Delivered"
  | "Completed"
  | "Rejected"
  | "Disputed"
  | "Refunded";

export type DmcaStatus = "Pending" | "Reviewing" | "TakenDown" | "Rejected";

export type ScenarioStatus = "Draft" | "Active" | "Paused" | "Archived";

export type EnrollmentStatus = "Active" | "Paused" | "Completed" | "OptOut";

export type ActionType = "Visit" | "Message" | "Follow" | "Like";

export type ExecutionResult =
  | "Pending"
  | "Success"
  | "Failed"
  | "Skipped"
  | "RateLimited"
  | "OptedOut";

export type BroadcastStatus =
  | "Draft"
  | "Scheduled"
  | "Sending"
  | "Completed"
  | "Aborted";

export type MediaType = "Image" | "Video" | "Audio";

// ===== Core Entities =====

export interface User {
  id: string;
  email: string;
  role: Role;
  isVerified18: boolean;
  isActive: boolean;
  isShadowBanned?: boolean;
  blockReason?: string;
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
  updatedAt?: string;
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
  reviewComment?: string;
  createdAt: string;
}

export interface ContentMedia {
  id: string;
  contentId: string;
  mediaType: MediaType;
  url: string;
  thumbnailUrl?: string;
  fileSizeBytes: number;
  sortOrder: number;
}

// ===== Chat =====

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

export interface PpvMessage {
  id: string;
  messageId: string;
  priceCredits: number;
  previewText?: string;
}

export interface PpvUnlock {
  id: string;
  ppvMessageId: string;
  userId: string;
  paidCredits: number;
  unlockedAt: string;
}

export interface CreatorChatSettings {
  creatorId: string;
  messagePriceCredits: number;
  allowFreeMessages: boolean;
  freeMessagesPerDay: number;
  autoReplyEnabled: boolean;
  autoReplyMessage?: string;
}

// ===== Wallet & Payments =====

export interface CreditWallet {
  userId: string;
  balance: number;
  updatedAt: string;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  type: CreditTransactionType;
  amount: number;
  gatewayRef?: string;
  createdAt: string;
}

export interface Purchase {
  id: string;
  buyerId: string;
  contentId: string;
  priceCredits: number;
  attributedToModeratorId?: string;
  attributedWindowSec?: number;
  createdAt: string;
}

export interface Tip {
  id: string;
  senderId: string;
  recipientId: string;
  amountCredits: number;
  message?: string;
  threadId?: string;
  createdAt: string;
}

export interface GiftItem {
  id: string;
  name: string;
  iconUrl: string;
  priceCredits: number;
  isActive: boolean;
  sortOrder: number;
}

export interface PayoutRecord {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: PayoutStatus;
  gatewayRef?: string;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
}

// ===== Social Features =====

export interface Like {
  id: string;
  userId: string;
  contentId?: string;
  commentId?: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  contentId: string;
  parentId?: string;
  body: string;
  createdAt: string;
  updatedAt?: string;
  replies?: Comment[];
}

export interface Follow {
  id: string;
  followerId: string;
  followeeId: string;
  createdAt: string;
}

export interface Share {
  id: string;
  userId: string;
  contentId: string;
  createdAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  contentId: string;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body?: string;
  actorId?: string;
  entityId?: string;
  entityType?: string;
  readAt?: string;
  createdAt: string;
}

export interface FeedEvent {
  id: string;
  userId: string;
  eventType: string;
  entityId: string;
  score: number;
  createdAt: string;
}

export interface TrendingSnapshot {
  id: string;
  entityType: string;
  entityId: string;
  period: string;
  score: number;
  snapshotDate: string;
}

export interface BlockedUser {
  id: string;
  blockerId: string;
  blockedId: string;
  createdAt: string;
}

// ===== Subscriptions & Bundles =====

export interface SubscriptionTier {
  id: string;
  creatorId: string;
  name: string;
  description?: string;
  priceCreditsMonthly: number;
  priceEurMonthly: number;
  sortOrder: number;
  isActive: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  creatorId: string;
  tierId: string;
  status: SubscriptionStatus;
  startedAt: string;
  currentPeriodEnd: string;
  cancelledAt?: string;
  externalId?: string;
}

export interface Bundle {
  id: string;
  creatorId: string;
  title: string;
  description?: string;
  priceCredits: number;
  discountPercent: number;
  isActive: boolean;
  createdAt: string;
}

export interface CustomRequest {
  id: string;
  requesterId: string;
  creatorId: string;
  description: string;
  priceCredits: number;
  escrowCredits: number;
  status: CustomRequestStatus;
  deadlineAt?: string;
  deliveredContentId?: string;
  createdAt: string;
}

// ===== Referral & Promo =====

export interface ReferralCode {
  id: string;
  userId: string;
  code: string;
  rewardCredits: number;
  maxRedemptions: number;
  currentRedemptions: number;
  isActive: boolean;
  createdAt: string;
}

export interface PromoCode {
  id: string;
  creatorId: string;
  code: string;
  discountPercent: number;
  maxRedemptions: number;
  currentRedemptions: number;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
}

// ===== Reports & Moderation =====

export interface Report {
  id: string;
  reporterId: string;
  targetUserId?: string;
  targetContentId?: string;
  targetMessageId?: string;
  reason: ReportReason;
  description?: string;
  status: ReportStatus;
  reviewedById?: string;
  reviewComment?: string;
  createdAt: string;
}

export interface DmcaReport {
  id: string;
  reporterId: string;
  contentId: string;
  originalUrl: string;
  description: string;
  evidenceUrlsJson?: string;
  status: DmcaStatus;
  reviewedById?: string;
  reviewComment?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: string;
  ipAddress?: string;
  createdAt: string;
}

export interface PolicyConfig {
  key: string;
  value: string;
  description?: string;
  updatedAt: string;
  updatedById?: string;
}

// ===== Agency =====

export interface Agency {
  id: string;
  name: string;
  ownerId: string;
  perMessageRate: number;
  revenueSharePercent: number;
  agencyCutPercent: number;
  isActive: boolean;
  createdAt: string;
}

export interface AgencyModerator {
  agencyId: string;
  moderatorId: string;
  customPerMessageRate?: number;
  customRevenueSharePercent?: number;
  joinedAt: string;
  isActive: boolean;
}

export interface ModeratorCompensation {
  id: string;
  moderatorId: string;
  periodStart: string;
  periodEnd: string;
  totalMessages: number;
  totalDialogs: number;
  attributedUnlocks: number;
  fixedCompensation: number;
  revenueShare: number;
  totalCompensation: number;
  calculatedAt: string;
}

// ===== Orchestrator =====

export interface Scenario {
  id: string;
  name: string;
  description?: string;
  status: ScenarioStatus;
  priority: number;
  triggerType?: string;
  triggerConfigJson?: string;
  createdAt: string;
  steps?: ScenarioStep[];
}

export interface ScenarioStep {
  id: string;
  scenarioId: string;
  stepOrder: number;
  dayOffset: number;
  timeOffsetMinutes: number;
  actionType: ActionType;
  senderProfileId?: string;
  templateId?: string;
  targetingQueryJson?: string;
  rateLimitConfigJson?: string;
  contentIdTarget?: string;
}

export interface ScenarioEnrollment {
  id: string;
  scenarioId: string;
  userId: string;
  status: EnrollmentStatus;
  currentStepIndex: number;
  enrolledAt: string;
  completedAt?: string;
  optedOutAt?: string;
}

export interface ScenarioExecution {
  id: string;
  enrollmentId: string;
  stepId: string;
  result: ExecutionResult;
  errorMessage?: string;
  retryCount: number;
  scheduledAt: string;
  executedAt?: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  bodyText: string;
  variablesJson?: string;
  abGroup?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Broadcast {
  id: string;
  name: string;
  status: BroadcastStatus;
  targetingQueryJson?: string;
  senderProfileId?: string;
  estimatedRecipients: number;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  isDryRun: boolean;
  createdAt: string;
  variants?: BroadcastVariant[];
}

export interface BroadcastVariant {
  id: string;
  broadcastId: string;
  variantName: string;
  templateId: string;
  weightPercent: number;
  sendCount: number;
  responseCount: number;
  unlockCount: number;
}

export interface BroadcastExecution {
  id: string;
  broadcastId: string;
  variantId: string;
  userId: string;
  result: ExecutionResult;
  scheduledAt: string;
  executedAt?: string;
}

export interface OrchestratorBlacklist {
  id: string;
  userId: string;
  reason?: string;
  createdAt: string;
}

// ===== Auth & Security =====

export interface TwoFactorAuth {
  userId: string;
  isEnabled: boolean;
  enabledAt?: string;
}

export interface SocialLogin {
  id: string;
  userId: string;
  provider: string;
  providerUserId: string;
  email?: string;
  createdAt: string;
}

export interface PushSubscriptionInfo {
  id: string;
  userId: string;
  endpoint: string;
  isActive: boolean;
  createdAt: string;
}

export interface ScheduledContent {
  id: string;
  contentId: string;
  scheduledAt: string;
  isPublished: boolean;
  createdAt: string;
}

// ===== DTOs =====

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: UserInfo;
}

export interface UserInfo {
  id: string;
  email: string;
  username: string;
  role: string;
  avatarUrl?: string;
}

export interface LoginProtectionStatus {
  isLocked: boolean;
  requiresCaptcha: boolean;
  attemptsRemaining: number;
  lockoutMinutes: number;
}

// ===== Generic Response Types =====

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
