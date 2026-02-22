import { describe, it, expect, vi, beforeEach } from "vitest";
import { FexoraClient } from "../client";

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("FexoraClient", () => {
  let client: FexoraClient;

  beforeEach(() => {
    client = new FexoraClient("http://localhost:5000");
    mockFetch.mockReset();
  });

  describe("constructor", () => {
    it("strips trailing slash from baseUrl", () => {
      const c = new FexoraClient("http://localhost:5000/");
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: "test" }),
      });
      c.get("/test");
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:5000/test",
        expect.any(Object)
      );
    });
  });

  describe("token management", () => {
    it("starts with no token", () => {
      expect(client.getToken()).toBeNull();
    });

    it("sets and gets token", () => {
      client.setToken("my-token");
      expect(client.getToken()).toBe("my-token");
    });

    it("clears token with null", () => {
      client.setToken("my-token");
      client.setToken(null);
      expect(client.getToken()).toBeNull();
    });
  });

  describe("get", () => {
    it("makes GET request", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: 1, name: "Test" }),
      });

      const result = await client.get("/users/1");

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:5000/users/1",
        expect.objectContaining({ method: "GET" })
      );
      expect(result.success).toBe(true);
      expect(result.data).toEqual({ id: 1, name: "Test" });
    });
  });

  describe("post", () => {
    it("makes POST request with JSON body", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: 1 }),
      });

      await client.post("/users", { name: "Test" });

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:5000/users",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ name: "Test" }),
        })
      );
    });
  });

  describe("put", () => {
    it("makes PUT request", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await client.put("/users/1", { name: "Updated" });

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:5000/users/1",
        expect.objectContaining({ method: "PUT" })
      );
    });
  });

  describe("patch", () => {
    it("makes PATCH request", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await client.patch("/users/1", { name: "Patched" });

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:5000/users/1",
        expect.objectContaining({ method: "PATCH" })
      );
    });
  });

  describe("delete", () => {
    it("makes DELETE request", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await client.delete("/users/1");

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:5000/users/1",
        expect.objectContaining({ method: "DELETE" })
      );
    });
  });

  describe("authentication", () => {
    it("includes Authorization header when token is set", async () => {
      client.setToken("bearer-token");
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await client.get("/protected");

      const [, options] = mockFetch.mock.calls[0];
      expect(options.headers["Authorization"]).toBe("Bearer bearer-token");
    });

    it("omits Authorization header when no token", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await client.get("/public");

      const [, options] = mockFetch.mock.calls[0];
      expect(options.headers["Authorization"]).toBeUndefined();
    });
  });

  describe("error handling", () => {
    it("returns error response for non-ok status", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: "Not Found",
        json: () => Promise.resolve({ error: "User not found" }),
      });

      const result = await client.get("/users/999");

      expect(result.success).toBe(false);
      expect(result.error).toBe("User not found");
    });

    it("falls back to statusText when JSON parse fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: "Internal Server Error",
        json: () => Promise.reject(new Error("Invalid JSON")),
      });

      const result = await client.get("/broken");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Internal Server Error");
    });
  });

  describe("getPaginated", () => {
    it("adds pagination params to query string", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [], total: 0 }),
      });

      await client.getPaginated("/content", { page: 2, pageSize: 10 });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("page=2"),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("pageSize=10"),
        expect.any(Object)
      );
    });

    it("works without params", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [], total: 0 }),
      });

      await client.getPaginated("/content");

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:5000/content",
        expect.any(Object)
      );
    });
  });
});
