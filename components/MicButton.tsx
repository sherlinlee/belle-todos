"use client";

import { useEffect } from "react";
import { useMicRecorder } from "@/hooks/useMicRecorder";

type MicButtonProps = {
  onTranscript: (text: string) => void;
  className?: string;
  size?: "sm" | "md";
};

export default function MicButton({
  onTranscript,
  className = "",
  size = "md",
}: MicButtonProps) {
  const { status, error, warmUp, toggle, listening, transcribing, warming } =
    useMicRecorder();

  const dim = size === "sm" ? "h-9 w-9 text-base" : "h-11 w-11 text-lg";

  useEffect(() => {
    void warmUp();
  }, [warmUp]);

  const busy = warming || transcribing;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <button
        type="button"
        disabled={busy}
        onClick={() => void toggle(onTranscript)}
        aria-label={
          listening
            ? "Stop recording"
            : transcribing
              ? "Transcribing"
              : "Record with mic"
        }
        aria-pressed={listening}
        className={`${dim} flex shrink-0 items-center justify-center rounded-full border-2 transition active:scale-95 disabled:opacity-60 ${
          listening
            ? "animate-pulse border-accent bg-accent text-white shadow-md"
            : "border-accent-soft/70 bg-white text-foreground/70 hover:border-accent hover:text-accent"
        }`}
      >
        {busy ? "…" : listening ? "◼" : "🎙️"}
      </button>
      {listening && (
        <span className="mt-1 text-[10px] font-semibold text-accent">
          recording…
        </span>
      )}
      {transcribing && (
        <span className="mt-1 text-[10px] font-semibold text-accent">
          writing it down…
        </span>
      )}
      {warming && (
        <span className="mt-1 text-[10px] font-semibold text-foreground/45">
          warming up voice…
        </span>
      )}
      {error && (
        <span className="mt-1 max-w-[9rem] text-center text-[10px] font-semibold leading-snug text-red-500">
          {error}
        </span>
      )}
    </div>
  );
}
