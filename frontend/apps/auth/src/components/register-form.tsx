"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { register as registerUser } from "@dms/api-client";
import { Link } from "@dms/i18n/navigation";
import { Button, Input, Label } from "@dms/ui";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof schema>;

export function RegisterForm() {
  const t = useTranslations("auth");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
    setPending(true);
    setError(null);
    try {
      await registerUser(values);
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      if (result?.error) {
        setError(t("loginFailed"));
        setPending(false);
        return;
      }
      window.location.href = `${process.env.NEXT_PUBLIC_SHELL_URL ?? "http://localhost:3003"}/${locale}/home`;
    } catch {
      setError(t("registerFailed"));
      setPending(false);
    }
  }

  return (
    <div className="surface-panel space-y-8 p-8 sm:p-9">
      <div className="space-y-2 lg:hidden">
        <p className="font-display text-xl text-ink">{tc("appName")}</p>
      </div>
      <div className="space-y-2">
        <h2 className="font-display text-3xl text-ink">{t("createAccount")}</h2>
        <p className="text-ink-muted text-sm">{t("signUpHint")}</p>
      </div>

      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="name">{t("name")}</Label>
          <Input
            id="name"
            placeholder={t("enterName")}
            autoComplete="name"
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p className="text-destructive text-sm">{t("validation.nameMin")}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t("enterEmail")}
            autoComplete="email"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-destructive text-sm">
              {t("validation.emailInvalid")}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">{t("password")}</Label>
          <Input
            id="password"
            type="password"
            placeholder={t("enterPassword")}
            autoComplete="new-password"
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="text-destructive text-sm">
              {t("validation.passwordMin")}
            </p>
          )}
        </div>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <Button type="submit" className="w-full" size="lg" disabled={pending}>
          {pending ? t("creatingAccount") : t("signUp")}
        </Button>
        <p className="text-ink-muted text-center text-sm">
          {t("hasAccount")}{" "}
          <Link
            href="/login"
            className="text-primary font-medium underline-offset-4 hover:underline"
          >
            {t("signIn")}
          </Link>
        </p>
      </form>
    </div>
  );
}
