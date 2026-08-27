import { signOut } from "@dms/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    callbackUrl?: string;
  };
  const loginOrigin =
    process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3002";
  const locale = new URL(request.url).searchParams.get("locale") ?? "en";
  const callbackUrl =
    body.callbackUrl ?? `${loginOrigin}/${locale}/login`;

  await signOut({ redirect: false });
  return NextResponse.json({ ok: true, callbackUrl });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const locale = url.searchParams.get("locale") ?? "en";
  const loginOrigin =
    process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3002";

  await signOut({ redirect: false });
  return NextResponse.redirect(`${loginOrigin}/${locale}/login`);
}
