"use client";

import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";

import { createQueryClient } from "@dms/api-client";
import { AuthSessionProvider, AuthTokenProvider } from "@dms/auth";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => createQueryClient());

  return (
    <AuthSessionProvider>
      <AuthTokenProvider>
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      </AuthTokenProvider>
    </AuthSessionProvider>
  );
}
