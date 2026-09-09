import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { getGame } from "@/lib/games";

export default function AdminPlaceholder() {
  const game = getGame("hitster")!;
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/admin" className="text-sm text-muted-light dark:text-muted-dark hover:underline">
          ← Admin
        </Link>
        <h1 className="mt-4 font-display text-3xl font-semibold">{game.name}</h1>
        <p className="mt-4 surface rounded-xl3 p-6 text-ink dark:text-paper">
          This editor follows the same pattern as the Football Tenable admin page —
          a form on top, a list with a publish toggle below. The database tables
          for {game.name} already exist and are ready to be wired up here.
        </p>
      </main>
    </>
  );
}
