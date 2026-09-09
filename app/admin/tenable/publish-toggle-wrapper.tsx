"use client";

import { PublishToggle } from "@/components/publish-toggle";
import { togglePublish } from "./actions";

export function PublishToggleWrapper({
  categoryId,
  isPublished,
}: {
  categoryId: string;
  isPublished: boolean;
}) {
  return (
    <PublishToggle
      isPublished={isPublished}
      onToggle={(next) => togglePublish(categoryId, next)}
    />
  );
}
