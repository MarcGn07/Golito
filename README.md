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

The three games' actual play screens (the quiz boards themselves)
aren't built yet — this is the foundation (auth, data, design system,
admin) to build them on top of next.

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

## Next steps

- Build the actual play screens for each game (timer + free-text
  input for Tenable, drag-to-timeline for Hitster, click-to-sort for
  Scaleboard, slider for Price Tag, per-player slider for Squad
  Stats), each posting a row into `game_results` on completion
- Copy the Tenable admin pattern (`app/admin/tenable/`) for the other
  four games
- Fuzzy-match player name input (aliases/typo tolerance) for Tenable
  and Squad Stats
