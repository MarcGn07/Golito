"use client";

import { useTransition } from "react";

export function DeleteButton({ onDelete }: { onDelete: () => Promise<void> }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (confirm("Delete this category and all its answers? This can't be undone.")) {
          startTransition(onDelete);
        }
      }}
      className="rounded-full px-4 py-1.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10 disabled:opacity-50"
    >
      Delete
    </button>
  );
}
