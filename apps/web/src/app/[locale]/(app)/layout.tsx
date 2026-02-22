import { Navbar } from "@/components/layout/navbar";
import { PushNotificationPrompt } from "@/components/push-notification-prompt";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
      <PushNotificationPrompt />
    </div>
  );
}
