"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

import { setAccessTokenGetter } from "@dms/api-client";

/** Wires the NextAuth accessToken into the shared axios client. */
export function AuthTokenProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    setAccessTokenGetter(() => session?.accessToken ?? null);
  }, [session?.accessToken]);

  return <>{children}</>;
}
