import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("../../packages/i18n/src/request.ts");

const nextConfig: NextConfig = {
  transpilePackages: [
    "@dms/ui",
    "@dms/auth",
    "@dms/api-client",
    "@dms/i18n",
    "@dms/types",
  ],
};

export default withNextIntl(nextConfig);
