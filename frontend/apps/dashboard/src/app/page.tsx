import { redirect } from "next/navigation";

import { routing } from "@dms/i18n/routing";

export default function RootPage() {
  redirect(`/${routing.defaultLocale}/dashboard`);
}
