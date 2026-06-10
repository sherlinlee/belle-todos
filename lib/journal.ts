export type JournalEntry = {
  date: string;
  text: string;
  updatedAt: number;
};

const STORAGE_KEY = "belle-journal";

export function loadJournal(): JournalEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as JournalEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry) =>
        typeof entry.date === "string" &&
        typeof entry.text === "string" &&
        typeof entry.updatedAt === "number",
    );
  } catch {
    return [];
  }
}

export function saveJournal(entries: JournalEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function upsertJournalEntry(
  entries: JournalEntry[],
  date: string,
  text: string,
): JournalEntry[] {
  const existing = entries.find((entry) => entry.date === date);

  if (!text.trim()) {
    if (!existing) return entries;
    return entries.filter((entry) => entry.date !== date);
  }

  const next: JournalEntry = {
    date,
    text,
    updatedAt: Date.now(),
  };

  if (!existing) return [...entries, next];

  return entries.map((entry) => (entry.date === date ? next : entry));
}

export function entryForDate(
  entries: JournalEntry[],
  date: string,
): JournalEntry | undefined {
  return entries.find((entry) => entry.date === date);
}

export function pastEntries(entries: JournalEntry[], today: string): JournalEntry[] {
  return entries
    .filter((entry) => entry.date !== today && entry.text.trim().length > 0)
    .sort((a, b) => b.date.localeCompare(a.date));
}
