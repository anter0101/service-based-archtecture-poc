import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";

import "@dms/ui/globals.css";

const display = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const body = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sign in — DMS",
  description: "Authenticate to the federated workspace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${display.variable} ${body.variable} min-h-screen font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
