"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createTenableCategory(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const title = String(formData.get("title"));
  const description = String(formData.get("description") || "");

  // Collect answer_1..answer_10 fields from the form.
  const answers = Array.from({ length: 10 }, (_, i) =>
    String(formData.get(`answer_${i + 1}`) || "").trim()
  ).filter(Boolean);

  if (answers.length < 1) {
    throw new Error("Add at least one correct answer.");
  }

  const { data: category, error: categoryError } = await supabase
    .from("tenable_categories")
    .insert({ title, description, created_by: user.id })
    .select()
    .single();

  if (categoryError) throw categoryError;

  const { error: answersError } = await supabase.from("tenable_answers").insert(
    answers.map((answer, i) => ({
      category_id: category.id,
      answer,
      rank: i + 1,
    }))
  );

  if (answersError) throw answersError;

  revalidatePath("/admin/tenable");
}

export async function togglePublish(categoryId: string, isPublished: boolean) {
  const supabase = createClient();
  const { error } = await supabase
    .from("tenable_categories")
    .update({ is_published: isPublished })
    .eq("id", categoryId);

  if (error) throw error;
  revalidatePath("/admin/tenable");
}
