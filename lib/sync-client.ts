import type { Idea } from "@/lib/ideas";
import { ensureEssentials } from "@/lib/essentials";
import { migrateTodos } from "@/lib/migrate";
import { hasUserContent, mergeSyncData } from "@/lib/sync-merge";
import {
  type BelleSyncData,
  SYNC_META_KEY,
  type SyncMeta,
} from "@/lib/sync-types";
import type { Todo } from "@/lib/types";

const TODOS_KEY = "to-dos-items-v2";
const LEGACY_TODOS_KEY = "to-dos-items";
const IDEAS_KEY = "to-dos-ideas";

export function readLocalTodos(): Todo[] {
  try {
    const saved =
      localStorage.getItem(TODOS_KEY) ?? localStorage.getItem(LEGACY_TODOS_KEY);
    if (!saved) return ensureEssentials([]);
    return ensureEssentials(migrateTodos(JSON.parse(saved)));
  } catch {
    return ensureEssentials([]);
  }
}

export function writeLocalTodos(todos: Todo[]) {
  localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
}

export function readLocalIdeas(): Idea[] {
  try {
    const raw = localStorage.getItem(IDEAS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Idea[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (idea) => typeof idea.id === "string" && typeof idea.text === "string",
    );
  } catch {
    return [];
  }
}

export function writeLocalIdeas(ideas: Idea[]) {
  localStorage.setItem(IDEAS_KEY, JSON.stringify(ideas));
}

function readSyncMeta(): SyncMeta {
  try {
    const raw = localStorage.getItem(SYNC_META_KEY);
    if (!raw) return { updatedAt: 0 };
    const parsed = JSON.parse(raw) as SyncMeta;
    return typeof parsed.updatedAt === "number"
      ? parsed
      : { updatedAt: 0 };
  } catch {
    return { updatedAt: 0 };
  }
}

function writeSyncMeta(meta: SyncMeta) {
  localStorage.setItem(SYNC_META_KEY, JSON.stringify(meta));
}

export async function fetchCloudSync(): Promise<BelleSyncData | null> {
  try {
    const res = await fetch("/api/sync", { cache: "no-store" });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      ok: boolean;
      data: BelleSyncData | null;
    };
    if (!json.ok || !json.data) return null;
    return {
      todos: ensureEssentials(migrateTodos(json.data.todos)),
      ideas: json.data.ideas,
      updatedAt: json.data.updatedAt,
    };
  } catch {
    return null;
  }
}

export async function pushCloudSync(data: BelleSyncData): Promise<boolean> {
  try {
    const res = await fetch("/api/sync", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) return false;
    writeSyncMeta({ updatedAt: data.updatedAt });
    return true;
  } catch {
    return false;
  }
}

export function buildLocalSnapshot(): BelleSyncData {
  return {
    todos: readLocalTodos(),
    ideas: readLocalIdeas(),
    updatedAt: readSyncMeta().updatedAt,
  };
}

export function applyCloudData(data: BelleSyncData) {
  writeLocalTodos(data.todos);
  writeLocalIdeas(data.ideas);
  writeSyncMeta({ updatedAt: data.updatedAt });
}

export async function hydrateFromCloud(): Promise<BelleSyncData> {
  const local = buildLocalSnapshot();
  const cloud = await fetchCloudSync();

  if (!cloud) {
    if (hasUserContent(local)) {
      const seed = { ...local, updatedAt: Date.now() };
      void pushCloudSync(seed);
    }
    return local;
  }

  const merged = mergeSyncData(local, cloud);
  applyCloudData(merged);

  const shouldPush =
    merged.updatedAt > cloud.updatedAt ||
    merged.ideas.length !== cloud.ideas.length ||
    merged.todos.length !== cloud.todos.length;

  if (shouldPush) {
    const payload = { ...merged, updatedAt: Date.now() };
    applyCloudData(payload);
    await pushCloudSync(payload);
  }

  return merged;
}

export async function refreshFromCloud(): Promise<BelleSyncData | null> {
  const local = buildLocalSnapshot();
  const cloud = await fetchCloudSync();
  if (!cloud) return null;

  const merged = mergeSyncData(local, cloud);
  applyCloudData(merged);

  if (merged.updatedAt > cloud.updatedAt) {
    const payload = { ...merged, updatedAt: Date.now() };
    applyCloudData(payload);
    await pushCloudSync(payload);
  }

  return merged;
}

let pushTimer: ReturnType<typeof setTimeout> | null = null;

export function scheduleCloudPush(getData: () => BelleSyncData) {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    const snapshot = getData();
    const payload = { ...snapshot, updatedAt: Date.now() };
    void pushCloudSync(payload);
  }, 700);
}
