import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { createClient } from "@/lib/supabase/server";

export default async function TenableIndexPage() {
  const supabase = createClient();
  const { data: categories } = await supabase
    .from("tenable_categories")
    .select("id, title, description, tenable_answers(id)")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/" className="text-sm text-muted-light dark:text-muted-dark hover:underline">
          ← All games
        </Link>
        <h1 className="mt-4 font-display text-4xl font-semibold">Football Tenable</h1>
        <p className="mt-2 text-lg text-muted-light dark:text-muted-dark">
          Pick a category. You'll have 2 minutes to name every answer.
        </p>

        <ul className="mt-10 flex flex-col gap-3">
          {categories?.map((category) => (
            <li key={category.id}>
              <Link
                href={`/games/tenable/${category.id}`}
                className="surface flex items-center justify-between rounded-2xl px-6 py-5 transition-colors hover:border-ink/30 dark:hover:border-paper/30"
              >
                <div>
                  <p className="font-display text-lg font-semibold">{category.title}</p>
                  {category.description && (
                    <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">
                      {category.description}
                    </p>
                  )}
                </div>
                <span className="whitespace-nowrap text-sm text-muted-light dark:text-muted-dark">
                  {category.tenable_answers?.length ?? 0} answers
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {categories?.length === 0 && (
          <p className="surface mt-10 rounded-xl3 p-8 text-muted-light dark:text-muted-dark">
            No categories are published yet — check back soon.
          </p>
        )}
      </main>
    </>
  );
}
