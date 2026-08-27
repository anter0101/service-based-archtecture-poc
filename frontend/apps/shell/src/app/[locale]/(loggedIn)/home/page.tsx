import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("landing");
  const tc = await getTranslations("common");
  const dashboardUrl =
    process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "http://localhost:3004";

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col justify-center py-10">
      <div className="mesh-grid pointer-events-none absolute inset-0 opacity-70" />

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
        <p className="animate-fade font-display text-primary mb-5 text-lg sm:text-xl">
          {tc("appName")}
        </p>
        <h1 className="animate-rise font-display max-w-3xl text-4xl leading-[1.08] text-ink sm:text-5xl lg:text-6xl">
          {t("title")}
        </h1>
        <p className="animate-rise-delay text-ink-muted mt-5 max-w-xl text-base leading-relaxed sm:text-lg">
          {t("description")}
        </p>

        <div className="animate-rise-delay-2 mt-10">
          <a
            href={`${dashboardUrl}/${locale}/dashboard`}
            className="group surface-panel inline-flex items-center gap-4 px-6 py-5 transition-transform duration-300 hover:-translate-y-0.5"
          >
            <span className="bg-accent-soft text-primary flex size-11 items-center justify-center rounded-xl">
              <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
            <span className="text-left">
              <span className="block font-medium text-ink">
                {t("cards.dashboard")}
              </span>
              <span className="text-ink-muted mt-0.5 block text-sm">
                {t("cards.dashboardDesc")}
              </span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
