"use client";

import BookAvatar from "@/components/BookAvatar";
import { DEVOTION_ID } from "@/lib/essentials";
import type { Todo } from "@/lib/types";

type EssentialCardProps = {
  todo: Todo;
  isCompleting: boolean;
  onToggle: (id: string) => void;
};

export default function EssentialCard({
  todo,
  isCompleting,
  onToggle,
}: EssentialCardProps) {
  return (
    <div
      className={`rounded-xl border-2 border-accent/40 bg-gradient-to-br from-accent-soft/30 to-lavender/25 px-3 py-2.5 transition ${
        isCompleting ? "animate-complete-fly" : ""
      }`}
    >
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => onToggle(todo.id)}
          aria-label={
            todo.completed
              ? `Mark "${todo.text}" as not done today`
              : `Mark "${todo.text}" as done today`
          }
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
            todo.completed
              ? "border-accent bg-accent text-white"
              : "border-accent-soft bg-white active:scale-95"
          }`}
        >
          {todo.completed && (
            <span className="text-[10px] leading-none">✓</span>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <p
            className={`flex items-center gap-2 text-sm font-semibold leading-snug ${
              todo.completed
                ? "text-foreground/45 line-through decoration-accent-soft"
                : "text-foreground"
            }`}
          >
            {todo.id === DEVOTION_ID && <BookAvatar size={26} />}
            <span>{todo.text}</span>
          </p>
          <p className="text-[10px] font-semibold text-foreground/45">
            {todo.completed ? "done for today" : "resets every morning"}
          </p>
        </div>
      </div>
    </div>
  );
}
