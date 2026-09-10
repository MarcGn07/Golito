"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function extractAnswersFromForm(formData: FormData) {
  return Array.from({ length: 10 }, (_, i) => ({
    answer: String(formData.get(`answer_${i + 1}`) || "").trim(),
    flagCode: String(formData.get(`flag_${i + 1}`) || "").trim() || null,
    rank: i + 1,
  })).filter((a) => a.answer.length > 0);
}

export async function createTenableCategory(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const title = String(formData.get("title"));
  const description = String(formData.get("description") || "");
  const answers = extractAnswersFromForm(formData);

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
    answers.map((a) => ({
      category_id: category.id,
      answer: a.answer,
      rank: a.rank,
      flag_code: a.flagCode,
    }))
  );

  if (answersError) throw answersError;

  revalidatePath("/admin/tenable");
}

/**
 * Full replace: updates the category's own fields, then wipes and
 * re-inserts its answers to match the submitted form exactly. Simpler
 * and less error-prone than diffing individual rows for a 10-item list.
 */
export async function updateTenableCategory(categoryId: string, formData: FormData) {
  const supabase = createClient();

  const title = String(formData.get("title"));
  const description = String(formData.get("description") || "");
  const answers = extractAnswersFromForm(formData);

  if (answers.length < 1) {
    throw new Error("Add at least one correct answer.");
  }

  const { error: updateError } = await supabase
    .from("tenable_categories")
    .update({ title, description })
    .eq("id", categoryId);
  if (updateError) throw updateError;

  const { error: deleteError } = await supabase
    .from("tenable_answers")
    .delete()
    .eq("category_id", categoryId);
  if (deleteError) throw deleteError;

  const { error: insertError } = await supabase.from("tenable_answers").insert(
    answers.map((a) => ({
      category_id: categoryId,
      answer: a.answer,
      rank: a.rank,
      flag_code: a.flagCode,
    }))
  );
  if (insertError) throw insertError;

  revalidatePath("/admin/tenable");
  redirect("/admin/tenable");
}

export async function deleteTenableCategory(categoryId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("tenable_categories").delete().eq("id", categoryId);
  if (error) throw error;
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
