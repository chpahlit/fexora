"use client";

import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { ApiResponse, PaginatedResponse } from "@fexora/shared";
import type { FexoraClient } from "./client";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RefreshRequest,
  UserInfo,
  ProfileResponse,
  UpdateProfileRequest,
  ContentResponse,
  CreateContentRequest,
  ThreadResponse,
  MessageResponse,
  SendMessageRequest,
  WalletResponse,
  TransactionResponse,
  TopupRequest,
  TopupResponse,
  UnlockRequest,
  UnlockResponse,
  PaginationParams,
  CreateReportRequest,
  ResolveReportRequest,
  ReportResponse,
} from "./types";

// ── Client singleton ──────────────────────────────────

let _client: FexoraClient | null = null;

export function setApiClient(client: FexoraClient) {
  _client = client;
}

function getClient(): FexoraClient {
  if (!_client) throw new Error("API client not initialized. Call setApiClient() first.");
  return _client;
}

// ── Query Keys ────────────────────────────────────────

export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  profiles: {
    byUsername: (username: string) => ["profiles", username] as const,
  },
  content: {
    byId: (id: string) => ["content", id] as const,
    my: (params?: PaginationParams) => ["content", "my", params] as const,
    feed: (params?: PaginationParams) => ["content", "feed", params] as const,
  },
  chat: {
    threads: ["chat", "threads"] as const,
    messages: (threadId: string) => ["chat", "messages", threadId] as const,
  },
  wallet: {
    balance: ["wallet", "balance"] as const,
    transactions: (params?: PaginationParams) =>
      ["wallet", "transactions", params] as const,
  },
  reports: {
    list: (params?: PaginationParams & { status?: string }) =>
      ["reports", params] as const,
    byId: (id: string) => ["reports", id] as const,
  },
} as const;

// ── Auth Hooks ────────────────────────────────────────

export function useMe(
  options?: Omit<UseQueryOptions<ApiResponse<UserInfo>>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: () => getClient().get<UserInfo>("/auth/me"),
    ...options,
  });
}

export function useLogin(
  options?: UseMutationOptions<ApiResponse<AuthResponse>, Error, LoginRequest>
) {
  return useMutation({
    mutationFn: (data: LoginRequest) =>
      getClient().post<AuthResponse>("/auth/login", data),
    ...options,
  });
}

export function useRegister(
  options?: UseMutationOptions<ApiResponse<AuthResponse>, Error, RegisterRequest>
) {
  return useMutation({
    mutationFn: (data: RegisterRequest) =>
      getClient().post<AuthResponse>("/auth/register", data),
    ...options,
  });
}

export function useRefreshToken(
  options?: UseMutationOptions<ApiResponse<AuthResponse>, Error, RefreshRequest>
) {
  return useMutation({
    mutationFn: (data: RefreshRequest) =>
      getClient().post<AuthResponse>("/auth/refresh", data),
    ...options,
  });
}

export function useLogout(
  options?: UseMutationOptions<ApiResponse<boolean>, Error, RefreshRequest>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RefreshRequest) =>
      getClient().post<boolean>("/auth/logout", data),
    onSuccess: (...args) => {
      queryClient.clear();
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

// ── Profile Hooks ─────────────────────────────────────

export function useProfile(
  username: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<ProfileResponse>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.profiles.byUsername(username),
    queryFn: () => getClient().get<ProfileResponse>(`/profiles/${username}`),
    enabled: !!username,
    ...options,
  });
}

export function useUpdateProfile(
  options?: UseMutationOptions<
    ApiResponse<ProfileResponse>,
    Error,
    UpdateProfileRequest
  >
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) =>
      getClient().patch<ProfileResponse>("/profiles/me", data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

export function useUploadAvatar(
  options?: UseMutationOptions<ApiResponse<string>, Error, File>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return getClient().upload<string>("/profiles/me/avatar", formData);
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

// ── Content Hooks ─────────────────────────────────────

export function useContent(
  id: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<ContentResponse>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.content.byId(id),
    queryFn: () => getClient().get<ContentResponse>(`/content/${id}`),
    enabled: !!id,
    ...options,
  });
}

export function useMyContent(params?: PaginationParams) {
  return useQuery({
    queryKey: queryKeys.content.my(params),
    queryFn: () =>
      getClient().getPaginated<ContentResponse>("/content/my", params),
  });
}

export function useFeed(params?: PaginationParams) {
  return useQuery({
    queryKey: queryKeys.content.feed(params),
    queryFn: () =>
      getClient().getPaginated<ContentResponse>("/content/feed", params),
  });
}

export function useInfiniteFeed(pageSize = 20) {
  return useInfiniteQuery({
    queryKey: ["content", "feed", "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      getClient().getPaginated<ContentResponse>("/content/feed", {
        page: pageParam,
        pageSize,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.success) return undefined;
      const { page, pageSize: ps, total } = lastPage.data;
      return page * ps < total ? page + 1 : undefined;
    },
  });
}

export function useCreateContent(
  options?: UseMutationOptions<
    ApiResponse<ContentResponse>,
    Error,
    CreateContentRequest
  >
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateContentRequest) =>
      getClient().post<ContentResponse>("/content", data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

export function useUploadContentMedia(
  options?: UseMutationOptions<
    ApiResponse<ContentResponse>,
    Error,
    { contentId: string; file: File }
  >
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ contentId, file }) => {
      const formData = new FormData();
      formData.append("file", file);
      return getClient().upload<ContentResponse>(
        `/content/${contentId}/media`,
        formData
      );
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

export function useSubmitContent(
  options?: UseMutationOptions<ApiResponse<ContentResponse>, Error, string>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (contentId: string) =>
      getClient().post<ContentResponse>(`/content/${contentId}/submit`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

// ── Chat Hooks ────────────────────────────────────────

export function useThreads(
  options?: Omit<
    UseQueryOptions<ApiResponse<ThreadResponse[]>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.chat.threads,
    queryFn: () => getClient().get<ThreadResponse[]>("/messages/threads"),
    ...options,
  });
}

export function useMessages(threadId: string, params?: PaginationParams) {
  return useQuery({
    queryKey: queryKeys.chat.messages(threadId),
    queryFn: () =>
      getClient().getPaginated<MessageResponse>(
        `/messages/threads/${threadId}`,
        params
      ),
    enabled: !!threadId,
  });
}

export function useSendMessage(
  options?: UseMutationOptions<
    ApiResponse<MessageResponse>,
    Error,
    SendMessageRequest
  >
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SendMessageRequest) =>
      getClient().post<MessageResponse>("/messages/send", data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["chat"] });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

export function useMarkThreadRead(
  options?: UseMutationOptions<ApiResponse<boolean>, Error, string>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (threadId: string) =>
      getClient().post<boolean>(`/messages/threads/${threadId}/read`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["chat"] });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

// ── Wallet Hooks ──────────────────────────────────────

export function useWalletBalance(
  options?: Omit<
    UseQueryOptions<ApiResponse<WalletResponse>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.wallet.balance,
    queryFn: () => getClient().get<WalletResponse>("/wallet/balance"),
    ...options,
  });
}

export function useTransactions(params?: PaginationParams) {
  return useQuery({
    queryKey: queryKeys.wallet.transactions(params),
    queryFn: () =>
      getClient().getPaginated<TransactionResponse>(
        "/wallet/transactions",
        params
      ),
  });
}

export function useTopup(
  options?: UseMutationOptions<ApiResponse<TopupResponse>, Error, TopupRequest>
) {
  return useMutation({
    mutationFn: (data: TopupRequest) =>
      getClient().post<TopupResponse>("/wallet/topup", data),
    ...options,
  });
}

export function useUnlockContent(
  options?: UseMutationOptions<
    ApiResponse<UnlockResponse>,
    Error,
    UnlockRequest
  >
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UnlockRequest) =>
      getClient().post<UnlockResponse>("/wallet/unlock", data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.balance });
      queryClient.invalidateQueries({ queryKey: ["content"] });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

// ── Reports Hooks ─────────────────────────────────────

export function useCreateReport(
  options?: UseMutationOptions<
    ApiResponse<{ id: string }>,
    Error,
    CreateReportRequest
  >
) {
  return useMutation({
    mutationFn: (data: CreateReportRequest) =>
      getClient().post<{ id: string }>("/reports", data),
    ...options,
  });
}

export function useReports(
  params?: PaginationParams & { status?: string },
  options?: Omit<
    UseQueryOptions<ApiResponse<PaginatedResponse<ReportResponse>>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.reports.list(params),
    queryFn: () => {
      const query = new URLSearchParams();
      if (params?.page) query.set("page", String(params.page));
      if (params?.pageSize) query.set("pageSize", String(params.pageSize));
      if (params?.status) query.set("status", params.status);
      const qs = query.toString();
      return getClient().get<PaginatedResponse<ReportResponse>>(
        qs ? `/reports?${qs}` : "/reports"
      );
    },
    ...options,
  });
}

export function useReport(
  id: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<ReportResponse>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.reports.byId(id),
    queryFn: () => getClient().get<ReportResponse>(`/reports/${id}`),
    enabled: !!id,
    ...options,
  });
}

export function useResolveReport(
  options?: UseMutationOptions<
    ApiResponse<{ success: boolean }>,
    Error,
    { reportId: string; data: ResolveReportRequest }
  >
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reportId, data }) =>
      getClient().post<{ success: boolean }>(
        `/reports/${reportId}/resolve`,
        data
      ),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
