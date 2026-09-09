-- Golito — grants
-- Needed because the project was created with "Automatically expose
-- new tables" turned OFF (a good security default), which means
-- Supabase did NOT automatically grant the anon/authenticated roles
-- basic table access. Row Level Security still does the real
-- filtering below — these grants just unlock the front door so RLS
-- gets a chance to run at all.

grant usage on schema public to anon, authenticated;

-- Profiles: readable by everyone (even logged-out visitors browsing
-- around), writable only by the owning user (enforced by RLS).
grant select on public.profiles to anon, authenticated;
grant update on public.profiles to authenticated;

-- Game content tables: published rows readable by everyone; writes
-- restricted to admins by RLS, but the authenticated role needs the
-- grant before RLS can even evaluate that check.
grant select on public.tenable_categories to anon, authenticated;
grant insert, update, delete on public.tenable_categories to authenticated;

grant select on public.tenable_answers to anon, authenticated;
grant insert, update, delete on public.tenable_answers to authenticated;

grant select on public.hitster_events to anon, authenticated;
grant insert, update, delete on public.hitster_events to authenticated;

grant select on public.scaleboard_rounds to anon, authenticated;
grant insert, update, delete on public.scaleboard_rounds to authenticated;

grant select on public.scaleboard_items to anon, authenticated;
grant insert, update, delete on public.scaleboard_items to authenticated;

grant select on public.pricetag_rounds to anon, authenticated;
grant insert, update, delete on public.pricetag_rounds to authenticated;

grant select on public.squadstats_rounds to anon, authenticated;
grant insert, update, delete on public.squadstats_rounds to authenticated;

grant select on public.squadstats_players to anon, authenticated;
grant insert, update, delete on public.squadstats_players to authenticated;

-- Game results: only ever touched by a logged-in player, for
-- themselves (RLS already restricts rows to auth.uid() = user_id).
grant select, insert on public.game_results to authenticated;
