import type { NextRequest } from "next/server";
import {
  AUTH_ACTIVITY_COOKIE_NAME,
  AUTH_COOKIE_NAME,
  isSessionValid,
} from "@/lib/auth";

export function isRequestAuthenticated(request: NextRequest) {
  const session = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const activity = request.cookies.get(AUTH_ACTIVITY_COOKIE_NAME)?.value;
  return isSessionValid(session, activity);
}
