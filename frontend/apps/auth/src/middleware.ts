import NextAuth from "next-auth";

import { authConfig } from "@dms/auth/config";
import { createAuthMiddleware } from "@dms/auth/middleware";

const { auth } = NextAuth(authConfig);

export default createAuthMiddleware(auth, {
  publicPaths: ["/login", "/register"],
  loginOrigin: process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3002",
  afterLoginOrigin: process.env.NEXT_PUBLIC_SHELL_URL ?? "http://localhost:3003",
  redirectAuthedAwayFromPublic: true,
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
