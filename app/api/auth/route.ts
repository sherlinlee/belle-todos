import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  AUTH_ACTIVITY_COOKIE_NAME,
  AUTH_COOKIE_NAME,
  authCookieOptions,
  getAuthToken,
  isValidPin,
} from "@/lib/auth";

function setSessionCookies(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  token: string,
) {
  const now = Date.now();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    ...authCookieOptions,
    maxAge: 60 * 60 * 24,
  });
  cookieStore.set(AUTH_ACTIVITY_COOKIE_NAME, String(now), {
    ...authCookieOptions,
    maxAge: 60 * 60 * 24,
  });
}

function clearSessionCookies(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
) {
  cookieStore.set(AUTH_COOKIE_NAME, "", { ...authCookieOptions, maxAge: 0 });
  cookieStore.set(AUTH_ACTIVITY_COOKIE_NAME, "", {
    ...authCookieOptions,
    maxAge: 0,
  });
}

export async function POST(request: Request) {
  let pin = "";

  try {
    const body = await request.json();
    pin = typeof body.pin === "string" ? body.pin : "";
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!isValidPin(pin)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const token = getAuthToken();
  if (!token) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const cookieStore = await cookies();
  setSessionCookies(cookieStore, token);

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  clearSessionCookies(cookieStore);
  return NextResponse.json({ ok: true });
}
