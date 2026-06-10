"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import BelleAvatar from "@/components/BelleAvatar";
import BookAvatar from "@/components/BookAvatar";
import BottomNav from "@/components/BottomNav";
import { useCloudRefresh } from "@/hooks/useCloudRefresh";
import { todayString } from "@/lib/dates";
import {
  entryForDate,
  loadJournal,
  pastEntries,
  saveJournal,
  upsertJournalEntry,
  type JournalEntry,
} from "@/lib/journal";
import {
  hydrateFromCloud,
  readLocalIdeas,
  readLocalTodos,
  refreshFromCloud,
  scheduleCloudPush,
} from "@/lib/sync-client";
import { formatJournalDate, verseForDate } from "@/lib/verses";

export default function JournalApp() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [today, setToday] = useState(todayString);
  const [reflection, setReflection] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [showPast, setShowPast] = useState(false);

  const verse = useMemo(() => verseForDate(today), [today]);
  const previous = useMemo(() => pastEntries(entries, today), [entries, today]);

  useEffect(() => {
    function refreshToday() {
      const next = todayString();
      setToday((current) => (current === next ? current : next));
    }

    window.addEventListener("focus", refreshToday);
    document.addEventListener("visibilitychange", refreshToday);
    return () => {
      window.removeEventListener("focus", refreshToday);
      document.removeEventListener("visibilitychange", refreshToday);
    };
  }, []);

  useEffect(() => {
    const entry = entryForDate(entries, today);
    setReflection(entry?.text ?? "");
  }, [entries, today]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await hydrateFromCloud();
        if (!cancelled) {
          setEntries(data.journal);
        }
      } catch {
        if (!cancelled) {
          setEntries(loadJournal());
        }
      } finally {
        if (!cancelled) setHydrated(true);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const onCloudRefresh = useCallback(
    (data: Awaited<ReturnType<typeof refreshFromCloud>>) => {
      if (data) setEntries(data.journal);
    },
    [],
  );

  useCloudRefresh(onCloudRefresh);

  useEffect(() => {
    if (!hydrated) return;
    saveJournal(entries);
    scheduleCloudPush(() => ({
      todos: readLocalTodos(),
      ideas: readLocalIdeas(),
      journal: entries,
      updatedAt: Date.now(),
    }));
  }, [entries, hydrated]);

  function updateReflection(text: string) {
    setReflection(text);
    setEntries((prev) => upsertJournalEntry(prev, today, text));
  }

  return (
    <div className="safe-px safe-pt relative min-h-dvh overflow-x-hidden pb-24">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="animate-float-slow absolute -left-20 top-10 h-48 w-48 rounded-full bg-lavender/50 blur-3xl" />
        <div className="animate-float-slower absolute -right-16 top-1/3 h-56 w-56 rounded-full bg-mint/60 blur-3xl" />
      </div>

      <main className="relative mx-auto w-full max-w-lg pt-2 sm:pt-4">
        <header className="mb-4 text-center sm:mb-6">
          <p className="mb-1 text-xs font-semibold tracking-wide text-accent sm:text-sm">
            ✿ pause + breathe ✿
          </p>
          <h1 className="text-[1.75rem] font-extrabold leading-tight text-foreground sm:text-4xl">
            journal + reflection
          </h1>
          <p className="mt-1.5 flex flex-wrap items-center justify-center gap-x-1.5 text-sm text-foreground/70">
            <BookAvatar size={24} />
            <span>{formatJournalDate(today)}</span>
            <BelleAvatar size={28} />
          </p>
        </header>

        <section className="mb-3 rounded-[1.25rem] border border-white/80 bg-card/90 p-3 shadow-[0_16px_40px_var(--shadow)] backdrop-blur-sm sm:p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-lg" aria-hidden>
              ✝
            </span>
            <p className="text-xs font-bold uppercase tracking-wide text-accent">
              verse of the day
            </p>
          </div>
          <blockquote className="paper-slip rounded-xl border border-accent-soft/45 bg-background/70 px-3 py-3">
            <p className="text-sm leading-relaxed text-foreground/85">
              &ldquo;{verse.text}&rdquo;
            </p>
            <footer className="mt-2 text-right text-xs font-bold text-accent">
              — {verse.reference}
            </footer>
          </blockquote>
        </section>

        <section className="rounded-[1.25rem] border border-white/80 bg-card/90 p-3 shadow-[0_16px_40px_var(--shadow)] backdrop-blur-sm sm:p-4">
          <label
            htmlFor="journal-reflection"
            className="mb-2 block text-xs font-bold uppercase tracking-wide text-foreground/55"
          >
            today&apos;s reflection
          </label>
          {!hydrated ? (
            <p className="py-8 text-center text-sm text-foreground/45">
              Loading…
            </p>
          ) : (
            <textarea
              id="journal-reflection"
              value={reflection}
              onChange={(e) => updateReflection(e.target.value)}
              placeholder="what stood out to you today? prayers, gratitude, notes…"
              rows={8}
              className="paper-slip w-full resize-y rounded-xl border-2 border-accent-soft/60 px-3 py-2.5 text-sm leading-relaxed text-foreground outline-none transition placeholder:text-xs placeholder:text-foreground/35 focus:border-accent focus:ring-2 focus:ring-accent/15"
            />
          )}
          <p className="mt-2 text-center text-[10px] font-semibold text-foreground/40">
            saves automatically ✿
          </p>
        </section>

        {previous.length > 0 && (
          <section className="mt-3 rounded-[1.25rem] border border-white/80 bg-card/90 p-3 shadow-[0_12px_32px_var(--shadow)] backdrop-blur-sm sm:p-4">
            <button
              type="button"
              onClick={() => setShowPast((open) => !open)}
              className="flex w-full items-center justify-between gap-2 text-left"
            >
              <span className="text-xs font-bold uppercase tracking-wide text-foreground/55">
                past reflections ({previous.length})
              </span>
              <span className="text-sm text-foreground/45">
                {showPast ? "▾" : "▸"}
              </span>
            </button>

            {showPast && (
              <ul className="mt-3 space-y-2 border-t border-accent-soft/35 pt-3">
                {previous.map((entry) => (
                  <li
                    key={entry.date}
                    className="paper-slip rounded-xl border border-accent-soft/40 px-2.5 py-2"
                  >
                    <p className="text-[10px] font-bold text-accent">
                      {formatJournalDate(entry.date)}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-snug text-foreground/80">
                      {entry.text}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
