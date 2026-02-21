export const APP_NAME = "Fexora";

export const ROLES = {
  GUEST: "Guest",
  USER: "User",
  CREATOR: "Creator",
  MODERATOR: "Moderator",
  ADMIN: "Admin",
} as const;

export const CONTENT_STATUS = {
  DRAFT: "Draft",
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  REMOVED: "Removed",
} as const;

export const CONTENT_TYPES = {
  IMAGE: "Image",
  VIDEO: "Video",
  AUDIO: "Audio",
  TEXT: "Text",
} as const;

export const UPLOAD_LIMITS = {
  IMAGE_MAX_SIZE: 20 * 1024 * 1024, // 20 MB
  VIDEO_MAX_SIZE: 500 * 1024 * 1024, // 500 MB
  AUDIO_MAX_SIZE: 100 * 1024 * 1024, // 100 MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  ALLOWED_VIDEO_TYPES: ["video/mp4", "video/quicktime"],
  ALLOWED_AUDIO_TYPES: ["audio/mpeg", "audio/mp4", "audio/wav"],
} as const;

export const API_ROUTES = {
  AUTH: {
    SIGNUP: "/auth/signup",
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
  },
  PROFILES: "/profiles",
  CONTENT: "/content",
  FEED: "/feed",
  STORIES: "/stories",
  MESSAGES: "/messages",
  WALLET: {
    TOPUP: "/wallet/topup",
    HISTORY: "/wallet/history",
  },
  UNLOCK: "/unlock",
} as const;
