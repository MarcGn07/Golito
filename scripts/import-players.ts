/**
 * Imports player master data (name + nationality flag) from the
 * transfermarkt-datasets players.csv file into Supabase's `players`
 * table, which powers the autocomplete in admin editors.
 *
 * This is a LOCAL, ONE-OFF (or occasionally re-run) tool — it is not
 * part of the deployed Next.js app and never runs in the browser.
 *
 * Usage:
 *   1. Download players.csv from https://github.com/dcaribou/transfermarkt-datasets
 *      (or its Kaggle mirror) into ./data/players.csv
 *   2. Add SUPABASE_SERVICE_ROLE_KEY to .env.local (Project Settings →
 *      API → service_role — NEVER commit this key, it bypasses RLS)
 *   3. Run: npm run import:players
 *      (or: npm run import:players -- ./some/other/path.csv)
 *
 * This does a full refresh: it clears the players table and reloads
 * it from the CSV. Safe to re-run any time — no other table has a
 * foreign key into `players`.
 */
import fs from "node:fs";
import { parse } from "csv-parse/sync";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { FIFA_FLAGS } from "../lib/flags";
import { COUNTRY_ALIASES } from "./country-aliases";

dotenv.config({ path: ".env.local" });

const CSV_PATH = process.argv[2] ?? "./data/players.csv";
const BATCH_SIZE = 500;

function countryToFlagCode(rawCountry: string | undefined): string | null {
  if (!rawCountry) return null;
  const trimmed = rawCountry.trim();
  const resolved = COUNTRY_ALIASES[trimmed.toLowerCase()] ?? trimmed;
  const match = FIFA_FLAGS.find((f) => f.name.toLowerCase() === resolved.toLowerCase());
  return match?.code ?? null;
}

function parseBirthYear(dateOfBirth: string | undefined): number | null {
  if (!dateOfBirth) return null;
  const year = new Date(dateOfBirth).getFullYear();
  return Number.isFinite(year) ? year : null;
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
    );
    process.exit(1);
  }

  if (!fs.existsSync(CSV_PATH)) {
    console.error(`No CSV found at ${CSV_PATH}. Download players.csv there first.`);
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey);

  console.log(`Reading ${CSV_PATH} …`);
  const raw = fs.readFileSync(CSV_PATH, "utf-8");
  const rows: Record<string, string>[] = parse(raw, {
    columns: true,
    skip_empty_lines: true,
  });
  console.log(`Parsed ${rows.length} rows.`);

  let unmatchedCountries = 0;
  const players = rows
    .map((row) => {
      // transfermarkt-datasets uses a "name" column; fall back to
      // first/last name in case a differently-shaped CSV is used.
      const name = row.name || [row.first_name, row.last_name].filter(Boolean).join(" ");
      if (!name.trim()) return null;

      const flagCode = countryToFlagCode(row.country_of_citizenship);
      if (row.country_of_citizenship && !flagCode) unmatchedCountries++;

      return {
        name: name.trim(),
        flag_code: flagCode,
        birth_year: parseBirthYear(row.date_of_birth),
      };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);

  console.log(
    `${players.length} players ready to import (${unmatchedCountries} had a country we ` +
      `couldn't map to a flag — check scripts/country-aliases.ts if that number looks high).`
  );

  console.log("Clearing existing players table (full refresh) …");
  const { error: deleteError } = await supabase
    .from("players")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (deleteError) {
    console.error("Failed to clear players table:", deleteError);
    process.exit(1);
  }

  for (let i = 0; i < players.length; i += BATCH_SIZE) {
    const batch = players.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from("players").insert(batch);
    if (error) {
      console.error(`Batch starting at row ${i} failed:`, error);
      process.exit(1);
    }
    console.log(`Imported ${Math.min(i + BATCH_SIZE, players.length)} / ${players.length}`);
  }

  console.log("Done.");
}

main();
