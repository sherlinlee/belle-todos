"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { SESSION_INACTIVITY_MS } from "@/lib/auth";

const ACTIVITY_PING_MS = 30_000;

async function logoutToLogin() {
  try {
    await fetch("/api/auth", { method: "DELETE" });
  } catch {
    /* ignore */
  }
  window.location.href = "/login";
}

async function pingActivity() {
  try {
    const res = await fetch("/api/auth/activity", { method: "POST" });
    if (res.status === 401) {
      await logoutToLogin();
    }
  } catch {
    /* ignore transient network errors */
  }
}

export default function SessionGuard() {
  const pathname = usePathname();
  const idleTimerRef = useRef<number | null>(null);
  const lastPingRef = useRef(0);

  useEffect(() => {
    if (pathname === "/login") return;

    function scheduleIdleLogout() {
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }
      idleTimerRef.current = window.setTimeout(() => {
        void logoutToLogin();
      }, SESSION_INACTIVITY_MS);
    }

    function maybePingActivity() {
      const now = Date.now();
      if (now - lastPingRef.current < ACTIVITY_PING_MS) return;
      lastPingRef.current = now;
      void pingActivity();
    }

    function handleActivity() {
      scheduleIdleLogout();
      maybePingActivity();
    }

    scheduleIdleLogout();
    void pingActivity();

    const events: Array<keyof WindowEventMap> = [
      "pointerdown",
      "keydown",
      "touchstart",
      "scroll",
      "focusin",
    ];

    for (const event of events) {
      window.addEventListener(event, handleActivity, { passive: true });
    }

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        void pingActivity().then(() => scheduleIdleLogout());
      }
    });

    return () => {
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }
      for (const event of events) {
        window.removeEventListener(event, handleActivity);
      }
    };
  }, [pathname]);

  return null;
}
