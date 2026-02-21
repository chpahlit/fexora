"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FexoraClient, setApiClient } from "@fexora/api-client";
import type { AuthResponse, UserInfo } from "@fexora/api-client";
import type { User } from "@fexora/shared";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  client: FexoraClient;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "fexora_access_token";
const REFRESH_KEY = "fexora_refresh_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [client] = useState(() => {
    const c = new FexoraClient(apiUrl);
    setApiClient(c);
    return c;
  });

  const login = useCallback(
    (accessToken: string, refreshToken: string, user: User) => {
      localStorage.setItem(TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_KEY, refreshToken);
      client.setToken(accessToken);
      setUser(user);
    },
    [client]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    client.setToken(null);
    setUser(null);
  }, [client]);

  const updateUser = useCallback((user: User) => {
    setUser(user);
  }, []);

  // Refresh token logic
  const refreshAuth = useCallback(async () => {
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    if (!refreshToken) return false;

    try {
      const res = await client.post<AuthResponse>("/auth/refresh", {
        refreshToken,
      });
      if (res.success && res.data) {
        localStorage.setItem(TOKEN_KEY, res.data.accessToken);
        localStorage.setItem(REFRESH_KEY, res.data.refreshToken);
        client.setToken(res.data.accessToken);
        setUser(res.data.user);
        return true;
      }
    } catch {
      // Refresh failed
    }
    return false;
  }, [client]);

  // Initialize auth state from stored tokens
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setIsLoading(false);
        return;
      }

      client.setToken(token);

      // Try to get current user
      const res = await client.get<UserInfo>("/auth/me");
      if (res.success && res.data) {
        setUser({
          id: res.data.id,
          email: res.data.email,
          role: res.data.role as User["role"],
          isVerified18: true,
          isActive: true,
          createdAt: "",
          profile: res.data.profile ?? undefined,
        });
      } else {
        // Token might be expired, try refresh
        const refreshed = await refreshAuth();
        if (!refreshed) {
          logout();
        }
      }

      setIsLoading(false);
    };

    init();
  }, [client, logout, refreshAuth]);

  // Auto-refresh token every 14 minutes (tokens typically last 15 min)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(
      () => {
        refreshAuth();
      },
      14 * 60 * 1000
    );

    return () => clearInterval(interval);
  }, [user, refreshAuth]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      logout,
      updateUser,
      client,
    }),
    [user, isLoading, login, logout, updateUser, client]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
