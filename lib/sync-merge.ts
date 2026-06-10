import type { Idea } from "@/lib/ideas";
import { ensureEssentials } from "@/lib/essentials";
import { migrateTodos } from "@/lib/migrate";
import type { BelleSyncData } from "@/lib/sync-types";
import type { Todo } from "@/lib/types";

function mergeById<T extends { id: string }>(
  local: T[],
  cloud: T[],
  cloudIsNewer: boolean,
): T[] {
  const map = new Map<string, T>();

  for (const item of local) {
    map.set(item.id, item);
  }

  for (const item of cloud) {
    if (!map.has(item.id)) {
      map.set(item.id, item);
      continue;
    }
    if (cloudIsNewer) {
      map.set(item.id, item);
    }
  }

  return [...map.values()];
}

export function mergeSyncData(
  local: BelleSyncData,
  cloud: BelleSyncData,
): BelleSyncData {
  const cloudIsNewer = cloud.updatedAt >= local.updatedAt;

  const todos = ensureEssentials(
    migrateTodos(mergeById(local.todos, cloud.todos, cloudIsNewer)),
  );

  const ideas = mergeById(local.ideas, cloud.ideas, cloudIsNewer).sort(
    (a, b) => b.createdAt - a.createdAt,
  );

  return {
    todos,
    ideas,
    updatedAt: Math.max(local.updatedAt, cloud.updatedAt, Date.now()),
  };
}

export function hasUserContent(data: BelleSyncData) {
  const hasIdeas = data.ideas.length > 0;
  const hasTodos = data.todos.some((todo) => !todo.permanent);
  return hasIdeas || hasTodos;
}
