import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FlameMark } from "@/components/ui/flame-mark";

export function MarketingFooter() {
  const t = useTranslations("footer");

  const footerLinks = [
    { href: "/terms", label: t("terms") },
    { href: "/privacy", label: t("privacy") },
    { href: "/register", label: t("becomeCreator") },
    { href: "/support", label: t("support") },
    { href: "/imprint", label: t("imprint") },
  ];

  return (
    <footer className="border-t border-hair px-14 py-10 flex items-center gap-8">
      <Link href="/" className="flex items-center gap-2">
        <FlameMark size={18} />
        <span className="font-serif text-[18px] text-gold">FEXORA</span>
      </Link>

      <div className="flex-1 flex gap-6">
        {footerLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-[12px] text-text-muted hover:text-text transition-fexora"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <span className="text-[11px] text-text-faint">
        {t("copyright")}
      </span>
    </footer>
  );
}
