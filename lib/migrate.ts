import type { Todo } from "./types";

function createId() {
  return crypto.randomUUID();
}

export function migrateTodos(data: unknown): Todo[] {
  if (!Array.isArray(data)) return [];

  return data.map((item, index) => {
    const raw = item as Partial<Todo> & Record<string, unknown>;
    const category =
      raw.category === "work" || raw.category === "personal"
        ? raw.category
        : "personal";

    return {
      id: typeof raw.id === "string" ? raw.id : createId(),
      text: typeof raw.text === "string" ? raw.text : "",
      completed: Boolean(raw.completed),
      createdAt:
        typeof raw.createdAt === "number" ? raw.createdAt : Date.now(),
      dueDate: typeof raw.dueDate === "string" ? raw.dueDate : null,
      category,
      order: typeof raw.order === "number" ? raw.order : index,
    } satisfies Todo;
  });
}

export function sortByOrder(todos: Todo[]) {
  return [...todos].sort((a, b) => a.order - b.order);
}

export function reorderTodos(todos: Todo[], activeId: string, overId: string) {
  const sorted = sortByOrder(todos);
  const oldIndex = sorted.findIndex((t) => t.id === activeId);
  const newIndex = sorted.findIndex((t) => t.id === overId);
  if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return todos;

  const next = [...sorted];
  const [moved] = next.splice(oldIndex, 1);
  next.splice(newIndex, 0, moved);

  return next.map((todo, index) => ({ ...todo, order: index }));
}
