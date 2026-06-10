"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AddTodoForm from "@/components/AddTodoForm";
import CelebrationToast from "@/components/CelebrationToast";
import ConfettiBurst from "@/components/ConfettiBurst";
import SortableTodoList from "@/components/SortableTodoList";
import type { TodoUpdates } from "@/components/TodoItem";
import BelleAvatar from "@/components/BelleAvatar";
import BottomNav from "@/components/BottomNav";
import WeatherForecast from "@/components/WeatherForecast";
import { CATEGORIES } from "@/lib/categories";
import { allDoneEncouragement, pickEncouragement } from "@/lib/encouragements";
import { migrateTodos, reorderTodos, sortByOrder } from "@/lib/migrate";
import type {
  Category,
  CategoryFilter,
  StatusFilter,
  Todo,
} from "@/lib/types";

const STORAGE_KEY = "to-dos-items-v2";

function createId() {
  return crypto.randomUUID();
}

type Celebration = {
  message: string;
  emoji: string;
  seed: number;
};

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [category, setCategory] = useState<Category>("personal");
  const [dueDate, setDueDate] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("active");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [hydrated, setHydrated] = useState(false);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<Celebration | null>(null);

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY) ??
        localStorage.getItem("to-dos-items");
      if (saved) {
        setTodos(migrateTodos(JSON.parse(saved)));
      }
    } catch {
      setTodos([]);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos, hydrated]);

  const sortedTodos = useMemo(() => sortByOrder(todos), [todos]);

  const filteredTodos = useMemo(() => {
    return sortedTodos.filter((todo) => {
      if (categoryFilter !== "all" && todo.category !== categoryFilter) {
        return false;
      }
      if (statusFilter === "active") return !todo.completed;
      if (statusFilter === "completed") return todo.completed;
      return true;
    });
  }, [sortedTodos, statusFilter, categoryFilter]);

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.length - activeCount;

  const dismissCelebration = useCallback(() => setCelebration(null), []);

  function celebrate(wasLastOne: boolean) {
    const picked = wasLastOne ? allDoneEncouragement() : pickEncouragement();
    setCelebration({
      ...picked,
      seed: Date.now(),
    });
  }

  function addTodo(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const minOrder = todos.reduce((min, t) => Math.min(min, t.order), 0);

    setTodos((prev) => [
      {
        id: createId(),
        text,
        completed: false,
        createdAt: Date.now(),
        dueDate: dueDate || null,
        category,
        order: minOrder - 1,
      },
      ...prev,
    ]);
    setInput("");
    setDueDate("");
  }

  function toggleTodo(id: string) {
    const target = todos.find((t) => t.id === id);
    if (!target) return;

    if (target.completed) {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: false } : t)),
      );
      return;
    }

    setCompletingId(id);
    window.setTimeout(() => {
      setTodos((prev) => {
        const next = prev.map((t) =>
          t.id === id ? { ...t, completed: true } : t,
        );
        const remaining = next.filter((t) => !t.completed).length;
        celebrate(remaining === 0 && next.length > 0);
        return next;
      });
      setCompletingId(null);
    }, 420);
  }

  function deleteTodo(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function updateTodo(id: string, updates: TodoUpdates) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    );
  }

  function clearCompleted() {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }

  function handleReorder(activeId: string, overId: string) {
    setTodos((prev) => reorderTodos(prev, activeId, overId));
  }

  const filterButtons: { key: StatusFilter; label: string; count?: number }[] =
    [
      { key: "active", label: "Active", count: activeCount },
      { key: "completed", label: "Done", count: completedCount },
      { key: "all", label: "All", count: todos.length },
    ];

  return (
    <div className="safe-px safe-pt relative min-h-dvh overflow-x-hidden pb-24">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="animate-float-slow absolute -left-20 top-10 h-56 w-56 rounded-full bg-accent-soft/60 blur-3xl" />
        <div className="animate-float-slower absolute -right-16 bottom-20 h-64 w-64 rounded-full bg-mint/70 blur-3xl" />
        <div className="animate-float-slow absolute left-1/2 top-1/3 h-48 w-48 -translate-x-1/2 rounded-full bg-lavender/50 blur-3xl" />
      </div>

      {celebration && (
        <>
          <ConfettiBurst seed={celebration.seed} />
          <CelebrationToast
            message={celebration.message}
            emoji={celebration.emoji}
            onDone={dismissCelebration}
          />
        </>
      )}

      <main className="relative mx-auto w-full max-w-lg pb-2 pt-2 sm:pt-4">
        <header className="mb-5 text-center sm:mb-8">
          <p className="mb-1.5 text-xs font-semibold tracking-wide text-accent sm:mb-2 sm:text-sm">
            ✿ my cosy corner ✿
          </p>
          <h1 className="text-[2rem] font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">
            to-do(s)
          </h1>
          <p className="mt-2 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-sm text-foreground/70 sm:mt-3 sm:text-base">
            <span>one thing at a time. you got it, belle</span>
            <BelleAvatar size={34} />
          </p>

          <div className="mt-4 inline-flex max-w-full items-center gap-2.5 rounded-full border-2 border-accent-soft/50 bg-card/80 px-3.5 py-2 shadow-sm backdrop-blur-sm sm:mt-5 sm:gap-3 sm:px-4">
            <span className="animate-bear-bob text-2xl" aria-hidden>
              🐻
            </span>
            <p className="text-xs font-semibold text-foreground/75 sm:text-sm">
              {activeCount === 0
                ? "All tucked into their boxes!"
                : `${activeCount} bit${activeCount === 1 ? "" : "s"} left`}
            </p>
          </div>
        </header>

        <div className="mb-4 sm:mb-5">
          <WeatherForecast />
        </div>

        <section className="rounded-2xl border border-white/80 bg-card/90 p-3 shadow-[0_12px_40px_var(--shadow)] backdrop-blur-sm sm:p-4">
          <AddTodoForm
            input={input}
            category={category}
            dueDate={dueDate}
            onInputChange={setInput}
            onCategoryChange={setCategory}
            onDueDateChange={setDueDate}
            onSubmit={addTodo}
          />

          <div className="my-4 border-t border-accent-soft/40 sm:my-5" />

          <div className="scroll-chips -mx-0.5 mb-3 flex gap-2 overflow-x-auto pb-0.5 sm:mb-4 sm:flex-wrap sm:overflow-visible">
            {filterButtons.map(({ key, label, count }) => (
              <button
                key={key}
                type="button"
                onClick={() => setStatusFilter(key)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition active:scale-95 sm:text-sm ${
                  statusFilter === key
                    ? "bg-lavender text-foreground shadow-sm"
                    : "bg-background text-foreground/60 active:bg-accent-soft/30"
                }`}
              >
                {label}
                {count !== undefined && count > 0 && (
                  <span className="ml-1.5 opacity-70">({count})</span>
                )}
              </button>
            ))}
          </div>

          <div className="scroll-chips -mx-0.5 mb-3 flex gap-2 overflow-x-auto pb-0.5 sm:mb-4 sm:flex-wrap sm:overflow-visible">
            <button
              type="button"
              onClick={() => setCategoryFilter("all")}
              className={`shrink-0 rounded-full px-3 py-2 text-xs font-bold transition active:scale-95 ${
                categoryFilter === "all"
                  ? "bg-kraft text-foreground shadow-sm"
                  : "bg-background text-foreground/55 active:bg-kraft/60"
              }`}
            >
              📦 All boxes
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id)}
                className={`shrink-0 rounded-full px-3 py-2 text-xs font-bold transition active:scale-95 ${
                  categoryFilter === cat.id
                    ? `${cat.pill} ring-2 ring-white`
                    : "bg-background text-foreground/55 active:bg-accent-soft/25"
                }`}
              >
                {cat.emoji} {cat.boxLabel}
              </button>
            ))}
          </div>

          {!hydrated ? (
            <p className="py-10 text-center text-foreground/50">Loading…</p>
          ) : filteredTodos.length === 0 ? (
            <div className="rounded-2xl bg-background/70 px-3 py-10 text-center sm:px-4 sm:py-12">
              <p className="animate-float-gentle text-3xl">🌷</p>
              <p className="mt-3 text-sm font-semibold leading-relaxed text-foreground/80 sm:text-base">
                {statusFilter === "completed"
                  ? "Nothing checked off yet — you've got this!"
                  : statusFilter === "active"
                    ? "All caught up! Time for a tiny celebration."
                    : "Your box is empty. Add something sweet above."}
              </p>
            </div>
          ) : (
            <SortableTodoList
              todos={filteredTodos}
              completingId={completingId}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
              onReorder={handleReorder}
            />
          )}

          {completedCount > 0 && (
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-accent-soft/40 pt-3.5 text-sm sm:mt-5 sm:pt-4">
              <span className="min-w-0 text-xs text-foreground/60 sm:text-sm">
                {activeCount === 0
                  ? "All done — you're amazing! 🎀"
                  : `${activeCount} left to go`}
              </span>
              <button
                type="button"
                onClick={clearCompleted}
                className="touch-target shrink-0 font-semibold text-accent transition active:text-[#ff7a9d]"
              >
                Clear done
              </button>
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
