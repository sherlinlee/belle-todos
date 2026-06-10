"use client";

import { useEffect } from "react";

const TOAST_MS = 1400;

type CelebrationToastProps = {
  message: string;
  emoji: string;
  onDone: () => void;
};

export default function CelebrationToast({
  message,
  emoji,
  onDone,
}: CelebrationToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-6"
      role="status"
      aria-live="polite"
    >
      <div className="animate-celebration-toast-long flex max-w-sm items-center gap-3 rounded-2xl border-2 border-accent-soft/50 bg-card/95 px-4 py-3 shadow-[0_12px_32px_var(--shadow)]">
        <span className="animate-celebration-once shrink-0 text-2xl">
          {emoji}
        </span>
        <p className="text-sm font-bold leading-snug text-foreground">
          {message}
        </p>
      </div>
    </div>
  );
}
