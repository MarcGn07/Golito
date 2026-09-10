import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { createClient } from "@/lib/supabase/server";
import { createTenableCategory } from "./actions";
import { CategoryForm } from "./category-form";
import { PublishToggleWrapper } from "./publish-toggle-wrapper";
import { DeleteButtonWrapper } from "./delete-button-wrapper";

export default async function TenableAdminPage() {
  const supabase = createClient();
  const { data: categories } = await supabase
    .from("tenable_categories")
    .select("id, title, is_published, tenable_answers(id)")
    .order("created_at", { ascending: false });

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/admin" className="text-sm text-muted-light dark:text-muted-dark hover:underline">
          ← Admin
        </Link>
        <h1 className="mt-4 font-display text-3xl font-semibold">Football Tenable</h1>
        <p className="mt-2 text-muted-light dark:text-muted-dark">
          Each category needs a title and up to 10 correct answers, in rank order.
        </p>

        <div className="mt-8">
          <CategoryForm action={createTenableCategory} />
        </div>

        <h2 className="mt-12 font-display text-xl font-semibold">Existing categories</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {categories?.map((category) => (
            <li
              key={category.id}
              className="surface flex items-center justify-between gap-4 rounded-2xl px-5 py-4"
            >
              <div>
                <p className="font-medium">{category.title}</p>
                <p className="text-sm text-muted-light dark:text-muted-dark">
                  {category.tenable_answers?.length ?? 0} answers
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/tenable/${category.id}/edit`}
                  className="rounded-full px-4 py-1.5 text-sm font-medium text-ink dark:text-paper hover:bg-paper-2 dark:hover:bg-ink-2"
                >
                  Edit
                </Link>
                <PublishToggleWrapper
                  categoryId={category.id}
                  isPublished={category.is_published}
                />
                <DeleteButtonWrapper categoryId={category.id} />
              </div>
            </li>
          ))}
          {categories?.length === 0 && (
            <p className="text-muted-light dark:text-muted-dark">No categories yet.</p>
          )}
        </ul>
      </main>
    </>
  );
}
