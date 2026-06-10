"use client";

import { useEffect } from "react";

type CelebrationToastProps = {
  message: string;
  emoji: string;
  allDone: boolean;
  onDone: () => void;
};

export default function CelebrationToast({
  message,
  emoji,
  allDone,
  onDone,
}: CelebrationToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, allDone ? 1400 : 800);
    return () => window.clearTimeout(timer);
  }, [onDone, allDone]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-6"
      role="status"
      aria-live="polite"
    >
      <div
        className={`flex max-w-sm items-center gap-3 rounded-2xl border-2 border-accent-soft/50 bg-card/95 px-4 py-3 shadow-[0_12px_32px_var(--shadow)] ${
          allDone ? "animate-celebration-toast-long" : "animate-celebration-toast"
        }`}
      >
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
