"use server";

import { createClient } from "@/lib/supabase/server";
import { isFuzzyMatch } from "@/lib/text-match";

export interface GuessResult {
  matched: boolean;
  id?: string;
  answer?: string;
}

/**
 * Checks a free-text guess against a category's answers on the server,
 * so the full answer list is never sent to the browser (which would let
 * anyone open devtools and read every answer up front).
 */
export async function checkGuess(
  categoryId: string,
  guess: string,
  alreadyFoundIds: string[]
): Promise<GuessResult> {
  if (!guess.trim()) return { matched: false };

  const supabase = createClient();
  const { data: answers, error } = await supabase
    .from("tenable_answers")
    .select("id, answer, aliases")
    .eq("category_id", categoryId);

  if (error || !answers) return { matched: false };

  for (const row of answers) {
    if (alreadyFoundIds.includes(row.id)) continue;

    const candidates = [row.answer, ...(row.aliases ?? [])];
    if (candidates.some((candidate) => isFuzzyMatch(guess, candidate))) {
      return { matched: true, id: row.id, answer: row.answer };
    }
  }

  return { matched: false };
}

/** Saves a finished round to game_results — silently does nothing if the player isn't logged in. */
export async function finishTenableRound(
  categoryId: string,
  score: number,
  maxScore: number,
  durationSeconds: number
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { saved: false };

  const { error } = await supabase.from("game_results").insert({
    user_id: user.id,
    game: "tenable",
    round_ref: categoryId,
    score,
    max_score: maxScore,
    duration_seconds: durationSeconds,
  });

  return { saved: !error };
}
