import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { login } from "@dms/api-client";

import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        try {
          const data = await login({ email, password });
          return {
            id: String(data.user.id),
            name: data.user.name,
            email: data.user.email,
            accessToken: data.accessToken,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
});
