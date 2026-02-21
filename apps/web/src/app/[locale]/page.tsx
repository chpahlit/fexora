import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function HomePage() {
  const t = useTranslations("common");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold text-primary">FEXORA</h1>
        <p className="text-lg text-muted-foreground">{t("welcome")}</p>
      </div>

      <div className="flex gap-4">
        <Link
          href="/login"
          className="rounded-lg bg-primary px-6 py-3 text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          {t("login")}
        </Link>
        <Link
          href="/register"
          className="rounded-lg bg-secondary px-6 py-3 text-secondary-foreground font-medium hover:bg-secondary/90 transition-colors"
        >
          {t("register")}
        </Link>
      </div>

      <div className="flex gap-2 text-sm text-muted-foreground">
        <Link href="/" locale="de" className="hover:text-primary">DE</Link>
        <span>|</span>
        <Link href="/" locale="en" className="hover:text-primary">EN</Link>
      </div>
    </main>
  );
}
