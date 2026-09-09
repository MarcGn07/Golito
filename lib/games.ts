export type GameSlug =
  | "tenable"
  | "hitster"
  | "scaleboard"
  | "price-tag"
  | "squad-stats";

export interface GameDefinition {
  slug: GameSlug;
  name: string;
  tagline: string;
  timerLabel: string;
  gradient: string; // Tailwind gradient classes, matches tailwind.config game colors
}

export const GAMES: GameDefinition[] = [
  {
    slug: "tenable",
    name: "Football Tenable",
    tagline: "Name all 10 before the clock runs out.",
    timerLabel: "2 min timer",
    gradient: "from-game-tenable-from to-game-tenable-to",
  },
  {
    slug: "hitster",
    name: "Football Hitster",
    tagline: "Slot each transfer into the timeline.",
    timerLabel: "10 rounds, no timer",
    gradient: "from-game-hitster-from to-game-hitster-to",
  },
  {
    slug: "scaleboard",
    name: "Football Scaleboard",
    tagline: "Sort 12 names from lowest to highest.",
    timerLabel: "12 rounds, no timer",
    gradient: "from-game-scaleboard-from to-game-scaleboard-to",
  },
  {
    slug: "price-tag",
    name: "Football Price Tag",
    tagline: "Slide to the real transfer fee.",
    timerLabel: "No timer",
    gradient: "from-game-pricetag-from to-game-pricetag-to",
  },
  {
    slug: "squad-stats",
    name: "Football Squad Stats",
    tagline: "Guess the number behind every shirt.",
    timerLabel: "No timer",
    gradient: "from-game-squadstats-from to-game-squadstats-to",
  },
];

export function getGame(slug: string): GameDefinition | undefined {
  return GAMES.find((g) => g.slug === slug);
}
