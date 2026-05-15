"use client";

import { useAuth } from "@/lib/auth";
import { Sidebar } from "@/components/sidebar";

interface AppShellProps {
  children: React.ReactNode;
  /** If true, content fills the entire width (no padding/max-width). Used by board page. */
  fullWidth?: boolean;
}

export function AppShell({ children, fullWidth }: AppShellProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      {fullWidth ? (
        <div className="flex-1 overflow-hidden">{children}</div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl p-6">{children}</div>
        </div>
      )}
    </div>
  );
}
