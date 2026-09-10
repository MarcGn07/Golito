-- Golito — players reference table
-- Populated by scripts/import-players.ts from the transfermarkt-datasets
-- open dataset. Not linked via foreign key to any game table — when an
-- admin picks a player in the autocomplete, we simply copy their name
-- and flag_code into the answer row. That keeps every game table
-- self-contained (no join needed to display a round) and means this
-- table can be safely truncated and re-imported at any time.
--
-- Every statement below is written to be safe to run more than once,
-- in case an earlier attempt at this migration partially succeeded.

create extension if not exists pg_trgm;

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  flag_code text,
  birth_year int
);

-- Trigram index so "ILIKE '%query%'" substring search stays fast
-- even with tens of thousands of rows.
create index if not exists players_name_trgm_idx
  on public.players using gin (name gin_trgm_ops);

alter table public.players enable row level security;

drop policy if exists "Authenticated users can search players" on public.players;
create policy "Authenticated users can search players"
  on public.players for select
  using (auth.role() = 'authenticated');

grant usage on schema public to authenticated;
grant select on public.players to authenticated;

-- The import script (scripts/import-players.ts) writes with the
-- service_role key, which bypasses RLS but still needs the
-- underlying table grants — same reason profiles/tenable_* needed
-- 0002_grants.sql.
grant usage on schema public to service_role;
grant select, insert, update, delete on public.players to service_role;
