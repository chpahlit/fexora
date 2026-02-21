"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/explore", label: t("explore") },
    ...(isAuthenticated
      ? [
          { href: "/chat", label: t("chat") },
          { href: "/notifications", label: t("notifications") },
          { href: "/wallet", label: t("wallet") },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-primary">
            FEXORA
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm transition-colors hover:text-primary",
                  pathname === link.href
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link href={`/profile/${user.profile?.username ?? ""}`}>
                <Avatar className="h-8 w-8">
                  {user.profile?.avatarUrl && (
                    <AvatarImage src={user.profile.avatarUrl} />
                  )}
                  <AvatarFallback>
                    {(user.profile?.username ?? user.email)[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                {tc("logout")}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                {tc("login")}
              </Link>
              <Link
                href="/register"
                className={cn(buttonVariants({ size: "sm" }))}
              >
                {tc("register")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
