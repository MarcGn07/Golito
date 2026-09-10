import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { createClient } from "@/lib/supabase/server";
import { updateTenableCategory } from "../../actions";
import { CategoryForm } from "../../category-form";

export default async function EditTenableCategoryPage({
  params,
}: {
  params: { categoryId: string };
}) {
  const supabase = createClient();
  const { data: category } = await supabase
    .from("tenable_categories")
    .select("id, title, description, tenable_answers(answer, rank, flag_code)")
    .eq("id", params.categoryId)
    .single();

  if (!category) notFound();

  const sortedAnswers = [...(category.tenable_answers ?? [])].sort(
    (a, b) => (a.rank ?? 99) - (b.rank ?? 99)
  );

  const boundUpdate = updateTenableCategory.bind(null, category.id);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/admin/tenable"
          className="text-sm text-muted-light dark:text-muted-dark hover:underline"
        >
          ← Football Tenable
        </Link>
        <h1 className="mt-4 font-display text-3xl font-semibold">Edit category</h1>

        <div className="mt-8">
          <CategoryForm
            action={boundUpdate}
            initialTitle={category.title}
            initialDescription={category.description ?? ""}
            initialAnswers={sortedAnswers.map((a) => ({
              answer: a.answer,
              flagCode: a.flag_code,
            }))}
            submitLabel="Save changes"
          />
        </div>
      </main>
    </>
  );
}
