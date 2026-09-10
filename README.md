# Golito ⚽

Solo football quizzes — Football Tenable, Hitster, Scaleboard, Price Tag
and Squad Stats. Built with Next.js (App Router), Tailwind CSS and
Supabase (Postgres, Auth, Row Level Security).

## What's in this starter

- Light/dark mode (Apple/Revolut-inspired design tokens in
  `tailwind.config.ts` and `app/globals.css`)
- Auth: sign up, log in, log out (Supabase Auth, cookie-based sessions
  refreshed in `middleware.ts`)
- A dashboard homepage listing all 5 games
- A full database schema for all 5 games plus saved results
  (`supabase/migrations/0001_init.sql`), with Row Level Security so
  players can only ever see their own results
- An admin area at `/admin`, gated to accounts with `is_admin = true`.
  **Football Tenable** has a complete working editor (create a
  category with 10 answers, publish/unpublish) — the other four games
  have placeholder pages ready to be built the same way.
- **Football Tenable is fully playable end to end**:
  `/games/tenable` lists published categories → `/games/tenable/[id]`
  is the play screen. Guesses only need the surname (or any
  admin-defined alias), are matched server-side so the answer list
  never reaches the browser, and land on a numbered 1–N board at
  their real rank — with a national flag next to the name if the
  admin set one. Missed answers are revealed on that same board once
  the round ends. Finished rounds are saved to `game_results` for
  logged-in players.
- The Tenable admin editor supports full CRUD: create, edit (full
  form, pre-filled), publish/unpublish, and delete — not just
  publish/draft.
- A flag picker (`lib/flags.ts`) covers FIFA member associations by
  confederation, using the `flag-icons` library so every flag shares
  a consistent aspect ratio (the odd few that are natively square —
  Switzerland, Nepal, Vatican — render at their correct 1:1 shape via
  `SQUARE_FLAG_CODES`).

Hitster, Scaleboard, Price Tag and Squad Stats still need their play
screens built — Tenable is now the reference pattern to copy.

## 1. Local setup

```bash
npm install
cp .env.local.example .env.local
```

Fill in `.env.local` with your Supabase project's values, found under
**Project Settings → Data API** in the Supabase dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

Then run:

```bash
npm run dev
```

The app runs at http://localhost:3000.

## 2. Set up the database

Open your Supabase project → **SQL Editor** → paste the full contents
of `supabase/migrations/0001_init.sql` → run it. This creates every
table, the `profiles` auto-creation trigger, and all RLS policies in
one go.

(If you prefer the CLI: `supabase link` then `supabase db push` — but
pasting into the SQL Editor works fine for now.)

## 3. Make yourself an admin

After you've signed up once through the app (so your `profiles` row
exists), run this in the SQL Editor, swapping in your email:

```sql
update public.profiles
set is_admin = true
where id = (select id from auth.users where email = 'you@example.com');
```

You'll now see an "admin" link on your account page and can visit
`/admin`.

## 4. Push to GitHub

```bash
git init
git add .
git commit -m "Initial Golito scaffold"
git branch -M main
git remote add origin https://github.com/<your-username>/golito.git
git push -u origin main
```

## 5. Deploy on Vercel

1. In Vercel, **Add New → Project** and import the `golito` repo
2. When prompted for environment variables, add the same two from
   your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy — every future push to `main` redeploys automatically, and
   every pull request gets its own preview URL

## Design tokens

- **Colors**: `ink` (dark surface), `paper` (light surface), `lime`
  (primary accent) plus a dedicated gradient pair per game under
  `game.*` in `tailwind.config.ts`
- **Type**: Space Grotesk for headlines (`font-display`), Inter for
  body/UI text (`font-body`)
- Dark mode toggles the `dark` class on `<html>`, persisted in
  `localStorage` under the `golito-theme` key

## Try it out

1. Log in as your admin account, go to `/admin/tenable`, and create a
   category with a title (e.g. "Teammates of Thomas Müller") and a
   few correct answers
2. Click "Published" on that category in the list below the form
3. Visit `/games/tenable`, pick the category, hit "Start round", and
   play it for real

## Next steps

- Build the remaining play screens: drag-to-timeline for Hitster,
  click-to-sort for Scaleboard, slider for Price Tag, per-player
  slider for Squad Stats — each follows the same shape as Tenable
  (a server component fetching metadata, a client component handling
  the interaction, a server action that grades server-side and
  writes to `game_results`)
- Copy the Tenable admin pattern (`app/admin/tenable/`) for the other
  four games
- `lib/text-match.ts` (normalize + fuzzy match) is reusable for Squad
  Stats' player-name input too
