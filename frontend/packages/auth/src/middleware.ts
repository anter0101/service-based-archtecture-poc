import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { routing } from "@dms/i18n/routing";

type AuthFn = () => Promise<{ user?: unknown } | null>;

export type AuthMiddlewareOptions = {
  /** Paths that do not require a session (without locale prefix). */
  publicPaths?: string[];
  /** Origin of the auth app, e.g. http://localhost:3002 */
  loginOrigin: string;
  /** Where to send already-authenticated users on public auth pages */
  afterLoginOrigin?: string;
  /** If true, authenticated users hitting public pages redirect to afterLoginOrigin */
  redirectAuthedAwayFromPublic?: boolean;
};

const defaultPublic = ["/login", "/register"];

export function createAuthMiddleware(
  auth: AuthFn,
  options: AuthMiddlewareOptions,
) {
  const publicPaths = options.publicPaths ?? defaultPublic;

  return async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (pathname.includes("/api/auth") || pathname.includes("/_next")) {
      return NextResponse.next();
    }

    const pathnameHasLocale = routing.locales.some(
      (locale) =>
        pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
    );

    if (!pathnameHasLocale) {
      const locale = routing.defaultLocale;
      const url = new URL(`/${locale}${pathname}`, req.url);
      url.search = req.nextUrl.search;
      return NextResponse.redirect(url);
    }

    const locale = pathname.split("/")[1] ?? routing.defaultLocale;
    const pathWithoutLocale = pathname.replace(/^\/(en|ar)/, "") || "/";
    const isPublic = publicPaths.some(
      (p) => pathWithoutLocale === p || pathWithoutLocale.startsWith(`${p}/`),
    );

    const session = await auth();

    if (!session?.user && !isPublic) {
      const loginUrl = new URL(`/${locale}/login`, options.loginOrigin);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(loginUrl);
    }

    if (
      session?.user &&
      isPublic &&
      options.redirectAuthedAwayFromPublic &&
      options.afterLoginOrigin
    ) {
      return NextResponse.redirect(
        new URL(`/${locale}/home`, options.afterLoginOrigin),
      );
    }

    return NextResponse.next();
  };
}
