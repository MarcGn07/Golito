"use client";

import { useTransition } from "react";

export function PublishToggle({
  isPublished,
  onToggle,
}: {
  isPublished: boolean;
  onToggle: (next: boolean) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => onToggle(!isPublished))}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${
        isPublished
          ? "bg-lime text-ink"
          : "surface text-muted-light dark:text-muted-dark"
      }`}
    >
      {isPublished ? "Published" : "Draft"}
    </button>
  );
}
