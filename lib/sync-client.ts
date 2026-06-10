import type { Idea } from "@/lib/ideas";
import { ensureEssentials } from "@/lib/essentials";
import { migrateTodos } from "@/lib/migrate";
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
    const hasLocal =
      local.todos.length > 0 ||
      local.ideas.length > 0 ||
      local.updatedAt > 0;
    if (hasLocal) {
      const merged = { ...local, updatedAt: Date.now() };
      applyCloudData(merged);
      await pushCloudSync(merged);
      return merged;
    }
    return local;
  }

  if (cloud.updatedAt >= local.updatedAt) {
    applyCloudData(cloud);
    return cloud;
  }

  const merged: BelleSyncData = {
    ...local,
    updatedAt: Date.now(),
  };
  applyCloudData(merged);
  await pushCloudSync(merged);
  return merged;
}

let pushTimer: ReturnType<typeof setTimeout> | null = null;

export function scheduleCloudPush(getData: () => BelleSyncData) {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    const snapshot = getData();
    const payload = { ...snapshot, updatedAt: Date.now() };
    writeSyncMeta({ updatedAt: payload.updatedAt });
    void pushCloudSync(payload);
  }, 700);
}
