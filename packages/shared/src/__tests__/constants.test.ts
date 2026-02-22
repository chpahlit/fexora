import { describe, it, expect } from "vitest";
import {
  APP_NAME,
  ROLES,
  CONTENT_STATUS,
  CONTENT_TYPES,
  UPLOAD_LIMITS,
  API_ROUTES,
} from "../constants";

describe("constants", () => {
  it("APP_NAME is Fexora", () => {
    expect(APP_NAME).toBe("Fexora");
  });

  it("ROLES contains all expected roles", () => {
    expect(ROLES.GUEST).toBe("Guest");
    expect(ROLES.USER).toBe("User");
    expect(ROLES.CREATOR).toBe("Creator");
    expect(ROLES.MODERATOR).toBe("Moderator");
    expect(ROLES.ADMIN).toBe("Admin");
  });

  it("CONTENT_STATUS has expected values", () => {
    expect(Object.values(CONTENT_STATUS)).toEqual(
      expect.arrayContaining(["Draft", "Pending", "Approved", "Rejected", "Removed"])
    );
  });

  it("CONTENT_TYPES has expected values", () => {
    expect(CONTENT_TYPES.IMAGE).toBe("Image");
    expect(CONTENT_TYPES.VIDEO).toBe("Video");
    expect(CONTENT_TYPES.AUDIO).toBe("Audio");
    expect(CONTENT_TYPES.TEXT).toBe("Text");
  });

  it("UPLOAD_LIMITS are reasonable", () => {
    expect(UPLOAD_LIMITS.IMAGE_MAX_SIZE).toBe(20 * 1024 * 1024);
    expect(UPLOAD_LIMITS.VIDEO_MAX_SIZE).toBe(500 * 1024 * 1024);
    expect(UPLOAD_LIMITS.AUDIO_MAX_SIZE).toBe(100 * 1024 * 1024);
    expect(UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES).toContain("image/jpeg");
    expect(UPLOAD_LIMITS.ALLOWED_VIDEO_TYPES).toContain("video/mp4");
  });

  it("API_ROUTES auth paths start with /auth", () => {
    expect(API_ROUTES.AUTH.SIGNUP).toMatch(/^\/auth\//);
    expect(API_ROUTES.AUTH.LOGIN).toMatch(/^\/auth\//);
    expect(API_ROUTES.AUTH.REFRESH).toMatch(/^\/auth\//);
  });
});
