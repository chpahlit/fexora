"use client";

import { AdminSidebar } from "@/components/layout/admin-sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex flex-1 flex-col ml-60">
        {children}
      </div>
    </div>
  );
}
