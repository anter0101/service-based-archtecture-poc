"use client";

import { useLocale, useTranslations } from "next-intl";

import { usePathname, useRouter } from "@dms/i18n/navigation";
import { Button } from "@dms/ui";

export function LanguageSwitcher() {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const next = locale === "en" ? "ar" : "en";

  return (
    <Button
      variant="ghost"
      size="sm"
      type="button"
      aria-label={t("language")}
      className="text-ink-muted hover:text-ink min-w-11 font-medium tracking-wide"
      onClick={() => router.replace(pathname, { locale: next })}
    >
      {next.toUpperCase()}
    </Button>
  );
}
