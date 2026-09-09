import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { createClient } from "@/lib/supabase/server";
import { logOut } from "@/app/auth/actions";

export default async function AccountPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, is_admin")
    .eq("id", user.id)
    .single();

  const { data: results } = await supabase
    .from("game_results")
    .select("game, score, max_score, played_at")
    .order("played_at", { ascending: false })
    .limit(10);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold">{profile?.username}</h1>
        <p className="text-muted-light dark:text-muted-dark">{user.email}</p>

        {profile?.is_admin && (
          <a href="/admin" className="mt-4 inline-block text-sm underline">
            Go to admin →
          </a>
        )}

        <h2 className="mt-10 font-display text-xl font-semibold">Recent results</h2>
        <ul className="mt-4 flex flex-col gap-2">
          {results?.map((r, i) => (
            <li
              key={i}
              className="surface flex items-center justify-between rounded-2xl px-5 py-3"
            >
              <span className="capitalize">{r.game}</span>
              <span className="text-muted-light dark:text-muted-dark">
                {r.score}
                {r.max_score ? ` / ${r.max_score}` : ""}
              </span>
            </li>
          ))}
          {results?.length === 0 && (
            <p className="text-muted-light dark:text-muted-dark">
              No games played yet — go pick one!
            </p>
          )}
        </ul>

        <form action={logOut} className="mt-10">
          <button type="submit" className="btn-secondary">
            Log out
          </button>
        </form>
      </main>
    </>
  );
}
