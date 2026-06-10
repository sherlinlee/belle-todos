export function todayString() {
  return new Date().toISOString().slice(0, 10);
}

export function formatDueDate(iso: string): {
  label: string;
  tone: "default" | "today" | "soon" | "overdue";
} {
  const due = new Date(`${iso}T12:00:00`);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const diff = Math.round(
    (dueDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diff < 0) {
    const days = Math.abs(diff);
    return {
      label: days === 1 ? "Yesterday" : `${days}d overdue`,
      tone: "overdue",
    };
  }
  if (diff === 0) return { label: "Today", tone: "today" };
  if (diff === 1) return { label: "Tomorrow", tone: "soon" };
  if (diff <= 7) {
    return {
      label: due.toLocaleDateString(undefined, { weekday: "short" }),
      tone: "soon",
    };
  }

  return {
    label: due.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    tone: "default",
  };
}
