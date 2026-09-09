import { Navbar } from "@/components/navbar";
import { GameCard } from "@/components/game-card";
import { GAMES } from "@/lib/games";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let username: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();
    username = profile?.username ?? null;
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-muted-light dark:text-muted-dark">
          {username ? `Welcome back, ${username}` : "Play on your own, at your own pace"}
        </p>
        <h1 className="mt-1 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Five ways to test
          <br />
          your football knowledge
        </h1>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GAMES.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      </main>
    </>
  );
}
