-- Golito — Tenable flags
-- Lets each answer (typically a player) carry an optional national
-- flag, shown once the answer is guessed. flag_code matches the
-- codes used by the flag-icons library / lib/flags.ts on the
-- frontend (ISO 3166-1 alpha-2, plus a few FIFA-specific codes like
-- gb-eng, gb-sct, gb-wls, gb-nir and xk for Kosovo).

alter table public.tenable_answers
  add column flag_code text;
