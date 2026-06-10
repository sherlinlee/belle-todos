import type { Idea } from "@/lib/ideas";
import type { JournalEntry } from "@/lib/journal";
import type { Todo } from "@/lib/types";

export type BelleSyncData = {
  todos: Todo[];
  ideas: Idea[];
  journal: JournalEntry[];
  updatedAt: number;
};

export const SYNC_META_KEY = "belle-sync-meta";

export type SyncMeta = {
  updatedAt: number;
};
