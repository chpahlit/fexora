import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { BottomNav } from "@/components/layout/bottom-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar — hidden on mobile, visible md+ */}
      <AppSidebar />

      {/* Main column — full width on mobile, offset by sidebar on md+ */}
      <div className="flex flex-1 flex-col md:ml-60">
        <AppTopbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-7 pb-28 md:pb-7">
          {children}
        </main>
      </div>

      {/* Bottom nav — visible on mobile only */}
      <BottomNav />
    </div>
  );
}
