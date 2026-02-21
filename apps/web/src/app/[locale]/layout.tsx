import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Providers } from "@/components/providers";
import { CookieBanner } from "@/components/cookie-banner";
import "../globals.css";

export const metadata: Metadata = {
  title: "FEXORA",
  description: "Social-Media-Plattform mit Community- und Marktplatz-Funktionen",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "de" | "en")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
            <CookieBanner />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
