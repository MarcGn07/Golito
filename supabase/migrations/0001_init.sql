-- Golito — initial schema
-- Covers: user profiles, content for all 5 games, and saved results.
-- RLS is on for every table (project has "automatic RLS" enabled),
-- so each table below gets explicit policies.

-- ============================================================
-- PROFILES
-- One row per authenticated user, created automatically on signup.
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique not null,
  avatar_url text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 1. FOOTBALL TENABLE
-- A category with exactly 10 correct answers; players try to name
-- as many as possible within a timer.
-- ============================================================
create table public.tenable_categories (
  id uuid primary key default gen_random_uuid(),
  title text not null,                  -- e.g. "Teammates of Thomas Müller"
  description text,
  is_published boolean not null default false,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create table public.tenable_answers (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.tenable_categories (id) on delete cascade,
  answer text not null,                 -- canonical correct answer
  aliases text[] not null default '{}', -- accepted spelling variants
  rank int,                             -- optional ordering (1–10)
  unique (category_id, answer)
);

alter table public.tenable_categories enable row level security;
alter table public.tenable_answers enable row level security;

create policy "Published categories are viewable by everyone"
  on public.tenable_categories for select
  using (is_published = true or exists (
    select 1 from public.profiles where id = auth.uid() and is_admin = true
  ));

create policy "Admins manage categories"
  on public.tenable_categories for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Answers are viewable with their category"
  on public.tenable_answers for select
  using (exists (
    select 1 from public.tenable_categories c
    where c.id = category_id
      and (c.is_published = true or exists (
        select 1 from public.profiles where id = auth.uid() and is_admin = true
      ))
  ));

create policy "Admins manage answers"
  on public.tenable_answers for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- ============================================================
-- 2. FOOTBALL HITSTER
-- A timeline of events; players slot a new event into the correct
-- chronological position (1 pt) and guess its exact date (3 pts).
-- ============================================================
create table public.hitster_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,               -- e.g. "Harry Kane signs for Bayern Munich"
  event_date date not null,          -- exact date used for scoring
  image_url text,
  is_published boolean not null default false,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

alter table public.hitster_events enable row level security;

create policy "Published events are viewable by everyone"
  on public.hitster_events for select
  using (is_published = true or exists (
    select 1 from public.profiles where id = auth.uid() and is_admin = true
  ));

create policy "Admins manage events"
  on public.hitster_events for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- ============================================================
-- 3. FOOTBALL SCALEBOARD
-- 12 items (clubs/players) that must be clicked in ascending order
-- according to a stated category (e.g. "most expensive transfer").
-- ============================================================
create table public.scaleboard_rounds (
  id uuid primary key default gen_random_uuid(),
  category_label text not null,   -- e.g. "Most expensive transfer ever"
  unit_label text,                -- e.g. "€m", "appearances"
  is_published boolean not null default false,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create table public.scaleboard_items (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references public.scaleboard_rounds (id) on delete cascade,
  label text not null,            -- club or player name
  value numeric not null,         -- the number that decides the correct order
  image_url text
);

alter table public.scaleboard_rounds enable row level security;
alter table public.scaleboard_items enable row level security;

create policy "Published rounds are viewable by everyone"
  on public.scaleboard_rounds for select
  using (is_published = true or exists (
    select 1 from public.profiles where id = auth.uid() and is_admin = true
  ));

create policy "Admins manage rounds"
  on public.scaleboard_rounds for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Items are viewable with their round"
  on public.scaleboard_items for select
  using (exists (
    select 1 from public.scaleboard_rounds r
    where r.id = round_id
      and (r.is_published = true or exists (
        select 1 from public.profiles where id = auth.uid() and is_admin = true
      ))
  ));

create policy "Admins manage items"
  on public.scaleboard_items for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- ============================================================
-- 4. FOOTBALL PRICE TAG
-- One named transfer; players guess the fee on a slider and score
-- points based on how close they land.
-- ============================================================
create table public.pricetag_rounds (
  id uuid primary key default gen_random_uuid(),
  player_name text not null,       -- e.g. "Ismaël Saibari"
  destination_club text not null,  -- e.g. "FC Bayern Munich"
  transfer_year int,
  actual_fee_eur numeric not null, -- e.g. 55000000
  slider_min numeric not null default 0,
  slider_max numeric not null,
  image_url text,
  is_published boolean not null default false,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

alter table public.pricetag_rounds enable row level security;

create policy "Published price tag rounds are viewable by everyone"
  on public.pricetag_rounds for select
  using (is_published = true or exists (
    select 1 from public.profiles where id = auth.uid() and is_admin = true
  ));

create policy "Admins manage price tag rounds"
  on public.pricetag_rounds for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- ============================================================
-- 5. FOOTBALL SQUAD STATS
-- A real lineup; for each player, guess a value in a stated
-- category (e.g. career goals, career yellow cards).
-- ============================================================
create table public.squadstats_rounds (
  id uuid primary key default gen_random_uuid(),
  title text not null,            -- e.g. "FC Barcelona 2014/15"
  category_label text not null,   -- e.g. "Career goals"
  unit_label text,
  is_published boolean not null default false,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create table public.squadstats_players (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references public.squadstats_rounds (id) on delete cascade,
  player_name text not null,
  position text,                  -- for lineup layout, e.g. "GK", "CB", "ST"
  shirt_number int,
  actual_value numeric not null,  -- the real value being guessed
  image_url text
);

alter table public.squadstats_rounds enable row level security;
alter table public.squadstats_players enable row level security;

create policy "Published squad stats rounds are viewable by everyone"
  on public.squadstats_rounds for select
  using (is_published = true or exists (
    select 1 from public.profiles where id = auth.uid() and is_admin = true
  ));

create policy "Admins manage squad stats rounds"
  on public.squadstats_rounds for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Squad stats players are viewable with their round"
  on public.squadstats_players for select
  using (exists (
    select 1 from public.squadstats_rounds r
    where r.id = round_id
      and (r.is_published = true or exists (
        select 1 from public.profiles where id = auth.uid() and is_admin = true
      ))
  ));

create policy "Admins manage squad stats players"
  on public.squadstats_players for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- ============================================================
-- GAME RESULTS
-- One row per completed attempt, across all 5 games. A user can
-- only ever see and insert their own results.
-- ============================================================
create type public.game_type as enum (
  'tenable', 'hitster', 'scaleboard', 'pricetag', 'squadstats'
);

create table public.game_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  game public.game_type not null,
  round_ref uuid,             -- points at the relevant *_categories/*_rounds/*_events row
  score int not null,
  max_score int,
  duration_seconds int,
  played_at timestamptz not null default now()
);

alter table public.game_results enable row level security;

create policy "Users can view their own results"
  on public.game_results for select
  using (auth.uid() = user_id);

create policy "Users can insert their own results"
  on public.game_results for insert
  with check (auth.uid() = user_id);

create index game_results_user_game_idx on public.game_results (user_id, game, played_at desc);
