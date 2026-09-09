import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { getGame, GAMES } from "@/lib/games";

export function generateStaticParams() {
  // "tenable" has its own dedicated route group now (app/games/tenable/),
  // so this catch-all only needs to pre-render the remaining placeholders.
  return GAMES.filter((g) => g.slug !== "tenable").map((g) => ({ slug: g.slug }));
}

export default function GamePage({ params }: { params: { slug: string } }) {
  const game = getGame(params.slug);
  if (!game) notFound();

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/"
          className="text-sm text-muted-light dark:text-muted-dark hover:underline"
        >
          ← All games
        </Link>
        <h1 className="mt-4 font-display text-4xl font-semibold">{game.name}</h1>
        <p className="mt-2 text-lg text-muted-light dark:text-muted-dark">
          {game.tagline}
        </p>

        <div className="surface mt-10 rounded-xl3 p-8">
          <p className="text-ink dark:text-paper">
            This game's board is built next — the database tables and admin
            editor are already in place, ready to be filled with real
            rounds.
          </p>
        </div>
      </main>
    </>
  );
}
