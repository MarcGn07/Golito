"use server";

import { createClient } from "@/lib/supabase/server";

export interface PlayerSearchResult {
  id: string;
  name: string;
  flagCode: string | null;
}

/** Substring search over the imported players table, used for admin autocomplete. */
export async function searchPlayers(query: string): Promise<PlayerSearchResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const supabase = createClient();
  const { data, error } = await supabase
    .from("players")
    .select("id, name, flag_code")
    .ilike("name", `%${trimmed}%`)
    .order("name", { ascending: true })
    .limit(8);

  if (error || !data) return [];

  return data.map((p) => ({ id: p.id, name: p.name, flagCode: p.flag_code }));
}
