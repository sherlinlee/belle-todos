import type { Idea } from "@/lib/ideas";
import type { Todo } from "@/lib/types";

export type BelleSyncData = {
  todos: Todo[];
  ideas: Idea[];
  updatedAt: number;
};

export const SYNC_META_KEY = "belle-sync-meta";

export type SyncMeta = {
  updatedAt: number;
};
