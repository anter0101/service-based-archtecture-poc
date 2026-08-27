"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

import { Button } from "@dms/ui";

import { LanguageSwitcher } from "./language-switcher";

export function AppHeader() {
  const t = useTranslations("common");
  const locale = useLocale();
  const { data: session } = useSession();

  const shellUrl = process.env.NEXT_PUBLIC_SHELL_URL ?? "http://localhost:3003";
  const authUrl = process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3002";

  function logout() {
    window.location.href = `${authUrl}/api/auth/logout?locale=${locale}`;
  }

  return (
    <header className="animate-fade sticky top-0 z-20 border-b border-border/70 bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-6">
          <p className="font-display text-xl tracking-tight text-ink">
            {t("appName")}
          </p>
          <a
            href={`${shellUrl}/${locale}/home`}
            className="text-ink-muted hover:text-ink text-sm transition-colors"
          >
            {t("home")}
          </a>
        </div>
        <div className="flex items-center gap-3">
          {session?.user?.name && (
            <span className="text-ink-muted hidden text-sm sm:inline">
              {t("welcomeUser", { name: session.user.name })}
            </span>
          )}
          <LanguageSwitcher />
          <Button variant="outline" size="sm" type="button" onClick={logout}>
            {t("logout")}
          </Button>
        </div>
      </div>
    </header>
  );
}
