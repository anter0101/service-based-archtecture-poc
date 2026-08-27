import { getTranslations } from "next-intl/server";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("common");

  return (
    <div className="relative flex min-h-screen overflow-hidden">
      <div className="mesh-grid pointer-events-none absolute inset-0" />

      <aside className="relative hidden w-[46%] flex-col justify-between p-10 lg:flex xl:p-14">
        <p className="animate-fade font-display text-2xl tracking-tight text-ink">
          {t("appName")}
        </p>
        <div className="animate-rise max-w-md space-y-4">
          <h1 className="font-display text-5xl leading-[1.05] text-ink xl:text-6xl">
            {t("authAsideTitle")}
          </h1>
          <p className="text-ink-muted text-base leading-relaxed">
            {t("authAsideBody")}
          </p>
        </div>
        <p className="animate-fade text-ink-muted text-sm">{t("authAsideFoot")}</p>
      </aside>

      <main className="relative flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
        <div className="animate-rise-delay w-full max-w-[420px]">{children}</div>
      </main>
    </div>
  );
}
