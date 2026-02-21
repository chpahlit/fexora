import { z } from "zod";

// ── Auth ──────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/),
  referralCode: z.string().optional(),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

// ── Profile ───────────────────────────────────────────

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/)
    .optional(),
  bio: z.string().max(500).optional(),
  age: z.number().int().min(18).max(120).optional(),
  country: z.string().min(2).max(2).optional(),
  offersCustom: z.boolean().optional(),
});

// ── Content ───────────────────────────────────────────

export const createContentSchema = z.object({
  title: z.string().min(1).max(200),
  type: z.enum(["Image", "Video", "Audio", "Text"]),
  priceCredits: z.number().int().min(0),
});

// ── Chat ──────────────────────────────────────────────

export const sendMessageSchema = z.object({
  receiverId: z.string().uuid(),
  body: z.string().min(1).max(5000),
});

// ── Wallet ────────────────────────────────────────────

export const topupSchema = z.object({
  amount: z.number().int().min(1),
});

export const unlockSchema = z.object({
  contentId: z.string().uuid(),
});

// ── Reports ───────────────────────────────────────────

export const createReportSchema = z.object({
  targetType: z.enum(["content", "user", "message"]),
  targetId: z.string().uuid(),
  reason: z.string().min(10).max(1000),
});

export const resolveReportSchema = z.object({
  action: z.enum(["dismiss", "warn", "remove", "ban"]),
  note: z.string().max(1000).optional(),
});

// ── Pagination ────────────────────────────────────────

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});
