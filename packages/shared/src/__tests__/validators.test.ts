import { describe, it, expect } from "vitest";
import {
  loginSchema,
  registerSchema,
  updateProfileSchema,
  createContentSchema,
  sendMessageSchema,
  topupSchema,
  unlockSchema,
  createReportSchema,
  paginationSchema,
} from "../validators";

describe("loginSchema", () => {
  it("accepts valid login data", () => {
    const result = loginSchema.safeParse({
      email: "user@fexora.de",
      password: "secure123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "secure123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short password", () => {
    const result = loginSchema.safeParse({
      email: "user@fexora.de",
      password: "short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password over 128 chars", () => {
    const result = loginSchema.safeParse({
      email: "user@fexora.de",
      password: "a".repeat(129),
    });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("accepts valid registration", () => {
    const result = registerSchema.safeParse({
      email: "user@fexora.de",
      password: "secure123",
      username: "testuser",
    });
    expect(result.success).toBe(true);
  });

  it("accepts optional referralCode", () => {
    const result = registerSchema.safeParse({
      email: "user@fexora.de",
      password: "secure123",
      username: "testuser",
      referralCode: "ABC123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects username shorter than 3 chars", () => {
    const result = registerSchema.safeParse({
      email: "user@fexora.de",
      password: "secure123",
      username: "ab",
    });
    expect(result.success).toBe(false);
  });

  it("rejects username with special characters", () => {
    const result = registerSchema.safeParse({
      email: "user@fexora.de",
      password: "secure123",
      username: "user@name!",
    });
    expect(result.success).toBe(false);
  });

  it("accepts username with underscores", () => {
    const result = registerSchema.safeParse({
      email: "user@fexora.de",
      password: "secure123",
      username: "test_user_123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects username over 30 chars", () => {
    const result = registerSchema.safeParse({
      email: "user@fexora.de",
      password: "secure123",
      username: "a".repeat(31),
    });
    expect(result.success).toBe(false);
  });
});

describe("updateProfileSchema", () => {
  it("accepts empty object (all optional)", () => {
    const result = updateProfileSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts valid profile update", () => {
    const result = updateProfileSchema.safeParse({
      username: "newname",
      bio: "Hello world",
      age: 25,
      country: "DE",
      offersCustom: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects age under 18", () => {
    const result = updateProfileSchema.safeParse({ age: 17 });
    expect(result.success).toBe(false);
  });

  it("rejects country code not 2 chars", () => {
    const result = updateProfileSchema.safeParse({ country: "DEU" });
    expect(result.success).toBe(false);
  });

  it("rejects bio over 500 chars", () => {
    const result = updateProfileSchema.safeParse({ bio: "x".repeat(501) });
    expect(result.success).toBe(false);
  });
});

describe("createContentSchema", () => {
  it("accepts valid content", () => {
    const result = createContentSchema.safeParse({
      title: "My Photo",
      type: "Image",
      priceCredits: 50,
    });
    expect(result.success).toBe(true);
  });

  it("accepts free content (0 credits)", () => {
    const result = createContentSchema.safeParse({
      title: "Free Post",
      type: "Text",
      priceCredits: 0,
    });
    expect(result.success).toBe(true);
  });

  it("rejects negative price", () => {
    const result = createContentSchema.safeParse({
      title: "Bad",
      type: "Image",
      priceCredits: -1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid content type", () => {
    const result = createContentSchema.safeParse({
      title: "Bad",
      type: "PDF",
      priceCredits: 10,
    });
    expect(result.success).toBe(false);
  });
});

describe("sendMessageSchema", () => {
  it("accepts valid message", () => {
    const result = sendMessageSchema.safeParse({
      receiverId: "550e8400-e29b-41d4-a716-446655440000",
      body: "Hello!",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty body", () => {
    const result = sendMessageSchema.safeParse({
      receiverId: "550e8400-e29b-41d4-a716-446655440000",
      body: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid UUID", () => {
    const result = sendMessageSchema.safeParse({
      receiverId: "not-a-uuid",
      body: "Hello!",
    });
    expect(result.success).toBe(false);
  });
});

describe("topupSchema", () => {
  it("accepts valid amount", () => {
    const result = topupSchema.safeParse({ amount: 100 });
    expect(result.success).toBe(true);
  });

  it("rejects zero amount", () => {
    const result = topupSchema.safeParse({ amount: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects decimal amount", () => {
    const result = topupSchema.safeParse({ amount: 10.5 });
    expect(result.success).toBe(false);
  });
});

describe("createReportSchema", () => {
  it("accepts valid report", () => {
    const result = createReportSchema.safeParse({
      targetType: "content",
      targetId: "550e8400-e29b-41d4-a716-446655440000",
      reason: "This violates community guidelines and should be removed.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects reason under 10 chars", () => {
    const result = createReportSchema.safeParse({
      targetType: "content",
      targetId: "550e8400-e29b-41d4-a716-446655440000",
      reason: "Bad",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid target type", () => {
    const result = createReportSchema.safeParse({
      targetType: "comment",
      targetId: "550e8400-e29b-41d4-a716-446655440000",
      reason: "This is a valid reason for the report",
    });
    expect(result.success).toBe(false);
  });
});

describe("paginationSchema", () => {
  it("provides defaults", () => {
    const result = paginationSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.pageSize).toBe(20);
    }
  });

  it("rejects page 0", () => {
    const result = paginationSchema.safeParse({ page: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects pageSize over 100", () => {
    const result = paginationSchema.safeParse({ pageSize: 101 });
    expect(result.success).toBe(false);
  });
});
