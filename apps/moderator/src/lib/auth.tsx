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
  client: FexoraClient;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "fexora_mod_access_token";
const REFRESH_KEY = "fexora_mod_refresh_token";

const ALLOWED_ROLES: User["role"][] = ["Admin", "Moderator"];

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

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setIsLoading(false);
        return;
      }

      client.setToken(token);
      const res = await client.get<UserInfo>("/auth/me");
      if (res.success && res.data) {
        const u: User = {
          id: res.data.id,
          email: res.data.email,
          role: res.data.role as User["role"],
          isVerified18: true,
          isActive: true,
          createdAt: "",
          profile: res.data.profile ?? undefined,
        };
        if (ALLOWED_ROLES.includes(u.role)) {
          setUser(u);
        } else {
          logout();
        }
      } else {
        const refreshToken = localStorage.getItem(REFRESH_KEY);
        if (refreshToken) {
          const refreshRes = await client.post<AuthResponse>("/auth/refresh", { refreshToken });
          if (refreshRes.success && refreshRes.data) {
            localStorage.setItem(TOKEN_KEY, refreshRes.data.accessToken);
            localStorage.setItem(REFRESH_KEY, refreshRes.data.refreshToken);
            client.setToken(refreshRes.data.accessToken);
            if (ALLOWED_ROLES.includes(refreshRes.data.user.role)) {
              setUser(refreshRes.data.user);
            } else {
              logout();
            }
          } else {
            logout();
          }
        }
      }
      setIsLoading(false);
    };
    init();
  }, [client, logout]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoading, isAuthenticated: !!user, login, logout, client }),
    [user, isLoading, login, logout, client]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
