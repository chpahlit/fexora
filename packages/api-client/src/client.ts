import type { ApiResponse, PaginatedResponse } from "@fexora/shared";

type RequestOptions = {
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

export class FexoraClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  setToken(token: string | null) {
    this.token = token;
  }

  getToken() {
    return this.token;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options?.headers,
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: options?.signal,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: res.statusText }));
      return {
        data: null as T,
        success: false,
        error: error.error ?? res.statusText,
      };
    }

    const data = await res.json();
    return { data, success: true };
  }

  get<T>(path: string, options?: RequestOptions) {
    return this.request<T>("GET", path, undefined, options);
  }

  post<T>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>("POST", path, body, options);
  }

  put<T>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>("PUT", path, body, options);
  }

  patch<T>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>("PATCH", path, body, options);
  }

  delete<T>(path: string, options?: RequestOptions) {
    return this.request<T>("DELETE", path, undefined, options);
  }

  async upload<T>(path: string, formData: FormData, options?: RequestOptions) {
    const headers: Record<string, string> = { ...options?.headers };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers,
      body: formData,
      signal: options?.signal,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: res.statusText }));
      return {
        data: null as T,
        success: false,
        error: error.error ?? res.statusText,
      } as ApiResponse<T>;
    }

    const data = await res.json();
    return { data, success: true } as ApiResponse<T>;
  }

  async getPaginated<T>(
    path: string,
    params?: { page?: number; pageSize?: number },
    options?: RequestOptions
  ) {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.pageSize) query.set("pageSize", String(params.pageSize));
    const qs = query.toString();
    return this.request<PaginatedResponse<T>>(
      "GET",
      qs ? `${path}?${qs}` : path,
      undefined,
      options
    );
  }
}
