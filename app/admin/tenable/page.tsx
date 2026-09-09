import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { createClient } from "@/lib/supabase/server";
import { createTenableCategory, togglePublish } from "./actions";
import { PublishToggleWrapper } from "./publish-toggle-wrapper";

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
          Each category needs a title and up to 10 correct answers.
        </p>

        <form action={createTenableCategory} className="surface mt-8 flex flex-col gap-4 rounded-xl3 p-6">
          <div>
            <label htmlFor="title" className="mb-1.5 block text-sm font-medium">
              Category title
            </label>
            <input
              id="title"
              name="title"
              required
              placeholder="e.g. Teammates of Thomas Müller"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm font-medium">
              Description (optional)
            </label>
            <input
              id="description"
              name="description"
              placeholder="Extra context shown to players"
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Array.from({ length: 10 }, (_, i) => (
              <input
                key={i}
                name={`answer_${i + 1}`}
                placeholder={`Correct answer ${i + 1}`}
                className="input-field"
              />
            ))}
          </div>

          <button type="submit" className="btn-primary mt-2 self-start">
            Save category
          </button>
        </form>

        <h2 className="mt-12 font-display text-xl font-semibold">Existing categories</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {categories?.map((category) => (
            <li
              key={category.id}
              className="surface flex items-center justify-between rounded-2xl px-5 py-4"
            >
              <div>
                <p className="font-medium">{category.title}</p>
                <p className="text-sm text-muted-light dark:text-muted-dark">
                  {category.tenable_answers?.length ?? 0} answers
                </p>
              </div>
              <PublishToggleWrapper
                categoryId={category.id}
                isPublished={category.is_published}
              />
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
