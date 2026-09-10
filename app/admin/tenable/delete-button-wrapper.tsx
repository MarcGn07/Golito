"use client";

import { DeleteButton } from "@/components/delete-button";
import { deleteTenableCategory } from "./actions";

export function DeleteButtonWrapper({ categoryId }: { categoryId: string }) {
  return <DeleteButton onDelete={() => deleteTenableCategory(categoryId)} />;
}
