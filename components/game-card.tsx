import Link from "next/link";
import type { GameDefinition } from "@/lib/games";

export function GameCard({ game }: { game: GameDefinition }) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className={`group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-xl3 bg-gradient-to-br ${game.gradient} p-6 text-white transition-transform duration-150 hover:-translate-y-0.5`}
    >
      <div>
        <h3 className="font-display text-2xl font-semibold leading-tight">
          {game.name.replace("Football ", "")}
        </h3>
        <p className="mt-2 max-w-[24ch] text-sm text-white/80">{game.tagline}</p>
      </div>
      <span className="text-sm font-medium text-white/70">{game.timerLabel}</span>
    </Link>
  );
}
