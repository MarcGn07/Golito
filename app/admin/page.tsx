import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { GAMES } from "@/lib/games";

export default function AdminHome() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold">Admin</h1>
        <p className="mt-2 text-muted-light dark:text-muted-dark">
          Add and publish rounds for each game. Only accounts with{" "}
          <code>is_admin = true</code> can see this area.
        </p>

        <ul className="mt-8 flex flex-col gap-3">
          {GAMES.map((game) => (
            <li key={game.slug}>
              <Link
                href={`/admin/${game.slug}`}
                className="surface flex items-center justify-between rounded-2xl px-5 py-4 hover:border-ink/30 dark:hover:border-paper/30"
              >
                <span className="font-medium">{game.name}</span>
                <span className="text-muted-light dark:text-muted-dark">Manage →</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
